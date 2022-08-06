import { memo } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { HiLink } from 'react-icons/hi';

import styles from './styles.module.scss';

export const cardDescriptionProps = z.object({
  subtitle: z.string(),
  description: z.string().optional(),
  detailPageUrl: z.string().optional(),
});

type CardDescriptionProps = z.infer<typeof cardDescriptionProps>;

/** @todo innerHtml이 아닌 컴포넌트로 수정 */
const replaceBacktickToCode = (text: string) => {
  return { __html: text.replace(/\`(\S+)\`/g, '<code class="code-inline">$1</code>') };
};

const _CardDescription = (props: CardDescriptionProps) => {
  const { subtitle, description, detailPageUrl } = cardDescriptionProps.parse(props);

  return (
    <div className={styles.descWrapper}>
      <p className={styles.subtitle}>{subtitle}</p>
      {description && (
        <p className={styles.desc} dangerouslySetInnerHTML={replaceBacktickToCode(description)}></p>
      )}
      {detailPageUrl && (
        <Link href={detailPageUrl}>
          <div className={styles.linkWrapper}>
            <HiLink />
            <p className={styles.link}>{`${detailPageUrl}`}</p>
          </div>
        </Link>
      )}
    </div>
  );
};

export const CardDescription = memo(_CardDescription);
