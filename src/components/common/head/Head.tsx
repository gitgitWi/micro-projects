import { FC } from 'react';
import Head from 'next/head';
import { z } from 'zod';

import { TITLE } from './constants';

const defaultHeadProps = z.object({
  headTitle: z.string().default(TITLE).optional(),
});

type DefaultHeadProps = z.infer<typeof defaultHeadProps>;

export const DefaultHead: FC<DefaultHeadProps> = (props) => {
  const { headTitle } = defaultHeadProps.parse(props);

  return (
    <>
      <Head>
        <title>{headTitle}</title>
        <meta name="description" content={headTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};
