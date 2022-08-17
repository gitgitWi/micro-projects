import type { NextApiRequest, NextApiResponse } from 'next';

const domParseFuncUrl = `https://clever-fox-93.deno.dev`;

export default async function urlPreview(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      title = [],
      author = [],
      description = [],
      image = [],
    } = await fetch(`${domParseFuncUrl}/?url=${req.query.url}`).then(async (res) => res.json());

    return res.status(200).json({
      ok: title.length > 0,
      data: {
        title,
        author,
        description,
        image,
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
