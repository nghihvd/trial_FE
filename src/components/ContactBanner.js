import React from "react";
import { NavLink } from "react-router-dom";

const ContactBanner = () => {
  return (
    <div className="contact-banner-wrapper">
      <section className="support-banner-bg contact-bg overlay">
        <div className="support-banner">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <h2 className="support-text">
                  You can contact us for more details!
                </h2>
              </div>
              <div className="col-auto">
                <NavLink to="/contact" className="nav-link">
                  <button className="support-button">CONTACT</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactBanner;
