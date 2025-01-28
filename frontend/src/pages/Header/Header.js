// import Image from "next/image";
// import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import "./Header.css"; // Keep external styles
import React from "react";
const menuItems = (
<Menu>
<Menu.Item key="1"><a href="#">Merge PDF</a></Menu.Item>
<Menu.Item key="2"><a href="#">Split PDF</a></Menu.Item>
<Menu.Item key="3"><a href="#">Compress PDF</a></Menu.Item>
<Menu.Item key="4"><a href="#">Convert PDF</a></Menu.Item>
<Menu.Item key="5"><a href="#">All PDF Tools</a></Menu.Item>
</Menu>
);
 
const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
 
  return (
<header className="header">
      {/* Left Side - Logo */}
<div className="logo">
<img src="/logo.png" alt="Logo" width={100} height={40} />
</div>
 
      {/* Center - Navigation */}
<nav className="nav-links">
<a href="#">Merge PDF</a>
<a href="#">Split PDF</a>
<a href="#">Compress PDF</a>
<a href="#">Convert PDF ▼</a>
<a href="#">All PDF Tools ▼</a>
</nav>
 
      {/* Right Side - Buttons */}
<div className="header-right">
<Button type="link">Login</Button>
<Button type="primary" danger>Sign Up</Button>
        {/* Mobile Menu */}
<Dropdown overlay={menuItems} trigger={["click"]}>
<Button className="menu-icon" icon={<MenuOutlined />} />
</Dropdown>
</div>
</header>
  );
};
 
export default Header;