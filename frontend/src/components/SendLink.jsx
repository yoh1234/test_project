import React, { useState } from 'react';
import Modal from 'react-modal';
import api from "../api";
import "../styles/SendLink.css";

Modal.setAppElement('#root'); // For accessibility reasons

const SendLink = ({client}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Open the modal
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setMessage('');
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Handle form submission to send email
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const emailData = {
      email: client.email,
      message: message,
    };

    try {
        const response = await api.post(`/api/send-link/${client.id}/`, emailData, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          });

    if (response.status == 200) {
        alert('Email sent successfully!');
      } else {
        alert('Error sending email');
      }
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error sending email');
    } finally {
      setIsSending(false);
      closeModal();
    }
  };

  return (
    <div>
      <button className="button" onClick={openModal}>Send Email with a link</button>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className = "modal-content">

        <form onSubmit={handleSubmit}>
          <h3>Request evidence to {client.name} ({client.email})</h3>
          <div>
            <label>Requirements:</label>
            <textarea
              value={message}
              onChange={handleMessageChange}
              required
              className="textarea"
            />
          </div>
          <div className="button-container">
            <button className="button" type="submit" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
            <button className="button cancel-button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form> 
      </Modal>
    </div>
  );
};

export default SendLink;


