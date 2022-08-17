import { z } from 'zod';

import styles from './styles.module.scss';

const urlPreviewCardProps = z.object({
  title: z.string(),
  url: z.string(),
  author: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
});

export type UrlPreviewCardProps = z.infer<typeof urlPreviewCardProps>;

export const UrlPreviewCard = (props: UrlPreviewCardProps) => {
  const { url, title, author, image, description } = urlPreviewCardProps.parse(props);
  return (
    <article className={styles.card}>
      {image && (
        <div className={styles.cardLeft}>
          <img src={image} alt={title} className={styles.cardLeftImage} />
        </div>
      )}
      <div className={styles.cardRight}>
        <a href={url} target="_blank" rel="noreferrer" className={styles.cardRightTitle}>
          {title}
        </a>
        {author && <p className={styles.cardRightAuthor}>{author}</p>}
        {description && <p className={styles.cardRightDescription}>{description}</p>}
      </div>
    </article>
  );
};
