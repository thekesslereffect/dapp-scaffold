import type { NextPage } from "next";
import Head from "next/head";
import { WormholeView } from "../views";

const ListingResources: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Poot Coin</title>
        <meta
          name="description"
          content="Poot Coin"
        />
      </Head>
      <WormholeView />
    </div>
  );
};

export default ListingResources;
