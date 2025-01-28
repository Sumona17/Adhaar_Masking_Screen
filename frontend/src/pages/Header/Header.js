// import Image from "next/image";
// import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import "./Header.css"; // Keep external styles
import React from "react";
import { Link } from "react-router-dom";
const menuItems = (
      <Menu>
           <Menu.Item key="1">
      <Link to="/background">Background</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to="/individualAdhaar">Individual Adhaar</Link>
    </Menu.Item>
    <Menu.Item key="3">
      <Link to="/bulkMasking">Bulk Masking</Link>
    </Menu.Item>
      </Menu>
);

const Header = () => {
      //   const [menuOpen, setMenuOpen] = useState(false);

      return (
            <header className="header">
                  {/* Left Side - Logo */}
                  <div className="logo">
                        <img src="/exa.png" alt="Logo" width={150} height={40} />
                  </div>
                  <div className="allnav">
                  <nav className="nav-links">
                  <Link to="/background">Background</Link>
                  <Link to="/individualAdhaar">Individual Adhaar</Link>
                  <Link to="/bulkMasking">Bulk Masking</Link>
                        {/* <a href="#">Convert PDF ▼</a> */}
                  </nav>
                  </div>
                  
                 

                  {/* Right Side - Buttons */}
                  <div className="header-right">
                        <Button className="login-btn" type="link">Login</Button>
                        <Button type="primary" danger>Sign Up</Button>
                        {/* Mobile Menu */}
                        <Dropdown overlay={menuItems} trigger={["click"]}>
                              <Button className="hamburger-menu" icon={<MenuOutlined />} />
                        </Dropdown>
                  </div>
            </header>
      );
};

export default Header;