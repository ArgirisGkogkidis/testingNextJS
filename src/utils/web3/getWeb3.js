import Web3 from 'web3'

const resolveWeb3 = (resolve) => {
  let { web3 } = window
  const alreadyInjected = typeof web3 !== 'undefined' // i.e. Mist/Metamask
  const localProvider = `http://localhost:8545`

  // if (alreadyInjected) {
  //   console.log(`Injected web3 detected.`)
  //   web3 = new Web3(web3.currentProvider)
  // } else {
  //   console.log(`No web3 instance injected, using Local web3.`)
  //   const provider = new Web3.providers.HttpProvider(localProvider)
  //   web3 = new Web3(provider)
  // }

  // Modern DApp Browsers
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      window.ethereum.enable().then(function () {
        // User has allowed account access to DApp...
      });
    } catch (e) {
      // User has denied account access to DApp...
      alert('skata ^ 2')
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
