import Head from 'next/head';
import Link from 'next/link'
import { z } from 'zod';

import { TITLE } from './constants';

const defaultHeadProps = z.object({
  headTitle: z.string().optional(),
});

type DefaultHeadProps = z.infer<typeof defaultHeadProps>;

export const DefaultHead = (props: DefaultHeadProps) => {
  const { headTitle = TITLE } = defaultHeadProps.parse(props);

  return (
    <>
      <Head>
        <Link href="/">
        <title>{headTitle}</title>
        </Link>
        <meta name="description" content={headTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};
