import React, { useState } from "react";
import "./BulkMasking.css";

const BulkMasking = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [outputPath, setOutputPath] = useState("");
  const [error, setError] = useState(null);
  const [zipBlob, setZipBlob] = useState(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    setError(null);
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const startMasking = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select files to process");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:8000/mask_multiple_aadhar_cards', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the zip file as blob
      const blob = await response.blob();
      setZipBlob(blob);

      // Try to get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'masked_documents.zip';

      setOutputPath(filename);
    } catch (error) {
      setError("Error processing files: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!zipBlob) return;

    // Create a URL for the blob
    const url = window.URL.createObjectURL(zipBlob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = outputPath || 'masked_documents.zip';
    
    // Append link to body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      {/* Input Data Section */}
      <div className="section input-section">
        <h2 className="title">Input data</h2>
        <div className="upload-box">
          <p className="file-inside">Upload PDF or images</p>
          <input 
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
          />
        </div>
        
        <label className="button">
          Choose Files
          <input
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </label>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="file-list">
            <h4>Selected Files:</h4>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <button 
                    onClick={() => removeFile(index)}
                    style={{ marginLeft: '10px' }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button 
              className="masking-button"
              onClick={startMasking}
              disabled={processing}
            >
              {processing ? "Processing..." : "Start Masking"}
            </button>
          </div>
        )}
      </div>

      {/* Output Folder Path Section */}
      <div className="section output-section">
        {zipBlob ? (
          <button 
            className="button"
            onClick={handleDownload}
          >
            Download Masked Files ({outputPath})
          </button>
        ) : (
          <button className="button" disabled>Output folder path</button>
        )}
      </div>
    </div>
  );
};

export default BulkMasking;