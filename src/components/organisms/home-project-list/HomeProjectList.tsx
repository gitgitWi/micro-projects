import { z } from 'zod';

import { HomeProjectLinkCard, homeProjectCardProps } from '../../molecules';

import styles from './styles.module.scss';

const projectType = homeProjectCardProps.extend({
  path: z.string().url(),
});

type ProjectType = z.infer<typeof projectType>;

const projects: ProjectType[] = [
  {
    projectId: 'url-tracker-blocker',
    title: 'URL Tracker Blocker',
    subtitle: 'URL에 있는 사용자 추적기 제거하기',
    description: '`QueryString`, `Paths`에 있는 사용자 추적기를 쉽게 제거해보자',
    path: '/project/url-tracker-blocker',
  },
];

export const HomeProjectList = () => {
  return (
    <main className={styles.list}>
      {projects.map(({ path, projectId, title, subtitle, description }) => (
        <HomeProjectLinkCard
          key={`project-link-to-${path}`}
          projectId={projectId}
          title={title}
          subtitle={subtitle}
          description={description}
          detailPageUrl={path}
        />
      ))}
    </main>
  );
};
