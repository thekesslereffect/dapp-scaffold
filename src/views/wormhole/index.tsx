// Next, React
import { FC, useEffect } from 'react';

export const WormholeView: FC = ({ }) => {
  const wormholeConfig = '{"env":"mainnet","bridgeDefaults":{"fromNetwork":"solana","toNetwork":"base"},"networks":["base","solana"]}';
  const wormholeTheme = '{"mode":"light"}';

  useEffect(() => {
    // Function to load a script dynamically
    const loadScript = (src: string) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'module';
      script.defer = true;
      document.body.appendChild(script);
    };

    // Function to load CSS dynamically
    const loadCSS = (href: string) => {
      const link = document.createElement('link');
      link.href = href;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };

    // Call the functions to load script and CSS
    loadCSS('https://www.unpkg.com/@wormhole-foundation/wormhole-connect@0.3.0/dist/main.css');
    loadScript('https://www.unpkg.com/@wormhole-foundation/wormhole-connect@0.3.0/dist/main.js');
  }, []);

  return (
    <div className="flex flex-col p-4">
      <div className="">
        <div className='mt-6'>  
         <section className="shop section text-center" id="merch">
            <h2 className="section__title shop__title">
               Wormhole
            </h2>
            <p>Jump from Solana to the BASE Network and back!</p>
            <div className="spacer"></div>
            <div className='flex flex-col text-center'>
            <div id="wormhole-connect" data-config={wormholeConfig} data-theme={wormholeTheme}></div>
            </div> 
         </section>
      </div>
    </div>
    </div>
  );
};
