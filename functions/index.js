const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const app = admin.initializeApp();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '128MB'
}

exports.pushSendByLike2 = functions.runWith(runtimeOpts)
  .firestore
  .document('user/{fromUID}/liked/{likedPost}')
  .onCreate(async (snap, context) => {
    const likedPost = context.params.likedPost;

    const data = snap.data();

    const post = await app.firestore().collection("post").doc(likedPost).get().then(doc => doc.data());
    const user = await post.user.get().then(doc => doc.data())

    const { deviceToken = null, locale = "ja_jp" } = user
    if (!deviceToken) {
      console.log("user don't have deviceToken");
      return true;
    }

    const response = fetch('https://exp.host/--/api/v2/push/send', {
      method: "POST",
      body: JSON.stringify([{
        to: deviceToken,
        badge: 1, // この数字が待受画面でアプリアイコンの右上に赤く出てくる
        title: (locale === "ja_jp") ? "新しい通知" : "New notification",
        body: (locale === "ja_jp") ? "いいねされました" : "Your post liked",
        data: {
          screen: "NotificationTab"
        },
        channelId: "Default"
      }]),
      headers: {
        'content-type': 'application/json',
      }
    }).then(res => res.json())

    if (response.errors) {
      console.error("push failed")
    } else {
      console.log("push success")
    }
  })