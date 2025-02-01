import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from "../api";
import "../styles/ClientFiles.css"



const ClientFiles = ({ clientId }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
    if (clientId) {
        fetchClientFiles();
    }
    }, [clientId]);

    const fetchClientFiles = async () => {
    try {
        const response = await api.get(`/api/client-files/${clientId}/`);
        setFiles(response.data);
    } catch (error) {
        console.error("Error fetching client files:", error);
    }
    };

    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await api.get(`/api/download/${fileId}/`, {
                responseType: 'blob', // Important for handling binary data
            });
    
            if (response.data) {
                // Create a temporary URL for the file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);  // Set the file name
                document.body.appendChild(link);
                link.click();  // Trigger the download
                link.remove();  // Clean up

            } else {
                throw new Error('No file data returned');
            }

        } catch (error) {
            console.error("Download error:", error);
        }
    };
    const deleteFile = (FileId) => {
        api
            .delete(`/api/files/delete/${FileId}/`)
            .then((res) => {
                if (res.status === 204) alert("File deleted!");
                else alert("Failed to delete file.");
                fetchClientFiles();
            })
            .catch((error) => alert(error));
    };


    const [activeTab, setActiveTab] = useState(null); // Track active tab

    return (
        <div className="file-container">
          <h3 className="file-header">Uploaded Files</h3>
          {files.length > 0 ? (
            <ul className="tabs">
              {files.map((file) => (
                <div 
                key={file.id}
                class={`tab ${activeTab === file.id ? "active" : ""}`}
                onClick={() => setActiveTab(activeTab === file.id ? null : file.id)}
                >
                    <span className ="file-name">{file.file.split('/').pop()}</span>  {/* Apply file-name class */}
                    {/* {file.file.split('/').pop()} */}
                    {activeTab === file.id && (
                        <div className="file-details">
                        <p><strong>Summary:</strong> {file.summary_text}</p>
                        </div>
                    )}
                    
                    <button className="file-button" onClick={() => 
                        handleDownload(file.id, file.file.split('/').pop()
                    )}>🔽</button>

                    <button className="file-button" onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                        fetchClientFiles();
                    }}>🗑️</button>
                {/* {file.summary_text} */}
                </div>
                // <li key={file.id}>
                //   <a href={`/api/download/${file.id}/`} download>
                //     {file.file.split("/").pop()}
                //   </a>
                // </li>
              ))}
            </ul>
          ) : (
            <p>No files uploaded yet.</p>
          )}
        </div>
      );

};

export default ClientFiles;
