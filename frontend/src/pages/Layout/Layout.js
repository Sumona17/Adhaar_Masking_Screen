import React from "react";
import { Layout } from "antd";
import Header from "../Header/Header";
import CustomFooter from "../Footer/Footer";
import { Routes, Route } from "react-router-dom"; 
import BulkMasking from "../Bulkmasking/BulkMasking";
import UploadFile from "../Individual Adhaar/UploadFile";
const {  Content } = Layout;

const CustomLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa", // Off-white background
      }}
    >
     
        <Header />
 
        <Content
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          margin: "20px 0", // Margin above and below the content
          flex: 1, // Allows Content to grow and fill remaining height
        }}
      >
       <Routes>
          <Route path="/background" element={<></>} />
          <Route path="/individualAdhaar" element={<UploadFile/>} />
          <Route path="/bulkMasking" element={<BulkMasking />} />
          
        </Routes>
      </Content>
    
        <CustomFooter />
      
    </Layout>
  );
};

export default CustomLayout;
