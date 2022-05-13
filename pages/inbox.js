import MailComponent from '../components/MailWindow'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import UserProfile from '../utils/user'
import {getMails, loginUser} from '../utils/mailUtils'
import {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button'

export default function ShowMail() {
  const [address, setAddress] = useState(null);
  const [mails, setMails] = useState([]);
  const [showMail, setShowMail] = useState(null);

  useEffect(() => {
    window.ethereum ?
      ethereum.request({ method: "eth_requestAccounts" }).then(async (accounts) => {
        setAddress(accounts[0])
        UserProfile.setInbox(null)
      }).catch((err) => console.log(err))
    : console.log("Please install MetaMask")
  }, [])

  useEffect(() => {
    async function loadMails() {
      console.log(UserProfile.getInbox())
      const mailList = await getMails(UserProfile);
      console.log('Got Mails:');
      console.log(mailList);
      setMails(mailList);
    }
    console.log(address);
    if (address){
      if(!UserProfile.getInbox()) {
        loginUser(address);
      } else {
        loadMails();
      }
    }
    
  }, []);

  function clearShowMail() {    
    setShowMail(null);
  }

	return (
      <main className={styles.main}>
        <h1 className={styles.title}>
          Send a new private mail!
        </h1>
        Mail Count: {mails.length} 
        <div className={styles.grid}>
        { (showMail == null ) ?
          (<ul>
            { mails.length > 0 && mails.map((mail, index) => (
              <li key={index}>From: {mail.from} | Subject: {mail.subject} <Button onClick={(e) => {setShowMail(index)}}>Open</Button></li>
            ))}
          </ul>
          ) :
          <MailComponent
            sender={mails[showMail].from}
            subject={mails[showMail].subject}
            mailBody={mails[showMail].body}
            readOnly={true}
            cid={"bafybeifblgpfoqmegmoxuqpys43dcer7up55twlwojk7sqfqe6xo5gouna"}
            clearShowMail={clearShowMail}
        />
        }
        </div>
        <div>
          <Link href="/">
          	<a>Home</a>
          </Link>          
        </div>
      </main>
	);
}