import { load } from 'cheerio/lib/slim';

export const parseMetaTagsFromHtml = (htmlString: string) => {
  const $head = load(htmlString.replace(/\<body\s+[\n]*[\s\S]*\<\/body\>/, ''));

  return {
    ogTitle: $head('meta[property=og:title]').attr()?.content,
    ogDescription: $head('meta[property=og:description]').attr()?.content,
    ogImage: $head('meta[property=og:image]').attr()?.content,
    twitterTitle: $head('meta[name=twitter:title]').attr()?.content,
    twitterDescription: $head('meta[name=twitter:description]').attr()?.content,
    twitterImage: $head('meta[name=twitter:image]').attr()?.content,
  };
};
