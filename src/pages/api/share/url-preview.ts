import type { NextApiRequest, NextApiResponse } from 'next';
import { parseMetaTagsFromHtml } from './parse-docs';

export default async function urlPreview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      ogTitle = '',
      ogDescription = '',
      ogImage = '',
      twitterTitle = '',
      twitterImage = '',
      twitterDescription = '',
    } = await fetch(req.query.url as string).then(async (res) =>
      parseMetaTagsFromHtml(await res.text())
    );

    return res.status(200).json({
      ok: true,
      data: {
        title: ogTitle || twitterTitle,
        description: ogDescription || twitterDescription,
        image: ogImage || twitterImage,
      },
    });
  } catch (error) {
    console.error(`[ERROR#api#share#urlPreview]\n${error}`);
    return res.status(500).json({
      ok: false,
      data: {
        reason: 'URL Preview Data not parsed',
      },
    });
  }
}
