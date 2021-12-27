import Web3 from 'web3'

const resolveWeb3 = async (resolve) => {
  let { web3 } = window

  // Modern DApp Browsers
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // window.ethereum.enable().then(function () {
        // User has allowed account access to DApp...
      // });
    } catch (e) {
      // User has denied account access to DApp...
      console.log(e)
    }
  }
  // Legacy DApp Browsers
  else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  }
  // Non-DApp Browsers
  else {
    alert('You have to install MetaMask !');
  }

  resolve(web3)
}

export default () =>
  new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolveWeb3(resolve)
    })
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      resolveWeb3(resolve)
    }
  })
