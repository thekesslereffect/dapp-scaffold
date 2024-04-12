import type { NextPage } from "next";
import Head from "next/head";
import { FlappyPootView } from "../views";

const FlappyPoot: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="flappy poot"
          content="Flappy Poot"
        />
      </Head>
      <FlappyPootView />
    </div>
  );
};

export default FlappyPoot;
