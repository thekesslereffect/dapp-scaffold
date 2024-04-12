import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Poot Coin</title>
        <meta
          name="description"
          content="Poot Coin"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
