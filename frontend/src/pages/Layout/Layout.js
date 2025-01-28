import Header from "../Header/Header";
import Footer from "../Footer/Footer";
 import React from "react";
const Layout = ({ children }) => {
  return (
<div className="layout">
<Header />
<main className="content">{children}</main>
<Footer />
</div>
  );
};
 
export default Layout;