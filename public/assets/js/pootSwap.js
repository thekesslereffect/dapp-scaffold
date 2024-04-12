
function swap(event) {
  window.Jupiter.init({
    endpoint: "https://mainnet.helius-rpc.com/?api-key=b2246a6c-7df9-4c82-8744-e4fe2ea4babe",
    
    formProps: {
        fixedInputMint: true,
        fixedOutputMint: true,
        initialInputMint: "So11111111111111111111111111111111111111112",
        initialOutputMint: "CErSpNnEHUNsNw3AZJhyvekwhMpr9H3W2S71uA3pzJus",
    },
  });
}

document.getElementById('swapButton').addEventListener('click', swap);


