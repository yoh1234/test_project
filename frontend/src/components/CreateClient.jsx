import React, { useState } from "react";
import api from "../api";

function CreateClient() {   

    const [modalIsOpen, setModalIsOpen] = useState(false); 
    const [email, setClientEmail] = useState("");
    const [name, setClientName] = useState("");
    const [isSending, setIsSending] = useState(false);

    const getClients = () => {
        api
            .get("/api/clients/")
            .then((res) => res.data)
            .then((data) => {
                setClient(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };
    // Open the modal
    const openModal = () => {
        setModalIsOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setModalIsOpen(false);
        setMessage('');
    };
    const createClient = (e) => {
        e.preventDefault();
        api
            .post("/api/clients/", { name, email })
            .then((res) => {
                if (res.status === 201) alert("Client created!");
                else alert("Failed to create client.");
                getClients();
            })
            .catch((err) => alert(err.body));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
    
        const emailData = {
          email: client.email,
          message: message,
        };
    
        try {

            api
            .post("/api/clients/", { name, email })
            .then((res) => {
                if (res.status === 201) alert("Client created!");
                else alert("Failed to create client.");
                getClients();
            })
            .catch((err) => alert(err.data));
    
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
      <button className="button" onClick={openModal}>Send Email with a link</button>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className = "modal-content">
        <h3>Create a Client</h3>
            <form onSubmit={createClient}>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                />
                <label>Email:</label>
                <textarea
                    value={email}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                ></textarea>
                <button type="submit">Add Client</button>
            </form>
      </Modal>
    </div>
  );
};

export default CreateClient;
