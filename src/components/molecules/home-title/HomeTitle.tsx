import { memo } from 'react';

import styles from './styles.module.scss';

const _HomeTitle = () => {
  return (
    <header className={styles.titleWrapper}>
      <h1 className={styles.title}>
        <b className={styles.emphasis}>Micro</b> Projects
      </h1>
      <h2 className={styles.subtitle}>
        by{' '}
        <a href="https://github.com/gitgitWi/micro-projects" className={styles.githubLink}>
          Wiii
        </a>
      </h2>
    </header>
  );
};

export const HomeTitle = memo(_HomeTitle);
