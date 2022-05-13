import MailComponent from '../components/MailWindow'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import UserProfile from '../utils/user'
import Web3 from "web3";
import {useEffect, useState, useCallback} from 'react';
import {loginUser, getContract, getUserDetails} from '../utils/mailUtils'

export default function SendMail() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [contract, setContract] = useState(null)


  useEffect(() => {    
    window.ethereum ?
      ethereum.request({ method: "eth_requestAccounts" }).then(async (accounts) => {
        setAddress(accounts[0])
        let w3 = new Web3(ethereum);
        setWeb3(w3);
        setContract(await getContract(w3));
      }).catch((err) => console.log(err))
    : console.log("Please install MetaMask")
  }, [])

  useEffect(() => {
    // Remove the next if condition -- only for testing
    if (address) {
      // console.log('Fetching User Details');
      console.log(address);
      getUserDetails(address);
    }
    if (address && !UserProfile.getKeys()) {
      loginUser(address);      
    }
  }, []);

	return (
      <main className={styles.main}>
        <h1 className={styles.title}>
          Send a new private mail!
        </h1>

        <div className={styles.grid}>
			<MailComponent
        from={address}
        contract={contract}
        />
        </div>
        <Link href="/">
        	<a>Home</a>
        </Link>
      </main>
	);
}