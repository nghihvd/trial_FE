import React from "react";
import "../styles/BannerDonate.scss";
import { NavLink } from "react-router-dom";

const BannerDonate = () => {
  return (
    <div className="support-banner-wrapper">
      <section className="support-banner-bg bg-fixed overlay">
        <div className="support-banner">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="support-text">Have you already supported us?</h2>
              </div>
              <div className="col-auto ">
                <NavLink to="/donate" className="nav-link">
                  <button className="support-button">DONATE NOW</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BannerDonate;
