import React, { useState } from 'react';
import './ClassificationScreen.css';
 
const ClassificationScreen = () => {
  const [selectedOption, setSelectedOption] = useState('');
 
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
 
  return (
    <div className="main-container">
      <h3>Select an Option:</h3>
      <div className="custom-radio-group">
        <label className="custom-radio-label">
          <input
            type="radio"
            value="Option 1"
            checked={selectedOption === 'Option 1'}
            onChange={handleChange}
          />
          <span className="custom-radio"></span>
          Classify and Mask
        </label>
        <label className="custom-radio-label">
          <input
            type="radio"
            value="Option 2"
            checked={selectedOption === 'Option 2'}
            onChange={handleChange}
          />
          <span className="custom-radio"></span>
          Mask
        </label>
      </div>
    </div>
  );
};
 
export default ClassificationScreen;