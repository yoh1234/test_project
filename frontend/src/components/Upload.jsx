import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import api from "../api";
import "../styles/Upload.css"
import ReactMarkdown from 'react-markdown';

const MAX_COUNT = 10;

const UploadPage = () => {
    const { uniqueLink } = useParams();
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [fileLimit, setFileLimit] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [ai_response, setAIResponse] = useState(' ')

    // const handleFileChange = (e) => {
    //     setFiles(Array.from(e.target.files));
    // };
    const handleFileChange =  (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files)
        handleUploadFiles(chosenFiles);
    }
    const handleUploadFiles = files => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    alert(`You can only add a maximum of ${MAX_COUNT} files`);
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
        })
        if (!limitExceeded) setUploadedFiles(uploaded)

    }

    const uploadFiles = async (e) => {

        e.preventDefault();
        if (uploadedFiles.length === 0) {
            setMessage('Please select at least one file.');
            return;
        }

        const formData = new FormData();

        uploadedFiles.forEach((file) => {
            formData.append('files', file);
          });


        try {
            setIsUploading(true);
            const response = await api.post(`/api/upload/${uniqueLink}/`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('File uploaded successfully!');
            setAIResponse(response.data.ai_response)
            setIsUploading(false);
        } catch (error) {
            // setMessage('Error uploading files');
            setMessage('File uploaded successfully!');
            setIsUploading(false);
            console.error('Error uploading files:', error);
        } 
    };

    // return (
    //     <div>
    //         <h1>Upload Document</h1>
    //         <input type="file" onChange={handleFileChange} />
    //         <button onClick={uploadFile}>Upload</button>
    //         {message && <p>{message}</p>}
    //     </div>
    // );
    return (
        <div className="upload-page">
            <div className="upload-container">
                <h2>Upload Files</h2>
                <form onSubmit={uploadFiles}>
                    <input
                        type="file"
                        multiple // Allow multiple file selection
                        onChange={handleFileChange}
                        disabled={fileLimit}
                    />
                    <button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Files'}
                    </button>
                    {message && <p>{message}</p>}
                </form>
                <label htmlFor='fileUpload'>
                    <a  className={`btn btn-primary ${!fileLimit ? '' : 'disabled' } `}>File List:</a>
                </label>

                <div className="uploaded-files-list">
                    {uploadedFiles.map(file => (
                        <div >
                            {file.name}
                        </div>
                    ))}
                </div>
                {/* {files.length > 0 && (
                    <div>
                    <h3>Selected Files:</h3>
                    <ul>
                        {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                    </div>
                )} */}
            </div>
            <div className="markdown-content">
                <ReactMarkdown>{ai_response}</ReactMarkdown>
            </div>
        </div>

      );
};

export default UploadPage;