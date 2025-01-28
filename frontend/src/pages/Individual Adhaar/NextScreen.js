import React from "react";
import "./secondScreen.css";
import { useLocation } from "react-router-dom";

const NextScreen = () => {
  const location = useLocation();
  const { uploadedImage } = location.state || {};

  const handleDownload = () => {
    console.log("Download clicked");
  };

  return (
    <div className="first-screen">
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
            <div className="no-image">Masked image will appear here</div>
          </div>
        </div>
      </div>
      <button className="download-btn" onClick={handleDownload}>
        Download
      </button>
    </div>
  );
};

export default NextScreen;