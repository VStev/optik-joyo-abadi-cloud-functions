const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotificationStatusChangedUser = functions.firestore.document("Transactions/{mUid}").onUpdate(async (event) => {
  const userUid = event.after.get("consumerId");
  const transactionId = event.after.get("transactionId");
  var title = "Transaksi diperbarui!";
  var content = "Enjoy your new character";
  let transactionDoc = admin.firestore().doc(`Transactions/${transactionId}`).get();
  let transactionStatus = transactionDoc.get("status");
  let userDoc = await admin.firestore().doc(`Users/${userUid}`).get();
  let fcmToken = userDoc.get("FCMTOKEN");
  
  switch (transactionStatus) {
    case "PROCESSED":{
      title = "Transaksi telah diproses penjual";
      content = "Tunggu 1-3 hari untuk seller menyiapkan barang";
      break;
    }
    case "SHIPPED":{
      title = "Transaksi telah dikirim!";
      content = "Tekan notifikasi untuk mengetahui informasi nomor pengiriman anda";
      break;
    }
    case "CANCELLED":{
      title = "Transaksi telah dibatalkan oleh penjual";
      content = "Transaksi anda dibatalkan oleh penjual. Tekan notifikasi untuk mengetahui lebih lanjut";
      break;
    }
  }

  let message = {
    notification: {
      title: title,
      body: content,
    },
    token: fcmToken,
  };

  let response = await admin.messaging().send(message);
});

exports.sendNotificationCreatedAdmin = functions.firestore.document("Transactions/{mUid}").onCreate(async (event) => {
  const title = "Transaksi baru!";
  const content = "Ada transaksi baru, tekan notifikasi untuk mengetahui informasi lebih lanjut";
  let userDoc = await admin.firestore().doc(`Users/TmfFUw0DKTZoChUGjUM6TXa4AUz2`).get();
  let fcmToken = userDoc.get("FCMTOKEN");

  let message = {
    notification: {
      title: title,
      body: content,
    },
    token: fcmToken,
  };

  let response = await admin.messaging().send(message);
});

exports.sendNotificationStatusChangeAdmin = functions.firestore.document("Transactions/{mUid}").onUpdate(async (event) => {
  const transactionId = event.after.get("transactionId");
  let transactionDoc = admin.firestore().doc(`Transactions/${transactionId}`).get();
  let transactionStatus = transactionDoc.get("status");
  var title = "Transaksi baru!";
  var content = "Ada transaksi baru, tekan notifikasi untuk mengetahui informasi lebih lanjut";
  let userDoc = await admin.firestore().doc(`Users/TmfFUw0DKTZoChUGjUM6TXa4AUz2`).get();
  let fcmToken = userDoc.get("FCMTOKEN");

  switch (transactionStatus) {
    case "CANCELLED":{
      title = "Transaksi telah dibatalkan";
      content = "Transaksi telah dibatalkan. Tekan notifikasi untuk mengetahui lebih lanjut";
      break;
    }
    case "UNCONFIRMED":{
      title = "Pembeli telah membayar";
      content = "Pembeli telah membayar, segara siapkan dan kirim barang atau tekan notifikasi untuk mengetahui lebih lanjut";
      break;
    }
  }

  let message = {
    notification: {
      title: title,
      body: content,
    },
    token: fcmToken,
  };

  let response = await admin.messaging().send(message);
});
