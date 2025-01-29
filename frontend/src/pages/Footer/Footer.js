import React from "react";
import { Layout, Row, Col, Typography } from "antd";
import {
  FacebookOutlined,
  LinkedinOutlined,
  MailOutlined,
  WhatsAppOutlined,
  PhoneFilled,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Text } = Typography;

const CustomFooter = () => {
  return (
    
    <Footer style={{ background: "white", padding: "40px 20px", textAlign: "center", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)" }}>
      <Row justify="center" gutter={[32, 16]}>
        <Col xs={24} sm={6}>
          <Title level={3} style={{ color: "#333" }}>
            <span style={{ color: "#ff6b6b" }}>E</span>xavalu
          </Title>
          <Text>STRATEGY.TECHNOLOGY.INNOVATION</Text>
          <div style={{ marginTop: 10 }}>
          <LinkedinOutlined style={{ fontSize: "20px", margin: "0 8px" }} />
          <MailOutlined style={{ fontSize: "20px", margin: "0 8px" }} />
            <FacebookOutlined style={{ fontSize: "20px", margin: "0 8px" }} />
           
           
            <WhatsAppOutlined style={{ fontSize: "20px", margin: "0 8px" }} /><br/>
         <Text><PhoneFilled/>+1- 888-EXAVALU (888-392-8258) info@exavalu.com</Text>
          </div>
        </Col>

        <Col xs={24} sm={4}>
        <Title level={5}>Home</Title>
          <Text>Insights</Text><br/>
          <Text>News & events</Text><br/>
          <Text>Careers</Text>
          <Text>Contact Us</Text>
        </Col>

        <Col xs={24} sm={4}>
          <Title level={5}>Employers</Title>
          <Text>Overview</Text><br/>
          <Text>Pricing</Text><br/>
          <Text>Downloads</Text><br/>
          <Text>Post a Job</Text>
        </Col>

        <Col xs={24} sm={4}>
          <Title level={5}>About</Title>
          <Text>Success Stories</Text><br/>
          <Text>Overview</Text><br/>
          <Text>Team</Text><br/>
          <Text>Press</Text>
        </Col>

        <Col xs={24} sm={4}>
          <Title level={5}>General</Title>
          <Text>News</Text><br/>
          <Text>FAQs</Text><br/>
          <Text>Contact Us</Text><br/>
          <Text>Terms & Conditions</Text>
        </Col>
      </Row>

      <Text style={{ marginTop: 20, display: "block", fontSize: "12px" }}>
        © {new Date().getFullYear()} www.exavalu.com All Rights Reserved.
      </Text>
    </Footer>
  );
};

export default CustomFooter;
