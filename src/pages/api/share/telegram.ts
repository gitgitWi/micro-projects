import type { NextApiRequest, NextApiResponse } from 'next';
import { request } from 'undici';

import { UrlPreviewCardProps } from '../../../components/molecules/url-preview-card';

interface TelegramGetMeResponse {
  ok: boolean;
  result: any;
}

const BOT_BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_TOKEN}`;

export default async function telegramShareApi(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return;
  const previewProps = req.query as UrlPreviewCardProps;

  if (!previewProps.url)
    return res.status(404).json({ health: false, reason: "Request Doesn't have Query `url`" });

  const { health: botHealth, message = '' } = await botHealthCheck();
  if (!botHealth) {
    console.error(`Telegram Bot is unhealthy\n${message}`);
    return res.status(500).json({ health: false, reason: message });
  }

  const isCreated = await sendMessageToPredefinedChannel(previewProps);
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
          message: `Telegram API says\n${JSON.stringify(message)}`,
        };
      });
  } catch (error) {
    console.error(`[Error#botHealthCheck]\n, ${error}`);
    return { health: false, message: error };
  }
};

const sendMessageToPredefinedChannel = async (
  props: UrlPreviewCardProps,
  chat_id = process.env.TELEGRAM_BOT_CHAT_ID!
) => {
  const baseQs = new URLSearchParams({
    chat_id,
    parse_mode: 'HTML',
  });

  try {
    const fetchUrl = `${BOT_BASE_URL}/sendMessage?${baseQs.toString()}&text=${createMessageText(
      props.url,
      props.title,
      props.description
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
  return `<b>${title}</b>%0A<i>${url}</i>%0A${description}`;
};
