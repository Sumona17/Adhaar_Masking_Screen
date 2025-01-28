import React from "react";
import CustomLayout from "./pages/Layout/Layout";

import { BrowserRouter as Router } from "react-router-dom"; // Wrap the app with Router

function App() {
  return (
    <Router>
      <CustomLayout />
    </Router>
  );
}

export default App;
