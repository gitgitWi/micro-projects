import type { NextApiRequest, NextApiResponse } from 'next';
import { request } from 'undici';

import { parseMetaTagsFromHtml } from './parse-docs';

interface TelegramGetMeResponse {
  ok: boolean;
  result: any;
}

interface TelegramSendMessageRequestBody {
  chat_id: string;
  parse_mode: string;
  text: string;
}

interface TelegramSendMessageResponse {}

const BOT_BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_TOKEN}`;

export default async function telegramShareApi(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return;
  const { targetUrl = '' } = req.query;

  if (!targetUrl)
    return res
      .status(404)
      .json({ health: false, reason: "Request Doesn't have Query `targetUrl`" });

  const { health: botHealth, message = '' } = await botHealthCheck();
  if (!botHealth) {
    console.error(`Telegram Bot is unhealthy\n${message}`);
    return res.status(500).json({ health: false, reason: message });
  }

  const isCreated = await sendMessageToPredefinedChannel(targetUrl as string);
  if (!isCreated) return res.status(500).json({ health: false, reason: 'Message Not Created' });

  return res.status(200).send({ health: true, reason: 'Message Created' });
}

const botHealthCheck = async () => {
  try {
    return request(`${BOT_BASE_URL}/getMe`, { method: 'GET' })
      .then(({ body }) => body.json())
      .then((message: TelegramGetMeResponse) => {
        return {
          health: message.ok === true && message.result.username === 'scrp_sherer_bot',
          message: `can use bot\nok: ${message.ok}\nresult: ${JSON.stringify(message.result)}`,
        };
      });
  } catch (error) {
    console.error(`[Error#botHealthCheck]\n, ${error}`);
    return { health: false, message: error };
  }
};

const sendMessageToPredefinedChannel = async (
  url: string,
  chat_id = process.env.TELEGRAM_BOT_CHAT_ID!
) => {
  const baseQs = new URLSearchParams({
    chat_id,
    parse_mode: 'HTML',
  });

  try {
    const { ogTitle, twitterTitle, ogDescription, twitterDescription } = parseMetaTagsFromHtml(
      await request(url).then(({ body }) => body.text())
    );

    const fetchUrl = `${BOT_BASE_URL}/sendMessage?${baseQs.toString()}&text=${createMessageText(
      url,
      ogTitle || twitterTitle,
      ogDescription || twitterDescription
    )}`;

    const response = await request(fetchUrl);

    const createdMessage = await response.body.json();
    if (!createdMessage.ok || !createdMessage?.result?.['message_id'])
      throw new Error(
        `Telegram Message Not Created\nfetchUrl: ${fetchUrl}\n${JSON.stringify(
          createdMessage,
          null,
          2
        )}`
      );

    return true;
  } catch (error) {
    return console.error(`[ERROR, telegramShareApi#sendMessageToPredefinedChannel]\n${error}`);
  }
};

const createMessageText = (url: string, title = url, description = '') => {
  return `<b>${title}</b>%0A- <i>${url}</i>%0A${description}`;
};
