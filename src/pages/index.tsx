import type { NextPage } from 'next';

import { DefaultHead } from '../components/common/head';

const Home: NextPage = () => {
  return (
    <>
      <DefaultHead />

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Create <span className="text-purple-300">T3</span> App
        </h1>
        <p className="text-2xl text-gray-700">This stack uses:</p>
        <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-3 lg:w-2/3"></div>
      </main>
    </>
  );
};

export default Home;
