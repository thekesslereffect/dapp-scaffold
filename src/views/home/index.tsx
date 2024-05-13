// Next, React
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Wallet
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Components
import { RequestAirdrop } from '../../components/RequestAirdrop';
import pkg from '../../../package.json';

// Store
import useUserSOLBalanceStore from '../../stores/useUserSOLBalanceStore';


import { useLanguage } from 'contexts/LanguageContextProvider';
import translations from '../../../public/assets/js/translations'; // Adjust the path as necessary
import PfpGenerator from 'components/PFPGenerator';

import 'remixicon/fonts/remixicon.css';


// Jupiter swap
import JupiterTerminalButton from 'components/JupiterTerminalButton';
import CharacterPop from 'components/CharacterPop';
import MemeGenerator from 'components/MemeGenerator';
import PootCalc from 'components/PootCalc';

export const HomeView: FC = ({ }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const balance = useUserSOLBalanceStore((s) => s.balance);
  const { getUserSOLBalance } = useUserSOLBalanceStore();

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);


  // Games array and links to their pages/images
   const games = [
      { link: '/flappyPoot',name:'Flappy Poot', imageUrl: '/assets/games/flappypoot/FlappyPoot.png' },
      { link: '/',name:'Poot Runner : Coming Soon!', imageUrl: '' },
      { link: '/',name:'Game 3', imageUrl: '' },
      { link: '/',name:'Game 4', imageUrl: '' },
      { link: '/',name:'Game 5', imageUrl: '' },
      // { link: '/path6',name:'Game 6', imageUrl: '' },
      // { link: '/path7',name:'Game 7', imageUrl: '' },
   ];

   // State for the current language
   const { language } = useLanguage();

  return (
    <div className="flex flex-col p-4">
      <div className="">
         <CharacterPop/>

        <div className='mt-6'>  
         <section className="home section" id="home">
            <div className="home__container container grid">
               <Image src="/assets/img/home-poot.png" alt="image" width={200} height={200} className="home__img"/>
               <div className="home__data">
                  <h1 className="home__title">
                     <p dangerouslySetInnerHTML={{ __html: translations["home-title"][language] }} />
                  </h1>
                  <p dangerouslySetInnerHTML={{ __html: translations["home-description"][language] }} className="home__description"/>
                  <div className="home__buttons">
                     {/* <a  href="https://dexscreener.com/solana/bynsx139gt2wv3mdqzfjji5yu1zsr8uup3fdapghjje8" target="_blank" rel="noreferrer" className="button-primary">
                        <p dangerouslySetInnerHTML={{ __html: translations["home-button-main"][language] }} />
                     </a> */}
                     <JupiterTerminalButton/>


                     <div className="home__stack">
                        
                        <a href="https://poot-coin.gitbook.io/poot-coin-docs/fundamentals/roadmap" target="_blank" rel="noreferrer" className="button-secondary">
                           <p dangerouslySetInnerHTML={{ __html: translations["home-button-secondary"][language] }} />
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <div className="spacer"></div>
         <section className="new section" id="how">
            <div className="new__container container grid">
               <div className="new__data">

                  <h2 className="section__title new__title">
                     <p dangerouslySetInnerHTML={{ __html: translations["how-title"][language] }} />
                  </h2>
                  
                  <p dangerouslySetInnerHTML={{ __html: translations["how-description"][language] }} className="new__description" />

               </div>
               <div className="new__content grid">
                  <article className="new__card">
                     <Image src="/assets/img/new-poot-1.png" alt="image" width={200} height={200} className="new__img"/>
                     
                     <h2 className="new__title">
                        <p dangerouslySetInnerHTML={{ __html: translations["how-ingest"][language] }} />
                     </h2>
                    
                  </article>
                  <article className="new__card">
                     <Image src="/assets/img/new-poot-2.png" alt="image" width={200} height={200} className="new__img"/>
                     <h2 className="new__title">
                        <p dangerouslySetInnerHTML={{ __html: translations["how-clench"][language] }} />
                     </h2>
                  </article>
                  <article className="new__card">
                     <Image src="/assets/img/new-poot-3.png" alt="image" width={200} height={200} className="new__img"/>
                     <h2 className="new__title">
                        <p dangerouslySetInnerHTML={{ __html: translations["how-grow"][language] }} />
                     </h2>
                  </article>
               </div>
            </div>
         </section>

         <div className="spacer"></div>
         <div className='flex flex-col w-full items-center'>
            <PootCalc/>
         </div>
         

         <div className="spacer"></div>
         <section className="flex flex-col max-w-3xl mx-auto">
         <h2 className="contact__title section__title">
            <p dangerouslySetInnerHTML={{ __html: translations["games-title"][language] }} />
         </h2>

      <div className="grid auto-rows-[200px] grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <Link key={i} href={game.link} passHref className={`relative flex items-end p-6 row-span-1 rounded-3xl overflow-hidden hover:rotate-0 hover:-translate-y-2 transition ease-in-out duration-300 border-dashed border-4 border-white ${
            [3,6].includes(i) ? "md:col-span-2 -rotate-1" : "rotate-1"
          }`}>
            {game.imageUrl ? (
               <>
              <Image
                  src={game.imageUrl}
                  alt={`Link to ${game.link}`}
                  fill
                  quality={100}
                  style={{objectFit:"cover", padding:"1rem", borderRadius:"1.5rem"}}
              />
              <div className='z-10 text-2xl'>{game.name}</div>
              </>
            ) : (
              <div className='flex items-end h-full w-full bg-[var(--body-color-dark)] rounded-xl p-4'>
               <div className='z-10 text-2xl'>{game.name}</div>   
            </div>
            )}
            
         
          </Link>
        ))}
      </div>
    </section>



         <div className="spacer"></div>
         <PfpGenerator/>


         <div className="spacer"></div>
         <MemeGenerator/>
        



         <div className="spacer"></div>
         <section className="tokenomics section" id="tokenomics">
            <div className="tokenomics__container container grid">
               <img src="assets/img/care-poot.png" alt="image" className="tokenomics__img"></img>
               <div className="tokenomics__list container grid">
                  <h2 className="section__title tokenomics__title">
                     <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-title"][language] }} />
                  </h2>

                  <article className="tokenomics__item">
                     <h1 className="tokenomics__percentage">2%</h1>
                     <h2 className="tokenomics__item-title">
                        <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-dev-title"][language] }} />
                     </h2>

                     <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-dev-description"][language] }} />

                  </article>
                  <article className="tokenomics__item">
                     <h2 className="tokenomics__percentage">8%</h2>
                     <h3 className="tokenomics__item-title">
                        <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-treasury-title"][language] }} />
                     </h3>

                     <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-treasury-description"][language] }} />
                     
                  </article>
                  <article className="tokenomics__item">
                     <h1 className="tokenomics__percentage">90%</h1>
                     <h2 className="tokenomics__item-title">
                        <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-liquidity-title"][language] }} />
                     </h2>

                     <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-liquidity-description"][language] }} />
                     
                  </article>
                  <article className="tokenomics__item">
                     <h1 className="tokenomics__percentage">100%</h1>
                     <h2 className="tokenomics__item-title">
                        <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-burn-title"][language] }} />
                     </h2>

                     <p dangerouslySetInnerHTML={{ __html: translations["tokenomics-burn-description"][language] }} />
                     
                  </article>
               </div>
            </div>
         </section>

         <div className="spacer"></div>
         <section className="shop section" id="merch">
            <h2 className="section__title shop__title">
               <p dangerouslySetInnerHTML={{ __html: translations["merch-title"][language] }} />
            </h2>
            <p dangerouslySetInnerHTML={{ __html: translations["merch-description"][language] }} className="shop__description" />
            <h1 className="shop__comingsoon">
               {/* <p dangerouslySetInnerHTML={{ __html: translations["merch-comingsoon"][language] }} /> */}
               <a href="https://poot.store" target="_blank" rel="noreferrer" className="button-primary">
                  {/* <p dangerouslySetInnerHTML={{ __html: translations["home-button-secondary"][language] }} /> */}
                  <p>Visit the Store!</p>
               </a>
            </h1>
         </section>



         <div className="spacer"></div>
         <section className="contact section" id="socials">
            <h2 className="contact__title section__title">
               <p dangerouslySetInnerHTML={{ __html: translations["socials-title"][language] }} />
            </h2>
            
            <div className="contact__container container grid">
               <img src="assets/img/social-poot.png" alt="image" className="contact__img"/>
               <div className="contact__content">
              
                     <h3 className="contact__description">
                        <p dangerouslySetInnerHTML={{ __html: translations["socials-description"][language] }} />
                     </h3>

                     <div className="contact__social justify-center items-center">
                        <a href="https://t.me/pootcoin" target="_blank" rel="noreferrer">
                           <i className="ri-telegram-fill text-white"></i>
                        </a>
                        <a href="https://twitter.com/pootcoinsol" target="_blank" rel="noreferrer">
                           <i className="ri-twitter-x-fill text-white"></i>
                        </a>
                        <a href="https://solscan.io/token/CErSpNnEHUNsNw3AZJhyvekwhMpr9H3W2S71uA3pzJus" target="_blank" rel="noreferrer">
                           <img src="assets/img/solscan.png" alt="image" className="contact__icon"/>
                        </a>
                        <a href="https://www.dextools.io/app/en/solana/pair-explorer/BynsX139gT2wv3mDqZFJji5YU1zsr8uUP3fdApgHjJE8?t=1711155292917" target="_blank" rel="noreferrer">
                           <img src="assets/img/DEXTools.png" alt="image" className="contact__icon"/>
                        </a>
                        <a href="https://dexscreener.com/solana/bynsx139gt2wv3mdqzfjji5yu1zsr8uup3fdapghjje8" target="_blank" rel="noreferrer">
                           <img src="assets/img/dexscreener.png" alt="image" className="contact__icon"/>
                        </a>
                        <a href="https://coininn.com" target="_blank" rel="noreferrer">
                           <img src="assets/img/coininn.png" alt="image" className="contact__icon"/>
                        </a>
                     </div>
                 
               </div>
            </div>
         </section>


      </div>
    </div>
    </div>
  );
};
