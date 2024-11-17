import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import "../styles/footer.scss";

const Footer = () => {
  return (
    <div className="footer bottom">
      <div className="footer-container">
        <div className="footer-info">
          <h3 >FurryFriendsFund</h3>
          <div className="social-icons">
            <a href="..." style={{ color: "#1976d2" }}>
              <FaFacebookF />
            </a>
            <a href="..." style={{ color: "#f51a13" }}>
              <FaYoutube />
            </a>
            <a href="..." style={{ color: "#e1306c" }}>
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-about">
          <h4>About us</h4>
          <hr className="small-dividers left"></hr>
          <p>
            FurryFriendsFund is a small pet shelter where we strive to provide
            the best living environment for our pets.
          </p>
        </div>

        <div className="footer-bottom">
          <h4>Contact us</h4>
          <hr className="small-dividers"></hr>
          <p>
            <i className="fa fa-phone"></i>{" "}
            <span style={{ color: '#1976d2' }}>(+84)64889265</span>
            <br />
            <i className="fa fa-envelope"></i>{" "}
            <span style={{ color: '#1976d2' }}>furryfriendFund@gmail.com</span>
            <br />
            <i className="fa fa-map-marker"></i>{" "}
            <span >FPT University - Ho Chi Minh City</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
