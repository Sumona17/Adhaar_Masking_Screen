import React from "react";
import { Layout } from "antd";
import Header from "../Header/Header";
import CustomFooter from "../Footer/Footer";
import { Routes, Route } from "react-router-dom"; 
import BulkMasking from "../Bulkmasking/BulkMasking";
import UploadFile from "../Individual Adhaar/UploadFile";
import NextScreen from "../Individual Adhaar/NextScreen";
import CustomRadioGroup from "../Individual Adhaar/CustomRadioGroup";
const {  Content } = Layout;

const CustomLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        
        // backgroundImage: "url(" + { bg1.jpg } + ")",// Set the background image
        // Ensures the image covers the entire area
        backgroundPosition: "center", // Centers the image

      }}
    >
     
        <Header />
 
        <Content
        
        style={{
          padding: "20px",
          // backgroundImage: "url(bg1.jpg)",
          //  backgroundSize:"cover",

          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          margin: "0px 0", // Margin above and below the content
          flex: 1, // Allows Content to grow and fill remaining height
        }}
      >
       <Routes>
          <Route path="/background" element={<></>} />
          <Route path="/individualAdhaar" element={<UploadFile/>} />
          <Route path="/bulkMasking" element={<BulkMasking />} />
          <Route path="/secondScreen" element={<NextScreen />} />
          <Route path="/radio-group" element={<CustomRadioGroup/>} />
          
        </Routes>
      </Content>
    
        <CustomFooter />
      
    </Layout>
  );
};

export default CustomLayout;
