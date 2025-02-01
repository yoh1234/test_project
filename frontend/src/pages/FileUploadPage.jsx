import React, { useState } from "react";
import { useParams } from "react-router-dom";

const FileUpload = () => {
  const { unique_link } = useParams();
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`http://127.0.0.1:8000/api/upload/${unique_link}/`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("File uploaded successfully!");
    } else {
      alert("Failed to upload file.");
    }
  };

  return (
    <div>
      <h1>Upload Your File</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default FileUpload;
