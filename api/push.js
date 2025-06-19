import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

export const config = {
  runtime: 'edge'
};

export default async function handler(req) {
  const userId = 'Uabcf3bb0b43f261d0256bf7dcac5cbb9'; // 替換成你的 LINE User ID

  await client.pushMessage(userId, {
    type: 'text',
    text: '早安～今天相信你又是收獲滿滿的一天，今天繼續「21天重啟今日語錄」來接收今日靈魂訊息卡唷 ✨'
  });

  return new Response('Push OK', { status: 200 });
}
