import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import SendLink from "../components/SendLink";
import ClientFiles from "../components/ClientFiles";
import Chatbot from "../components/chatbot";
import "../styles/Dashboard.css"
import "../styles/ClientManager.css"
import { ACCESS_TOKEN } from "../constants";

function Home() {

    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem(ACCESS_TOKEN);

    if (!isAuthenticated) {
        navigate("/login");
      }

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [clients, setClient] = useState([]);
    const [email, setClientEmail] = useState("");
    const [name, setClientName] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [clientFiles, setClientFiles] = useState([]);

    useEffect(() => {
        getClients();
    }, []);

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
    const getClientFiles = async (clientId) => {
        try {
            const response = await api.get(`/api/client-files/${clientId}/`);
            setClientFiles(response.data);
        } catch (error) {
            console.error("Error fetching client files:", error);
        }
    };
    const handleClientClick = (client) => {
        setSelectedClient(client);
        getClientFiles(client.id);
    };
    const deleteClient = (id) => {
        api
            .delete(`/api/clients/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Client deleted!");
                else alert("Failed to delete client.");
                getClients();
                if (selectedClient?.id === id) setSelectedClient(null);
            })
            .catch((error) => alert(error));
    };

    const createClient = (e) => {
        e.preventDefault();
        api
            .post("/api/clients/", { name, email })
            .then((res) => {
                if (!name || !email) {
                    alert("Name and Email are required.");
                    return;
                }
                if (res.status === 201) alert("Client created!");
                else alert("Failed to create client.");
                getClients();
            })
            .catch((err) => alert("Please enter valid email address."));
    };

    const handleSendLink = async () => {
        if (!selectedClient) return;
        try {
            const data = await SendLink(selectedClient.id);
            alert("Upload link sent to the client!");
            console.log("Upload link response:", data);
        } catch (error) {
            alert("Failed to send upload link.");
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };

    return (
        <div className="client-manager">
            {/* Sidebar with Client List */}
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
                {/* Toggle Button */}
                <button onClick={toggleSidebar} className="toggle-button">
                {isSidebarOpen ? "Collapse" : "Expand"}
                </button>
                {isSidebarOpen && (
                    <div>
                        <h2 className = "client-header">Clients</h2>
                        <ul className="client-list">
                            {clients.map((client) => (
                                <li
                                    key={client.id}
                                    className={`client-item ${
                                        selectedClient?.id === client.id ? "active" : ""
                                    }`}
                                    onClick={() => handleClientClick(client)}
                                >
                                    {client.name}
                                    
                                    <button
                                        className="delete-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteClient(client.id);
                                            getClientFiles(client.id);
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {/* Form to Create a New Client */}

                        <form className = "create-client" onSubmit={createClient}>
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
                            <button className = "add-client" type="submit">Add Client</button>
                        </form>
                    </div>
                )}
            </div>

            {/* Main Content - Client Info */}
            <div className ="client-content">
                {selectedClient ? (
                    <div>
                        <div className = "send_link"><SendLink client={selectedClient}/> </div>
                        <div> <Chatbot clientId={selectedClient.id}/> </div>
                              
                    </div>
                ) : (
                    <p>Select a client to view their details.</p>
                )}
            </div>
            <div className = "file-container">
                {selectedClient ? (
                    <div>
                        <div className = "uploaded-files"> <ClientFiles  clientId={selectedClient.id}/> </div>              
                    </div>
                ) : (
                    <p></p>
                )}
                    
            </div>
        </div>

    );
}

export default Home;

