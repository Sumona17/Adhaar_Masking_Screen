import React, { useState, useEffect } from "react";
import "./secondScreen.css";
import { useLocation } from "react-router-dom";
// import Stepper from "./Stepper";

const NextScreen = () => {
  const location = useLocation();
  const { uploadedImage } = location.state || {};
  const [maskedImage, setMaskedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (uploadedImage) {
      maskAadhaarImage();
    }
  }, [uploadedImage]);

  const maskAadhaarImage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert base64 to blob
      const base64Response = await fetch(uploadedImage);
      const blob = await base64Response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');

      // Make API call
      const response = await fetch('http://127.0.0.1:8000/mask_aadhar/classical_ai/', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mask Aadhaar: ${response.statusText}`);
      }

      const maskedBlob = await response.blob();
      const maskedImageUrl = URL.createObjectURL(maskedBlob);
      setMaskedImage(maskedImageUrl);
    } catch (err) {
      setError(err.message);
      console.error('Error masking image:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (maskedImage) {
      const link = document.createElement('a');
      link.href = maskedImage;
      link.download = 'masked_aadhaar.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="first-screen">
      {/* <Stepper /> */}
      <div className="cards-container">
        {/* Original Image Card */}
        <div className="card">
          <h3 className="card-heading">Original Image</h3>
          <div className="image-container">
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Original"
                className="card-image"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "300px",
                  objectFit: "contain"
                }}
              />
            ) : (
              <div className="no-image">No image uploaded</div>
            )}
          </div>
        </div>

        {/* Masked Image Card */}
        <div className="card">
          <h3 className="card-heading">Masked Image</h3>
          <div className="image-container">
            {isLoading ? (
              <div className="loading">Processing...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : maskedImage ? (
              <img
                src={maskedImage}
                alt="Masked"
                className="card-image"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "300px",
                  objectFit: "contain"
                }}
              />
            ) : (
              <div className="no-image">Masked image will appear here</div>
            )}
          </div>
        </div>
      </div>
      <div className="download-btn-container"> 
      <button 
        className="download-btn" 
        onClick={handleDownload}
        disabled={!maskedImage}
      >
        Download
      </button>
      </div>
    </div>
  );
};

export default NextScreen;