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
}

const fire = new Firebase(Constants.manifest.extra.firebase);
export default fire;
