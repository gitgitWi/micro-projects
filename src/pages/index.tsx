import type { NextPage } from 'next';

import { DefaultHead } from '../components/common';
import { HomeTitle } from '../components/molecules';
import { HomeProjectList } from '../components/organisms';

import styles from './styles.module.scss';

const Home: NextPage = () => {
  return (
    <>
      <DefaultHead />
      <div className={styles.main}>
        <HomeTitle />
        <HomeProjectList />
      </div>
    </>
  );
};

export default Home;
