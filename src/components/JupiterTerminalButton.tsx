import React, { useEffect, useState } from 'react';
import translations from '../../public/assets/js/translations';
import { useLanguage } from 'contexts/LanguageContextProvider';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { notify } from 'utils/notifications';

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT;

const JupiterTerminalButton: React.FC = () => {
    const [terminalReady, setTerminalReady] = useState(false);
    const { language } = useLanguage();

    const handleTerminalInit = () => {
        window.Jupiter.init({
            endpoint: RPC_ENDPOINT,
            strictTokenList: false,
            formProps: {
                // fixedOutputMint: true,
                initialInputMint: "So11111111111111111111111111111111111111112",
                initialOutputMint: "CErSpNnEHUNsNw3AZJhyvekwhMpr9H3W2S71uA3pzJus",
            },
            // containerClassName: 'flex-1 top-0 left-0 z-40 w-full h-full',
        });

        // Set terminal as ready to setup the event listener
        setTerminalReady(true);
    };

    useEffect(() => {
        if (terminalReady) {
            const modalElement = document.querySelector('#jupiter-terminal'); // Adjust this selector based on actual modal class or ID

            const handleInput = (event: Event) => {
                const target = event.target as HTMLInputElement;
                if (target && target.value.startsWith('.')) {
                    target.value = target.value.replace(/^\./, ''); // Remove leading period and replace with 0.
                }
            };

            modalElement?.addEventListener('input', handleInput as EventListener, true);

            // Clean up the event listener when component unmounts
            return () => {
                modalElement?.removeEventListener('input', handleInput as EventListener, true);
            };
        }
    }, [terminalReady]);

    return (
        <button onClick={handleTerminalInit} className='button-primary'>
            <p dangerouslySetInnerHTML={{ __html: translations["home-button-main"][language] }} />
        </button>
    );
};

export default JupiterTerminalButton;