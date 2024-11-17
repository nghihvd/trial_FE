// src/components/BackToTop.js
import React from "react";
import "../styles/Backtotop.scss"; // Đảm bảo bạn có file CSS cho component này

const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="back-to-top" onClick={scrollToTop}>
      <i className="fa fa-angle-up"></i> {/* Sử dụng icon cho nút */}
    </div>
  );
};

export default BackToTop;
