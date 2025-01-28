import { MenuOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import "./Header.css";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const menuItems = (
        <Menu selectedKeys={[location.pathname]}>
            <Menu.Item key="/background">
                <Link to="/background">Background</Link>
            </Menu.Item>
            <Menu.Item key="/individualAdhaar">
                <Link to="/individualAdhaar">Individual Adhaar</Link>
            </Menu.Item>
            <Menu.Item key="/bulkMasking">
                <Link to="/bulkMasking">Bulk Masking</Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <header className="header">
            {/* Left Side - Logo */}
            <div className="logo">
                <img src="/exa.png" alt="Logo" width={150} height={40} />
            </div>
            <div className="allnav">
                <nav className="nav-links">
                    <Link to="/background" className={isActive("/background")}>
                        Background
                    </Link>
                    <Link to="/individualAdhaar" className={isActive("/individualAdhaar")}>
                        Individual Adhaar
                    </Link>
                    <Link to="/bulkMasking" className={isActive("/bulkMasking")}>
                        Bulk Masking
                    </Link>
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