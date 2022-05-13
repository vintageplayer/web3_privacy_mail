import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider'

export const initWeb3Modal = async () =>{
  const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID, // required
      },
    }
  };
  const web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions: providerOptions // required
  });

  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);
  return web3;
}

//* Here we have async funtcion
export const getWeb3 = async () => {
  // https://ethereum.stackexchange.com/questions/67145/how-to-connect-web3-with-metamask
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      return web3;
    } catch (error) {
      console.error(error);
    }
  } else if (window.web3) {
    const web3 = window.web3;
    console.log("Injected web3 detected.");
    return web3;
  } else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
    const web3 = new Web3(provider);
    console.log("No web3 instance injected, using Local web3.");
    return web3;
  }
};

//* We will return just promise in any case - we have to await it in
//* App component. I dunno better way to do that :(
// export default main();