import uuid from 'uuid';
import { Constants } from 'expo';
import * as firebase from 'firebase';
import 'firebase/firestore';

// symbol polyfills
global.Symbol = require('core-js/es6/symbol');
require('core-js/fn/symbol/iterator');

// collection fn polyfills
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');

class Firebase {
  constructor(config = {}) {
    firebase.initializeApp(config);
    firebase.firestore().settings({ timestampsInSnapshots: true });

    this.user = firebase.firestore().collection('user');
    this.post = firebase.firestore().collection('post');
    this.tag = firebase.firestore().collection('tag');
    this.notification = firebase.firestore().collection('notification');
  }

  init = async () => new Promise(resolve => firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      await firebase.auth().signInAnonymously();

      this.uid = (firebase.auth().currentUser || {}).uid;

      this.user.doc(`${this.uid}`).set({
        name: Constants.deviceName,
      });
    } else {
      this.uid = user.uid;
    }

    resolve(this.uid);
  }))

  getUser = async (uid = null) => {
    const userId = (!uid) ? this.uid : uid;

    try {
      const user = await this.user.doc(userId).get().then(res => res.data());

      return {
        uid: userId,
        name: user.name,
        img: user.img,
      };
    } catch ({ message }) {
      return { error: message };
    }
  }

  uploadFileAsync = async (uri) => {
    const ext = uri.split('.').slice(-1)[0];
    const path = `file/${this.uid}/${uuid.v4()}.${ext}`;

    return new Promise(async (resolve, reject) => {
      const blob = await fetch(uri).then(response => response.blob());

      const ref = firebase.storage().ref(path);
      const unsubscribe = ref.put(blob).on('state_changed',
        (state) => { },
        (err) => {
          unsubscribe();
          reject(err);
        },
        async () => {
          unsubscribe();
          const url = await ref.getDownloadURL();
          resolve(url);
        });
    });
  }

  changeUserImg = async (file = '') => {
    try {
      const remoteUri = await this.uploadFileAsync(file.uri);

      this.user.doc(`${this.uid}`).update({
        img: remoteUri,
      });

      return remoteUri;
    } catch ({ message }) {
      return { error: message };
    }
  }

  createPost = async (text = '', file = '', type = 'photo') => {
    try {
      const remoteUri = await this.uploadFileAsync(file.uri);
      const tags = text.match(/[#]{0,2}?(w*[一-龠_ぁ-ん_ァ-ヴーａ-ｚＡ-Ｚa-zA-Z0-9]+|[a-zA-Z0-9_]+|[a-zA-Z0-9_]w*)/gi);

      await this.post.add({
        text,
        timestamp: Date.now(),
        type,
        fileWidth: (type === 'photo') ? file.width : null,
        fileHeight: (type === 'photo') ? file.height : null,
        fileUri: remoteUri,
        user: this.user.doc(`${this.uid}`),
        tag: tags ? tags.reduce((acc, cur) => { acc[cur.replace(/#/, '')] = Date.now(); return acc; }, {}) : null,
      });

      if (tags) {
        await Promise.all(tags.map((tag) => {
          const t = tag.replace(/^#/, '');
          this.tag.doc(t).set({
            name: t,
          });
        }));
      }

      return true;
    } catch ({ message }) {
      return { error: message };
    }
  }

  getPost = async (pid = '0') => {
    try {
      const post = await this.post.doc(pid).get().then(res => res.data());
      const user = await post.user.get().then(res => res.data());

      user.uid = post.user.id;
      delete post.user;

      const liked = await this.user.doc(`${this.uid}`).collection('liked').doc(pid).get()
        .then(res => res.exists);

      return {
        pid,
        ...post,
        liked,
        user,
      };
    } catch ({ message }) {
      return { error: message };
    }
  }

  getPosts = async (cursor = null, num = 5) => {
    let ref = this.post.orderBy('timestamp', 'desc').limit(num);

    try {
      if (cursor) {
        ref = ref.startAfter(cursor);
      }

      const querySnapshot = await ref.get();
      const data = [];
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        if (doc.exists) {
          const post = doc.data() || {};

          const user = await post.user.get().then(res => res.data());
          user.uid = post.user.id;
          delete post.user;

          const liked = await this.user.doc(`${this.uid}`).collection('liked').doc(doc.id).get()
            .then(res => res.exists);

          data.push({
            key: doc.id,
            pid: doc.id,
            user,
            ...post,
            liked,
          });
        }
      }));

      const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

      return { data, cursor: lastVisible };
    } catch ({ message }) {
      return { error: message };
    }
  }

  getThumbnails = async ({ uid = null, tag = null }, cursor = null, num = 10) => {
    let ref;

    if (uid) {
      ref = this.post.where('user', '==', this.user.doc(uid)).orderBy('timestamp', 'desc').limit(num);
    } else if (tag) {
      ref = this.post.where(`tag.${tag.replace(/#/, '')}`, '>', 0).orderBy(`tag.${tag.replace(/#/, '')}`, 'desc').limit(num);
    } else {
      return { data: null, cursor: null };
    }

    try {
      if (cursor) {
        ref = ref.startAfter(cursor);
      }

      const querySnapshot = await ref.get();
      const data = [];
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        if (doc.exists) {
          const post = doc.data() || {};

          data.push({
            key: doc.id,
            pid: doc.id,
            thumbnail: post.fileUri,
            type: post.type,
          });
        }
      }));

      const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

      return { data, cursor: lastVisible };
    } catch ({ message }) {
      return { error: message };
    }
  }

  getTags = async (keyword = null) => {
    const strlength = keyword.length;
    const strFrontCode = keyword.slice(0, strlength - 1);
    const strEndCode = keyword.slice(strlength - 1, keyword.length);

    const startcode = keyword;
    const endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

    const querySnapshot = await this.tag.where('name', '>=', startcode).where('name', '<', endcode).get();
    return querySnapshot.docs.map(doc => ({ name: doc.id, key: doc.id }));
  }

  likePost = async (item = {}) => {
    try {
      let liked = true;
      await this.user.doc(`${this.uid}`).collection('liked').doc(`${item.pid}`).get()
        .then(async (doc) => {
          if (!doc.exists) {
            this.user.doc(`${this.uid}`).collection('liked').doc(`${item.pid}`).set({ timestamp: Date.now() });
            this.notification.add({
              type: 'like',
              uid: item.user.uid,
              post: this.post.doc(`${item.pid}`),
              from: this.user.doc(`${this.uid}`),
              timestamp: Date.now(),
            });

            liked = true;
          } else {
            this.user.doc(`${this.uid}`).collection('liked').doc(`${item.pid}`).delete();
            const querySnapshot = await this.notification.where('type', '==', 'like').where('post', '==', this.post.doc(`${item.pid}`)).where('from', '==', this.user.doc(`${this.uid}`)).get();
            await Promise.all(querySnapshot.docs.map(async (d) => { await d.ref.delete(); }));

            liked = false;
          }
        });

      return liked;
    } catch ({ message }) {
      return { error: message };
    }
  }

  getNotifications = async (cursor = null, num = 20) => {
    let ref = this.notification.where('uid', '==', this.uid).orderBy('timestamp', 'desc').limit(num);

    try {
      if (cursor) {
        ref = ref.startAfter(cursor);
      }

      const querySnapshot = await ref.get();
      const data = [];
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        if (doc.exists) {
          const notification = doc.data() || {};

          const fromUser = await notification.from.get().then(res => res.data());
          const post = await notification.post.get().then(res => res.data());

          data.push({
            key: doc.id,
            from: {
              uid: notification.from.id,
              name: fromUser.name,
              img: fromUser.img,
            },
            post: {
              pid: notification.post.id,
              fileUri: post.fileUri,
              type: post.type,
            },
          });
        }
      }));

      const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;

      return { data, cursor: lastVisible };
    } catch ({ message }) {
      return { error: message };
    }
  }
}

const fire = new Firebase(Constants.manifest.extra.firebase);
export default fire;
