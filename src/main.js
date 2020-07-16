'use strict';
const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const Gyazo = require('gyazo-api');
const gyazoclient = new Gyazo('77da4f4d21966ad1ab497efb11406122094bbf245292d7a886cd1f60e13786a6');
require('dotenv').config({ debug: true });
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};

const app = express();
app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); 
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});
const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let mes = event.message.text;
  if (event.message.text.match("ねこ")) {
    const response = await gyazoclient.list()
    const gyazoimgUrl = response.data[0].url;
    await client.replyMessage(event.replyToken, {
        type: 'image',
        originalContentUrl: gyazoimgUrl,
        previewImageUrl: gyazoimgUrl
    });
    // await nyanpi();
    //return nyancoPic(event.source.userId);
  }
  else {
    return client.replyMessage(event.replyToken, {
      type: "text", text: '何が見たいのかな？'
    });
  }
}
// const nyanpi = async (userId) => {
//   const PiCamera = require('pi-camera');
//   const myCamera = new PiCamera({
//     mode: 'photo',
//     output: `${__dirname}/nyan.jpg`,
//     width: 640,
//     height: 480,
//     nopreview: true,
//   });
//   await myCamera.snap()
//   await gyazoclient.upload('./nyan.jpg', {
//     title: "my picture",
//     desc: "upload from nodejs"
//   })
// }
// const nyancoPic = async (userId) => {
//   const response = await gyazoclient.list()
//   const gyazoimgUrl = response.data[0].url;

//   return client.pushMessage(userId, {
//     type: 'image',
//     originalContentUrl: gyazoimgUrl,
//     previewImageUrl: gyazoimgUrl
//   });
// }

// app.listen(process.env.PORT || 8080);
// console.log(`Server running at ${PORT}`);
app.use('/.netlify/functions/server', router); //ルーティング追加
module.exports = app; //追加
module.exports.handler = serverless(app); //追加

