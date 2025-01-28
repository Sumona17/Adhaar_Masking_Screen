import React from "react";
import "./BulkMasking.css";

const BulkMasking = () => {
  return (
    <div className="container">
      {/* Input Data Section */}
      <div className="section input-section">
        <h2 className="title">Input data</h2>
        <div className="upload-box">
          <p className="file-inside">Upload PDF or images</p>
          <input type="file" multiple />
        </div>
        <button className="button">Choose folder</button>
      </div>
      
      {/* Output Folder Path Section */}
      <div className="section output-section">
        <button className="button">Output folder path</button>
      </div>
    </div>
  );
};

export default BulkMasking;