import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import {useState, useEffect} from 'react'
import {sendMail} from '../utils/mailUtils'

export default function MailComponent(props) {	
	const [receiver, setReceiver] = useState('abcd');
	const [subject, setSubject] = useState('Test Mail');
	const [mailBody, setMailBody] = useState('Is This the Real Life');
	const [isReadOnly, setIsReadOnly] = useState(false);

	useEffect(() => {
		if (props.readOnly === true) {
			setIsReadOnly(true);
			setReceiver(props.sender);
			setSubject(props.subject);
			setMailBody(props.mailBody);
		}
	});

	const submitSendMailHandler = async (event) => {
		event.preventDefault();
		if(isReadOnly === true) {
			props.clearShowMail();
			return
		}
		const mailObject = {
			to: receiver,
			from: props.from,
			subject: subject,
			body: mailBody
		}
		console.log(mailObject);
		await sendMail(mailObject, props.contract);
		alert('Mail Sent');
	}

	return (
		<>
		<Form onSubmit={submitSendMailHandler}>
		  <Form.Group className="mb-4" controlId="formMailTo">

		    <Form.Label>{(isReadOnly)?"Sender": "Receiver"} address</Form.Label>
		    <Form.Control type="text" placeholder="Enter address" value={receiver} onChange={e => setReceiver(e.target.value)} disabled={(isReadOnly)?"disabled": ""} />
		  </Form.Group>
		  <Form.Group className="mb-4" controlId="formMailSubject">
		    <Form.Label>Subject</Form.Label>
		    <Form.Control type="text" placeholder="Subject" onChange={e => setSubject(e.target.value)} value={subject} disabled={(isReadOnly)?"disabled": ""} />
		  </Form.Group>
		  <Form.Group className="mb-4" controlId="formMailBody">
			  <FloatingLabel controlId="floatingTextarea2" label="Body">
			    <Form.Control
			      as="textarea"
			      placeholder="Leave a comment here"
			      style={{ height: '100px', width: '60vw'}}
			      onChange={e => setMailBody(e.target.value)}
			      value={mailBody}
			      disabled={(isReadOnly)?"disabled": ""}
			    />
			  </FloatingLabel>
		  </Form.Group>
		  <Button variant="primary" type="submit">
		    {(isReadOnly)?"Close": "Submit"}
		  </Button>
		</Form>
		</>
	)
}