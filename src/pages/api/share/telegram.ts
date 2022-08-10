import type { NextApiRequest, NextApiResponse } from 'next';

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

  if (!(await botHealthCheck())) {
    console.error('Telegram Bot is unhealthy');
    return res.status(500).json({ health: false, reason: 'Telegram Bot is unhealthy' });
  }

  const isCreated = await sendMessageToPredefinedChannel(targetUrl as string);
  if (!isCreated) return res.status(500).json({ health: false, reason: 'Message Not Created' });

  return res.status(200).send({ health: true, reason: 'Message Created' });
}

const botHealthCheck = () =>
  fetch(`${BOT_BASE_URL}/getMe`, { method: 'GET' })
    .then((response) => response.json())
    .then((message: TelegramGetMeResponse) => {
      return message.ok === true && message.result.username === 'scrp_sherer_bot';
    });

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
      await fetch(url).then((res) => res.text())
    );

    const fetchUrl = `${BOT_BASE_URL}/sendMessage?${baseQs.toString()}&text=${createMessageText(
      url,
      ogTitle || twitterTitle,
      ogDescription || twitterDescription
    )}`;

    const response = await fetch(fetchUrl);

    const createdMessage = await response.json();
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
