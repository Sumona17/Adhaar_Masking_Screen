import React, { useState } from "react";
import "./BulkMasking.css";

const BulkMasking = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFolderSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  return (
    <div className="container">
      {/* Input Data Section */}
      <div className="section input-section">
        <h2 className="title">Input data</h2>
        <div className="upload-box">
          <p className="file-inside">Upload PDF or images</p>
          <input type="file" multiple />
        </div>
        
        <label className="button">
          Choose folder
          <input
            type="file"
            webkitdirectory="true"
            directory=""
            multiple
            onChange={handleFolderSelect}
            style={{ display: "none" }}
          />
        </label>

        {selectedFiles.length > 0 && (
          <div className="file-list">
            <h4>Selected Files:</h4>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Output Folder Path Section */}
      <div className="section output-section">
        <button className="button">Output folder path</button>
      </div>
    </div>
  );
};

export default BulkMasking;
