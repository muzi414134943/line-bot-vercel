import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
});

export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  const body = await req.json();

  if (body.events) {
    await Promise.all(body.events.map(handleEvent));
  }

  return new Response('OK', { status: 200 });
}

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const keyword = event.message.text;
  const userId = event.source.userId;

  if (keyword.includes('21天重啟今日語錄')) {
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
    const randomImage = images[Math.floor(Math.random() * images.length)];

    await client.replyMessage(event.replyToken, {
      type: 'image',
      originalContentUrl: randomImage,
      previewImageUrl: randomImage
    });
  }
}
