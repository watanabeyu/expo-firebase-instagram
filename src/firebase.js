import { Constants } from 'expo';
import * as firebase from 'firebase';
import 'firebase/firestore';

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
}

const fire = new Firebase(Constants.manifest.extra.firebase);
export default fire;
