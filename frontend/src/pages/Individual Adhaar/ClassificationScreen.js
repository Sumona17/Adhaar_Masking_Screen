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
<label>
<input 
          type="radio" 
          value="Option 1" 
          checked={selectedOption === 'Option 1'}
          onChange={handleChange} 
        />
        Option 1
</label>
<label>
<input 
          type="radio" 
          value="Option 2" 
          checked={selectedOption === 'Option 2'}
          onChange={handleChange} 
        />
        Option 2
</label>
</div>
  );
};
 
export default ClassificationScreen;