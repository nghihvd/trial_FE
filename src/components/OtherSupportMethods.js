import React from "react";
import toyimg from "../assets/images/pet-toy.png";
import clothesimg from "../assets/images/pet-clothes.png";
import { NavLink } from "react-router-dom";

import foodimg from "../assets/images/dog-food.png";
import "../styles/othermethod.scss";

const OtherSupportMethods = () => {
  return (
    <div className="banner-donate">
      <section className="container-fluid pattern1 bg-light">
        <h2 data-aos="fade-up" className="title-banner">
          Other support methods
        </h2>

        <div className="container mt-4">
          <div className="row justify-content-center other-method-of-support">
            {[
              { img: toyimg, alt: "Toys", title: "Toys" },
              { img: clothesimg, alt: "Clothes", title: "Clothes" },
              { img: foodimg, alt: "Food", title: "Food" },
            ].map((item, index) => (
              <div
                key={index}
                className="col-4 col-sm-4 col-md-3 col-lg-3 aos-init aos-animate"
                data-aos="zoom-in"
              >
                <div className="serviceBox2">
                  <div className="service-icon">
                    <img
                      className="img-fluid img-lazy-load"
                      src={item.img}
                      alt={item.alt}
                    />
                  </div>
                  <div className="service-content">
                    <h5 className="text-capitalize">{item.title}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OtherSupportMethods;
