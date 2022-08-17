import { z } from 'zod';

const urlPreviewCardProps = z.object({
  title: z.string(),
  author: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
});

export type UrlPreviewCardProps = z.infer<typeof urlPreviewCardProps>;

export const UrlPreviewCard = (props: UrlPreviewCardProps) => {
  const { title, author, image, description } = urlPreviewCardProps.parse(props);
  return (
    <article>
      UrlPreviewCard
      <p>{title}</p>
      {author && <p>{author}</p>}
      {image && <img src={image} alt={title} width="150px" height="150px" />}
      {description && <p>{description}</p>}
    </article>
  );
};
