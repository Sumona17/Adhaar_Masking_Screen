import React, { useState } from "react";
import NextScreen from "./NextScreen"; // Import the NextScreen component
import "./Stepper.css"; // Import styles

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Define steps
  const steps = ["Pre-processing", "Classification", "Masking", "Complete"];

  return (
    <div className="stepper-container">
      <div className="stepper">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          return (
            <div key={stepNumber} className="step-item">
              {/* Step Circle */}
              <div
                className={`step-circle ${
                  currentStep >= stepNumber ? "active" : ""
                }`}
                onClick={() => setCurrentStep(stepNumber)}
              ></div>

              {/* Connecting Line (only for non-last steps) */}
              {index !== steps.length - 1 && (
                <div
                  className={`step-line ${
                    currentStep > stepNumber ? "active" : ""
                  }`}
                ></div>
              )}

              {/* Step Label */}
              <div className="step-label">{label}</div>
              {/* <div className="step-subtext">You can hover on the dot.</div> */}
            </div>
          );
        })}
      </div>

      {/* Render NextScreen below the stepper when the 1st step is selected */}
      {currentStep === 1 && (
        <div className="next-screen-container">
          <NextScreen />
        </div>
      )}
    </div>
  );
};

export default Stepper;
