import React, { useState } from 'react';
import Modal from 'react-modal';
import api from "../api";

Modal.setAppElement('#root'); // For accessibility reasons

const SendEmailButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Open the modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setEmail('');
    setMessage('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle form submission to send email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const emailData = {
      email: email,
      message: message,
    };

    try {
        const response = await api.post('/api/send-email/', emailData, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          });
    //   const response = await api.post('/api/send-email/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(emailData),
    //   });

    //   if (response.ok) {
    if (response.status == 200) {
        alert('Email sent successfully!');
      } else {
        alert('Error sending email');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending email');
    } finally {
      setIsSending(false);
      closeModal();
    }
  };

  return (
    <div>
      <button onClick={openModal}>Send Email</button>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Send Email</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div>
            <label>Message:</label>
            <textarea
              value={message}
              onChange={handleMessageChange}
              required
            />
          </div>
          <button type="submit" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Email'}
          </button>
        </form>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default SendEmailButton;