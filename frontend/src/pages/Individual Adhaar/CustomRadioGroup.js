import React, { useState } from "react";
import "./CustomRadioGroup.css"; // Import styles
import Stepper from "./Stepper"; // Import Stepper component
import GenaiMaskingScreen from "./GenaiMaskingScreen";
import NextScreen from "./NextScreen";
 
const CustomRadioGroup = () => {
  // Set default selection to the second option ("Gen AI" -> value = 2)
  const [selectedValue, setSelectedValue] = useState(1);
 
  // Handle radio button selection
  const onChange = (value) => {
    setSelectedValue(value);
  };
 
  return (
    <div>
      <div className="custom-radio-group">
        {["Classical AI", "Gen AI", "Custom ML Modal"].map((label, index) => {
          const value = index + 1;
          return (
            <label key={value} className="custom-radio-label">
              <input
                type="radio"
                name="custom-radio"
                value={value}
                checked={selectedValue === value}
                onChange={() => onChange(value)}
              />
              <span className="custom-radio"></span>
              {label}
            </label>
          );
        })}
      </div>
      {/* Render Stepper when "Gen AI" (option 2) is selected by default */}
      <div className="extra-content">
        {selectedValue === 1 && <NextScreen />}
      </div>
      {/* Render GenaiMaskingScreen when "Gen AI" (option 2) is selected */}
      <div className="extra-content">
        {selectedValue === 2 && <GenaiMaskingScreen />}
      </div>
    </div>
  );
};
 
export default CustomRadioGroup;