import { memo } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { CardDescription, cardDescriptionProps } from '../card-description/CardDescription';

import styles from './styles.module.scss';

export const homeProjectCardProps = cardDescriptionProps.extend({
  projectId: z.string(),
  title: z.string(),
});

export type HomeProjectCardProps = z.infer<typeof homeProjectCardProps>;

const _HomeProjectLinkCard = (props: HomeProjectCardProps) => {
  const { projectId, title, subtitle, description, detailPageUrl } =
    homeProjectCardProps.parse(props);
  return (
    <article className={styles.card}>
      <Link href={`/project/${projectId}`}>
        <p className={styles.title}>{title}</p>
      </Link>
      <CardDescription
        subtitle={subtitle}
        description={description}
        detailPageUrl={detailPageUrl}
      />
    </article>
  );
};

export const HomeProjectLinkCard = memo(_HomeProjectLinkCard);
