import React from "react";
import logoImage from "../../assets/img/logo_white.svg";

import { Link } from "react-router-dom";

export default function Layout({ tabIndex, children }) {
  return (
    <>
      <header className="gov__header">
        <img className="gov__logo" src={logoImage} alt="logo" />

        <ul className="gov__tabs">
          <li className={`${tabIndex == 0 ? "tab--active" : "tab--inactive"}`}>
            <Link to="/proposal/list">Proposals</Link>
          </li>
          <li className={`${tabIndex == 1 ? "tab--active" : "tab--inactive"}`}>
            <Link to="/node/list">Node List</Link>
          </li>
        </ul>
      </header>
      <div className="gov__main">{children}</div>
      <footer>
        <div className="container">
          <div className="divide-line" />
          <p className="footer__copy">
            © Copyright 2019 Blockledger | Terms of Service | Privacy & Security
          </p>
        </div>
      </footer>
    </>
  );
}
