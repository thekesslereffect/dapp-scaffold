import React, { useState } from 'react';

const PootCalc = () => {
    // State for the number of tokens and market cap
    const [numberOfTokens, setNumberOfTokens] = useState(10000);
    const [marketCap, setMarketCap] = useState(100000); // Start at the minimum market cap

    // Total number of coins (constant)
    const totalCoins = 1000000000;

    // Calculate the potential value of the tokens
    const calculateTokenValue = () => {
        return (numberOfTokens * marketCap) / totalCoins;
    };

    // Currency formatter
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        // These options ensure that we don't show decimal places
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return (
        <div className='flex flex-col gap-4  items-center text-center w-full max-w-screen-sm'>
          <h2 className="section__title new__title">
          Got enough <span>Poot?</span>
          </h2>
            <div className='text-6xl font-bold rounded py-3 px-4 '>
              <p className=''>
              <span>
                {formatter.format(calculateTokenValue())}
              </span>
              </p>
              
              
            </div>
            <div className='flex w-full'>
                <label className='flex w-full gap-4 items-center'>
                    {/* <input
                        type="number"
                        value={numberOfTokens}
                        onChange={(e) => setNumberOfTokens(parseInt(e.target.value, 10))}
                        min="0"
                        className='bg-transparent  focus:outline-none'
                    /> */}
                    <div className='flex min-w-max'>
                    Your Poot Holdings
                    </div>
                    
                    <input 
                      type="number" 
                      name="price" 
                      id="price" 
                      value={numberOfTokens}
                      onChange={(e) => setNumberOfTokens(parseInt(e.target.value, 10))}
                      className="flex w-full rounded-2xl bg-[var(--first-color)] px-3 py-2 text-center text-white " 
                      placeholder="0"
                      step={10000}
                    />
                </label>
                

            </div>
            <div className='flex w-full'>
                <label className='flex flex-col w-full gap-4 text-xl'>
                    {/* Market Cap: */}
                    <input
                        type="range"
                        value={marketCap}
                        onChange={(e) => setMarketCap(parseInt(e.target.value, 10))}
                        min="100000"
                        max="100000000"
                        step="10000"
                        className='flex w-full h-3 rounded-full appearance-none cursor-pointer range-lg  accent-[var(--first-color)]'
                    />
                    {formatter.format(marketCap)} MCap
                </label>
            </div>
        </div>
    );
};

export default PootCalc;
