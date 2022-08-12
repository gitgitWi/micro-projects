import { z } from 'zod';

import { eraseMediumSourceQuery, mediumTrackerDescription } from '../tracker-blockers';

const BlockerHosts = z.object({
  service: z.string(),
  host: z.array(z.string()),
  blocker: z.function().args(z.string()).returns(z.string()),
  description: z.string(),
});

type BlockerHosts = z.infer<typeof BlockerHosts>;

const hosts: BlockerHosts[] = [
  {
    service: 'medium',
    host: ['medium.com', 'levelup.gitconnected.com', 'betterprogramming.pub'],
    blocker: eraseMediumSourceQuery,
    description: mediumTrackerDescription,
  },
];

export const blockerHostClassifier = (url: string): BlockerHosts | undefined => {
  const { hostname } = new URL(url);
  return hosts.find((_currentHost) => _currentHost.host.includes(hostname));
};
