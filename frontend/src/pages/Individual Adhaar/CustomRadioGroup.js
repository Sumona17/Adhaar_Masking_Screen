import React, { useState } from "react";
import "./CustomRadioGroup.css"; // Import styles
import Stepper from "./Stepper"; // Import Stepper component

const CustomRadioGroup = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  // Handle radio button selection
  const onChange = (value) => {
    setSelectedValue(value);
  };

  return (
    <div>
      <div className="custom-radio-group">
        {["Traditional AI", "Gen AI", "Custom ML Modal"].map((label, index) => {
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

      {/* Render Stepper when option B is selected */}
      <div className="extra-content">
        {selectedValue === 2 ? (
          <Stepper /> // Calls the Stepper component
        ) : selectedValue ? (
          <h3>You selected option {selectedValue}</h3>
        ) : null}
      </div>
    </div>
  );
};

export default CustomRadioGroup;
