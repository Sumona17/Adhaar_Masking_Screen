import React, { useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const BulkMasking = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [zipBlob, setZipBlob] = useState(null);
  const [outputPath, setOutputPath] = useState("");
  const [maskingResults, setMaskingResults] = useState(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    setError(null);
  };

  const handleFolderSelect = (event) => {
    const files = Array.from(event.target.files);
    // Filter out directory entries and normalize file paths
    const validFiles = files.filter(file => file.size > 0).map(file => {
      // Create a new File object with a normalized path
      return new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified
      });
    });

    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
    setError(null);
  };


  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const fetchMaskingResults = async (submissionId) => {
    try {
      const response = await fetch(`http://localhost:8000/masked_info/${submissionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMaskingResults(data);
      alert("Masking process completed successfully!");
    } catch (error) {
      setError("Error fetching masking results: " + error.message);
    }
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
        // Ensure we're using only the filename without path
        const fileName = file.name.split(/[\/\\]/).pop();
        formData.append('files', file, fileName);
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

      const blob = await response.blob();
      setZipBlob(blob);

      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'masked_documents.zip';
      setOutputPath(filename);

      const submissionId = response.headers.get('X-Submission-ID');
      if (submissionId) {
        await fetchMaskingResults(submissionId);
      } else {
        setMaskingResults({
          successful_count: selectedFiles.length,
          failed_count: 0,
          failed_files: []
        });
        alert("Masking process completed successfully!");
      }
    } catch (error) {
      setError("Error processing files: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!zipBlob) return;
    const url = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = outputPath || 'masked_documents.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

        <div className="button-group">
          {/* <label className="button">
            Choose Files
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </label> */}

          <label className="button">
            Choose Folder
            <input
              type="file"
              webkitdirectory="true"
              directory="true"
              multiple
              onChange={handleFolderSelect}
              style={{ display: "none" }}
            />
          </label>
        </div>

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
          <>
            <button
              className="button"
              onClick={handleDownload}
            >
              Download Masked Files ({outputPath})
            </button>

            {/* Results Section */}
            {maskingResults && (
              <div className="results-container">
                <h3>Masking Results</h3>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '8px' }} />
                  <span>Successfully masked: {maskingResults.successful_count} files</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px', marginRight: '8px' }} />
                  <span>Failed to mask: {maskingResults.failed_count} files</span>
                </div>
                {maskingResults.failed_files && maskingResults.failed_files.length > 0 && (
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: '8px' }}>Failed files:</p>
                    <ul style={{ color: '#ff4d4f', paddingLeft: '20px' }}>
                      {maskingResults.failed_files.map((file, index) => (
                        <li key={index}>{file}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <button className="button" disabled>Output folder path</button>
        )}
      </div>
    </div>
  );
};

export default BulkMasking;