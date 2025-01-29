import React, { useState } from "react";
import NextScreen from "./NextScreen"; // Import NextScreen component
import "./Stepper.css"; // Import styles

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step labels
  const steps = ["Pre-processing", "Classification", "Masking", "Complete"];

  return (
    <div className="stepper-container">
      <div className="stepper">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          return (
            <div key={stepNumber} className="step-item">
              {/* Step Wrapper (Circle + Line) */}
              <div className="step-wrapper">
                {/* Step Circle */}
                <div
                  className={`step-circle ${
                    currentStep >= stepNumber ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep(stepNumber)}
                ></div>

                {/* Step Connecting Line (only for non-last steps) */}
                {index !== steps.length - 1 && (
                  <div
                    className={`step-line ${
                      currentStep > stepNumber ? "active" : ""
                    }`}
                  ></div>
                )}
              </div>

              {/* Step Label and Subtext Below the Circle */}
              <div className="step-info">
                <div className="step-label">{label}</div>
                {/* <div className="step-subtext">You can hover on the dot.</div> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Render NextScreen below the stepper when Step 1 is selected */}
      {currentStep === 1 && (
        <div className="next-screen-container">
          <NextScreen />
        </div>
      )}
    </div>
  );
};

export default Stepper;
