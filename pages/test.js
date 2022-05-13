import {Button, Form} from 'react-bootstrap'
import {generateKeyPair, encryptMessage, decryptMessage, encryptUsingWallet, decryptUsingWallet} from '../utils/encryptionUtils'
import {useState, useEffect} from 'react';
import {makeFileObject, storeFilesOnIPFS, storeDataOnIPFS, retrieveFile} from '../utils/web3StorageUtils'
import {emitCreateAccount, getContract} from '../utils/mailUtils'
import Web3 from 'web3'

export default function Test() {
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

	const passphrase = 'super long and hard to guess secret'

	const createKeyPair = async (event) => {		
		event.preventDefault();
		const { privateKey, publicKey } = await generateKeyPair(passphrase);
		// const encrypted = await encryptMessage(publicKey, { text: 'Hello, World!' });
		// const decrypted = await decryptMessage(encrypted, privateKey, 'super long and hard to guess secret');
	}

	const createAccount = async (event) => {
		event.preventDefault();
		const { privateKey, publicKey } = await generateKeyPair(passphrase);
		const keyData = {
			privateKey: privateKey,
			publicKey: publicKey,
			passphrase: passphrase
		}

		// Encrypt keys & passphrase with wallet
		const encryptedKeyData = await encryptUsingWallet(keyData, address);
		const encryptedKeyFileName = `web3_mail_info`;
		const encryptedKeyFile = makeFileObject(encryptedKeyData, encryptedKeyFileName);


		// Upload Public Key to IPFS
		const publicKeyData = JSON.stringify({
			publicKey: publicKey
		});
		const publicKeyFileName = `web3_mail_pkey`;
		const publicKeyFile = makeFileObject(publicKeyData, publicKeyFileName);
		const keyCID = await storeFilesOnIPFS([encryptedKeyFile, publicKeyFile])
		// Emit Event with address, and the CID
		console.log(keyCID);
		await emitCreateAccount(address, keyCID, contract);
	}

	const fetchKeys = async (event) => {
		if (event) {
			event.preventDefault();
		}
		// If Account Exists, the CID should be available
		const cid = 'bafybeibhqhlmj47j4rzzwye2pvvxldpgjj27mg3jkllxzzplst2dcqnwe4';		

		// Given CID, fetch the file
		const keyFileData = await retrieveFile(cid, 'web3_mail_info', 'blob');
		const encryptedKeyData = `0x${keyFileData}`;
		console.log(encryptedKeyData);
		// Decrypt the Contents with web3 wallet
		const keyData = await decryptUsingWallet(encryptedKeyData, address);
		console.log(JSON.parse(keyData)['privateKey']);
		return keyData;
	}

	const fetchPublicKey = async (event) => {
		if (event) {
			event.preventDefault();
		}

		// For the entered reciver's address, get the query the public key cid
		const cid = 'bafybeiflhdlks7wqg7vsj722wssdmlxjjvcrmki4lxstulbyvxkydgghye'

		// Given CID, fetch the file
		const publicKeyData = await retrieveFile(cid, 'web3_mail_pkey');
		// console.log(publicKeyData['publicKey']);

		// Return Public Key to encrypt data
		return publicKeyData['publicKey'];
	}

	const encryptMail = async (event) => {
		event.preventDefault();
		// For the entered reciver's address, get the query the public key cid
		const publicKey = await fetchPublicKey();

		// given message and public key, encrypt the data
		const message = { text: 'Hello, World!' };
		const encrypted = await encryptMessage(message, publicKey);
		console.log(encrypted);

		// Return the encrypted data
		return encrypted;
	}

	const decryptMail = async (event) => {
		event.preventDefault();
	}

	return (
		<>
			<p>{address}</p>
			<Button variant="primary" onClick={createKeyPair}>
				Create Key Pair
			</Button>
			&nbsp;
			<Button variant="primary" onClick={createAccount}>
				Create Account
			</Button>
			&nbsp;
			<Button variant="primary" onClick={fetchKeys}>
				Fetch Keys
			</Button>
			&nbsp;
			<Button variant="primary" onClick={fetchPublicKey}>
				Fetch Public Key
			</Button>			
			&nbsp;
			<Button variant="primary" onClick={encryptMail}>
				Encrypt Mail
			</Button>			
			&nbsp;
			<Button variant="primary" onClick={decryptMail}>
				Decrypt Mail
			</Button>
			<br />			
		</>
	);
}