import type { NextPage } from "next";
import Head from "next/head";
import { ListingResourcesView } from "../views";

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
      <ListingResourcesView />
    </div>
  );
};

export default ListingResources;
