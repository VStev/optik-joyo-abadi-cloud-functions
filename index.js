const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotificationStatusChangedUser = functions.firestore.document("Transactions/{mUid}").onUpdate(async (event) => {
  const transactionId = event.after.get("transactionId");
  let title = "Transaksi diperbarui!";
  let content = "Enjoy your new character";
  let transactionDoc = await admin.firestore().doc(`Transactions/${transactionId}`).get();
  let userUid = await transactionDoc.get("UID");
  let transactionStatus = await transactionDoc.get("status");
  let userDoc = await admin.firestore().doc(`Users/${userUid}`).get();
  let fcmToken = userDoc.get("FCMTOKEN");

  switch (transactionStatus) {
    case "PROCESSED": {
      title = "Transaksi telah diproses penjual";
      content = "Tunggu 1-3 hari untuk penjual menyiapkan barang";
      break;
    }
    case "SHIPPED": {
      title = "Transaksi telah dikirim!";
      content = "Tekan notifikasi untuk mengetahui informasi nomor pengiriman anda";
      break;
    }
    case "CANCELLED": {
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
    data: {
      "transactionId": transactionId,
    },
    token: fcmToken,
  };

  await admin.messaging().send(message);
});

exports.sendNotificationCreatedAdmin = functions.firestore.document("Transactions/{mUid}").onWrite(async (event) => {
  const title = "Transaksi baru!";
  const content = "Ada transaksi baru, tekan notifikasi untuk mengetahui informasi lebih lanjut";
  const transactionId = event.after.get("transactionId");
  let transactionDoc = await admin.firestore().doc(`Transactions/${transactionId}`).get();
  let transactionStatus = await transactionDoc.get("status");
  let userDoc = await admin.firestore().doc("Users/JzA2tDbPlsPZCmpSV9yEA7z3t5H2").get();
  let fcmToken = userDoc.get("FCMTOKEN");

  let message = {
    notification: {
      title: title,
      body: content,
    },
    data: {
      "transactionId": transactionId,
    },
    token: fcmToken,
  };
  if (transactionStatus == "WAITING FOR PAYMENT") {
    await admin.messaging().send(message);
  }
});

exports.sendEmailForUser = functions.firestore.document("Transactions/{mUid}").onWrite(async (event) => {
  const transactionId = event.after.get("transactionId");
  const total = event.after.get("total");
  const fee = event.after.get("shippingFee");
  const subTotal = event.after.get("subTotal");
  let transactionDoc = await admin.firestore().doc(`Transactions/${transactionId}`).get();
  let transactionStatus = await transactionDoc.get("status");
  let userUid = await transactionDoc.get("UID");
  admin.auth().getUser(userUid).then((userRecord) => {
    let email = userRecord.email;
    let name = userRecord.displayName;
    let emailContent = {
      "from": "Optik Joyo Abadi <mvpdemoacc@gmail.com>",
      "to": email,
      "message": {
        "subject": "Anda Telah Melakukan Transaksi Baru",
        "html": `<!DOCTYPE html>

        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
        <title></title>
        <meta charset="utf-8"/>
        <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
        <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css"/>
        <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"/>
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css"/>
        <link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet" type="text/css"/>
        <link href="https://fonts.googleapis.com/css?family=Abril+Fatface" rel="stylesheet" type="text/css"/>
        <!--<![endif]-->
        <style>
            * {
              box-sizing: border-box;
            }
        
            body {
              margin: 0;
              padding: 0;
            }
        
            a[x-apple-data-detectors] {
              color: inherit !important;
              text-decoration: inherit !important;
            }
        
            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
            }
        
            p {
              line-height: inherit
            }
        
            @media (max-width:700px) {
              .icons-inner {
                text-align: center;
              }
        
              .icons-inner td {
                margin: 0 auto;
              }
        
              .row-content {
                width: 100% !important;
              }
        
              .image_block img.big {
                width: auto !important;
              }
        
              .stack .column {
                width: 100%;
                display: block;
              }
            }
          </style>
        </head>
        <body style="background-color: #f9f9f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f9f9f9;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px;" width="680">
        <tbody>
        <tr>
        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td style="padding-bottom:10px;padding-top:10px;width:100%;padding-right:0px;padding-left:0px;">
        <div align="center" style="line-height:10px"><img alt="Yourlogo Light" src="https://firebasestorage.googleapis.com/v0/b/optik-joyo-abadi.appspot.com/o/mail%2FUntitled-Artwork.jpg?alt=media&token=e0056d20-f53a-47e7-8960-0261d2aab1f6" style="display: block; height: auto; border: 0; width: 136px; max-width: 100%;" title="Yourlogo Light" width="136"/></div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #cbdbef; color: #000000; width: 680px;" width="680">
        <tbody>
        <tr>
        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 20px; padding-bottom: 20px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td style="padding-bottom:25px;padding-left:20px;padding-right:20px;padding-top:10px;">
        <div style="font-family: Georgia, 'Times New Roman', serif">
        <div style="font-size: 14px; font-family: Georgia, Times, 'Times New Roman', serif; mso-line-height-alt: 16.8px; color: #2f2f2f; line-height: 1.2;">
        <p style="margin: 0; font-size: 14px; text-align: center;"><span style="font-size:42px;">Pesanan Diterima</span></p>
        </div>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td style="padding-bottom:10px;padding-left:30px;padding-right:30px;padding-top:10px;">
        <div style="font-family: sans-serif">
        <div style="font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 21px; color: #2f2f2f; line-height: 1.5;">
        <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">Hi <strong><u>${name}</u></strong>,</span></p>
        <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"></p>
        <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">Pesanan anda telah diterima. Segera lakukan pembayaran agar pesanan anda dapat diproses dengan segera. Ikuti cara pembayaran pada aplikasi, atau scan QR code dibawah ini dan screenshot bukti pembayaran anda. Bukti pembayaran dapat diupload melalui aplikasi dengan masuk ke detail transaksi lalu menu bukti bayar.</span></p>
        <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 21px;"></p>
        <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">Terima kasih.</span></p>
        </div>
        </div>
        </td>
        </tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" class="image_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td style="width:100%;padding-right:0px;padding-left:0px;">
        <div align="center" style="line-height:10px"><img class="big" src="https://firebasestorage.googleapis.com/v0/b/optik-joyo-abadi.appspot.com/o/mail%2Fpayqr.png?alt=media&token=4381232f-a34c-4cab-a028-306b5b829ac1" style="display: block; height: auto; border: 0; width: 680px; max-width: 100%;" width="680"/></div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px;" width="680">
        <tbody>
        <tr>
        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td style="padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:50px;">
        <div style="font-family: sans-serif">
        <div style="font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 16.8px; color: #2f2f2f; line-height: 1.2;">
        <p style="margin: 0; text-align: center; letter-spacing: 1px;"><strong><span style="font-size:18px;">Detail Pembayaran</span></strong></p>
        </div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px;" width="680">
        <tbody>
        <tr>
        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-bottom: 0px solid #5D77A9; border-left: 0px solid #5D77A9; border-right: 0px solid #5D77A9; border-top: 0px solid #5D77A9;" width="50%">
        <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td style="padding-bottom:15px;padding-left:10px;padding-right:20px;padding-top:15px;">
        <div style="font-family: sans-serif">
        <div style="font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 28px; color: #393d47; line-height: 2;">
        <p style="margin: 0; font-size: 16px; text-align: right;"><strong><span style="font-size:16px;"><span style="color:#5d77a9;">ID Transaksi</span></span></strong></p>
        <p style="margin: 0; font-size: 16px; text-align: right;"><strong><span style="font-size:16px;"><span style="color:#5d77a9;">Subtotal</span></span></strong></p>
        <p style="margin: 0; font-size: 16px; text-align: right;"><strong><span style="font-size:16px;"><span style="color:#5d77a9;">Biaya Pengiriman</span></span></strong></p>
        <p style="margin: 0; font-size: 16px; text-align: right;"><strong><span style="font-size:16px;"><span style="color:#5d77a9;">Total</span></span></strong></p>
        </div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-bottom: 0px solid #5D77A9; border-left: 0px solid #5D77A9; border-right: 0px solid #5D77A9; border-top: 0px solid #5D77A9;" width="50%">
        <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td style="padding-bottom:10px;padding-left:20px;padding-right:10px;padding-top:10px;">
        <div style="font-family: sans-serif">
        <div style="font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 28px; color: #2f2f2f; line-height: 2;">
        <p style="margin: 0; font-size: 16px; text-align: left; mso-line-height-alt: 32px;"><span style="font-size:16px;">${transactionId}</span></p>
        <p style="margin: 0; font-size: 16px; text-align: left; mso-line-height-alt: 32px;"><span style="font-size:16px;">Rp. ${subTotal}</span></p>
        <p style="margin: 0; font-size: 16px; text-align: left;">Rp. ${fee}</p>
        <p style="margin: 0; font-size: 16px; text-align: left;">Rp. ${total}</p>
        </div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px;" width="680">
        <tbody>
        <tr>
        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="text_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
        <tr>
        <td style="padding-bottom:40px;padding-left:30px;padding-right:30px;padding-top:40px;">
        <div style="font-family: sans-serif">
        <div style="font-size: 14px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 21px; color: #2f2f2f; line-height: 1.5;">
        <p style="margin: 0; font-size: 16px; text-align: center;"><span style="color:#000000;"><span style="font-size:14px;">Optik Joyo Abadi Wiyung - Bukit Akasia Blok N 32-36 Surabaya.<br/>WhatsApp 081385757599</span></span></p>
        </div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tbody>
        <tr>
        <td>
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
        <tbody>
        <tr>
        <td class="column" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
        <table border="0" cellpadding="0" cellspacing="0" class="icons_block" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td style="color:#9d9d9d;font-family:inherit;font-size:15px;padding-bottom:5px;padding-top:5px;text-align:center;">
        <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
        <tr>
        <td style="text-align:center;">
        <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
        <!--[if !vml]><!-->
        <table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">
        <!--<![endif]-->
        <tr>
        <td style="text-align:center;padding-top:5px;padding-bottom:5px;padding-left:5px;padding-right:6px;"><a href="https://www.designedwithbee.com/"><img align="center" alt="Designed with BEE" class="icon" height="32" src="images/bee.png" style="display: block; height: auto; border: 0;" width="34"/></a></td>
        <td style="font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:15px;color:#9d9d9d;vertical-align:middle;letter-spacing:undefined;text-align:center;"><a href="https://www.designedwithbee.com/" style="color:#9d9d9d;text-decoration:none;">Designed with BEE</a></td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table><!-- End -->
        </body>
        </html>`,
      },
    };
    if (transactionStatus == "WAITING FOR PAYMENT") {
      return admin.firestore().collection("mail").add(emailContent);
    }
  }).catch((error) => {
    console.log("Error fetching user data:", error);
  });
});

exports.sendNotificationStatusChangeAdmin = functions.firestore.document("Transactions/{mUid}").onUpdate(async (event) => {
  const transactionId = event.after.get("transactionId");
  let transactionDoc = await admin.firestore().doc(`Transactions/${transactionId}`).get();
  let transactionStatus = transactionDoc.get("status");
  let title = "Transaksi baru!";
  let content = "Transaksi telah dikirim";
  let userDoc = await admin.firestore().doc("Users/JzA2tDbPlsPZCmpSV9yEA7z3t5H2").get();
  let fcmToken = userDoc.get("FCMTOKEN");

  switch (transactionStatus) {
    case "CANCELLED": {
      title = "Transaksi telah dibatalkan";
      content = "Transaksi telah dibatalkan. Tekan notifikasi untuk mengetahui lebih lanjut";
      break;
    }
    case "UNCONFIRMED": {
      title = "Pembeli telah membayar";
      content = "Pembeli telah membayar, segara siapkan dan kirim barang atau tekan notifikasi untuk mengetahui lebih lanjut";
      break;
    }
    case "FINISHED": {
      title = "Pembeli telah menyelesaikan pesanan";
      content = "Transaksi telah selesai";
      break;
    }
  }

  let message = {
    notification: {
      title: title,
      body: content,
    },
    data: {
      "transactionId": transactionId,
    },
    token: fcmToken,
  };

  await admin.messaging().send(message);
});
