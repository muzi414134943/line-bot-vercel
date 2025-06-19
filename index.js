const express = require('express');
const line = require('@line/bot-sdk');
const fs = require('fs');
const path = require('path');

const progressFile = path.join(__dirname, 'progress.json');
let progress = {};

function loadProgress() {
  try {
    progress = JSON.parse(fs.readFileSync(progressFile));
  } catch (err) {
    progress = {};
  }
}

function saveProgress() {
  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
}

loadProgress();

// 用環境變數帶 LINE Token & Secret
const config = {
  channelAccessToken: 'process.env.LINE_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'process.env.LINE_CHANNEL_SECRET'
};

const client = new line.Client(config);
const app = express();

// Webhook 路徑（用於處理使用者訊息）
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

// 抽卡邏輯
async function handleEvent(event) {
  if (
    event.type === 'message' &&
    event.message.type === 'text' &&
    event.message.text === '21天重啟今日語錄'
  ) {
    const userId = event.source.userId;
    const count = (progress[userId] || 0) + 1;
    progress[userId] = count;
    saveProgress();

    const images = [     
      'https://i.postimg.cc/bw4qbB9h/1.png',
      'https://i.postimg.cc/YScwjmt2/10.png',
      'https://i.postimg.cc/hG9RmPGL/12.png',
      'https://i.postimg.cc/bYVWs2TX/21.png',
      'https://i.postimg.cc/kGg0LQvs/13.png',
      'https://i.postimg.cc/3wjzRSL9/16.png',
      'https://i.postimg.cc/NMBqkqyW/11.png',
      'https://i.postimg.cc/d14XR7cy/18.png',
      'https://i.postimg.cc/mkn5q0DZ/19.png',
      'https://i.postimg.cc/mDsRp1np/2.png',
      'https://i.postimg.cc/ZnnQwTJD/20.png',
      'https://i.postimg.cc/PfKhKxQK/6.png',
      'https://i.postimg.cc/c4Vzcy2X/22.png',
      'https://i.postimg.cc/5tWZfdm6/14.png',
      'https://i.postimg.cc/tC1fPCSs/23.png',
      'https://i.postimg.cc/13wjC7ZP/24.png',
      'https://i.postimg.cc/V6Ypbqpw/17.png',
      'https://i.postimg.cc/R0mbj1Mt/25.png',
      'https://i.postimg.cc/76n4FY8H/3.png',
      'https://i.postimg.cc/XYCRM7dR/15.png',
      'https://i.postimg.cc/BQQZGDnd/4.png',
      'https://i.postimg.cc/HnSgLZkF/5.png',
      'https://i.postimg.cc/HshmDhKy/7.png',
      'https://i.postimg.cc/Wb3Vyv9V/8.png',
      'https://i.postimg.cc/YCLHpxKy/9.png',
    ];

    // Flex Messag
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const message = {
      type: 'flex',
      altText: '今日語錄',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: randomImage,
          size: 'full',
          aspectMode: 'cover',
          aspectRatio: 'full'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '請靜心感受今日語錄的訊息吧～',
              wrap: true
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'url',
                label: '分享語錄',
                url: 'https://line.me/R/msg/text/?請靜心感受今日語錄的訊息吧～'
              }
            },
            {
              type: 'button',
              style: 'secondary',
              action: {
                type: 'url',
                label: '預約心靈旅程',
                url: 'https://www.muzisoulhealing.tw/services/'
              }
            }
          ]
        }
      }
    };
    const replyMessages = [message];
    if (count === 21) {
      replyMessages.push({
        type: 'text',
        text: '美麗的靈魂，你真的很棒🎉~恭喜你完成 21天靈魂重啟調頻，相信這21天你的收獲一定很多，歡迎分享給muzi喔~~從今天起感受不一樣的你吧！',
      });
    } else {
      replyMessages.push({
        type: 'text',
        text: `已持續抽卡 ${count}/21 天`,
      });
    }

    return client.replyMessage(event.replyToken, replyMessages);
  }

  return Promise.resolve(null);
}

// 新增 /push 路徑（給 GitHub Actions 用）
app.get('/push', async (req, res) => {
  const userId = 'Uabcf3bb0b43f261d0256bf7dcac5cbb9';
  const message = {
    type: 'text',
    text: '早安～今天相信你又是收穫滿滿的一天，今天繼續「21天重啟今日語錄」來接收今日靈魂訊息卡唷 ✨'
  };
  try {
    await client.pushMessage(userId, message);
    res.send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// 必須用 process.env.PORT (Vercel 要求)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

  module.exports = app;
