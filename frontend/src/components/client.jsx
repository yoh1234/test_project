import React from "react";
import "../styles/Note.css"

function Client({ client, onDelete }) {
    const formattedDate = new Date(client.created_at).toLocaleDateString("en-US")

    return (
        <div className="note-container">
            <p className="note-title">{client.name}</p>
            <p className="note-content">{client.data}</p>
            <p className="note-date">{formattedDate}</p>
            <button className="delete-button" onClick={() => onDelete(client.id)}>
                Delete
            </button>
        </div>
    );
}

export default Client