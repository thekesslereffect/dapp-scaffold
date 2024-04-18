// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';



const listingSites = [
  { link: 'https://dexscreener.com/solana/bynsx139gt2wv3mdqzfjji5yu1zsr8uup3fdapghjje8',name:'DexScreener' },
  { link: 'https://cntoken.io/coin/42168', name: 'CNToken'},
  { link: 'https://www.moontok.io/coins/poot-coin', name: 'MoonTok'},
  { link: 'https://www.dextools.io/app/en/solana/pair-explorer/BynsX139gT2wv3mDqZFJji5YU1zsr8uUP3fdApgHjJE8?t=1711430794994', name: 'DexTools'},
  { link: 'https://coindetector.cc/address/CErSpNnEHUNsNw3AZJhyvekwhMpr9H3W2S71uA3pzJus', name: 'CoinDetector'},
  { link: 'https://coincatapult.com/coin/poot-coin-poot', name: 'CoinCatapult'},
  { link: 'https://www.coinscope.co/coin/poot', name: 'CoinScope'},
  { link: 'https://top100token.com/address/CErSpNnEHUNsNw3AZJhyvekwhMpr9H3W2S71uA3pzJus', name: 'Top100Token'},
  { link: 'https://coinmooner.com/coin/poot-coin-poot', name: 'CoinMooner'},
  { link: 'https://gemsradar.com/coins/poot-coin', name: 'GemsRadar'},
  { link: 'https://coinsniper.net/coin/62758', name: 'CoinSniper'},
  { link: 'https://coindiscovery.app/coin/poot-coin/overview', name: 'CoinDiscovery'},
  { link: 'https://coinvote.cc/en/coin/Poot-Coin', name: 'CoinVote'},
  { link: 'https://www.freshcoins.io/coins/poot-coin', name: 'FreshCoins'},
  { link: 'https://coinboom.net/coin/poot-coin', name: 'CoinBoom'},

  { link: 'https://www.mycoinvote.com/', name: 'MyCoinVote'},
  { link: 'https://coinhunt.cc/', name: 'CoinHunt'},
  { link: 'https://cryptonextgem.com', name: 'CryptoNextGem'},
  { link: 'https://cointoplist.net', name: 'CoinTopList'},
  { link: 'https://gemfinder.cc', name: 'GemFinder'},
  { link: 'https://coingem.com/', name: 'CoinGem'},
  { link: 'https://coinmoonhunt.com', name: 'CoinMoonHunt'},
  { link: 'https://coinlists.net', name: 'CoinLists'},
  { link: 'https://cryptovotelist.com/', name: 'CryptoVoteList'},
  { link: 'https://www.rugfreecoins.com', name: 'RugFreeCoins'},
  { link: 'https://coinbazooka.com', name: 'CoinBazooka'},
];


export const ListingResourcesView: FC = ({ }) => {
  return (
    <div className="flex flex-col p-4">
      <div className="">
        <div className='mt-6'>  
         <section className="shop section text-center" id="merch">
            <h2 className="section__title shop__title">
               Listing Websites
            </h2>
            <p>You found our super secret list of websites to help get your token noticed!</p>
            <div className="spacer"></div>
            <div className='flex flex-col text-center'>
            {listingSites.map((site, i) => (
              <a href={site.link} key={i} target='_blank' rel="noreferrer">{site.name}</a>
            ))} 
            </div> 
         </section>
      </div>
    </div>
    </div>
  );
};
