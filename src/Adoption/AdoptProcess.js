// src/components/AdoptionProcess.js
import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "../styles/adoptprocess.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/axios";

const AdoptionProcess = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location
  const pet = location.state?.pet;
  const petID = pet.petID;
  const [agreed, setAgreed] = useState(false); //Trang thái của nút policy
  const [showModal, setShowModal] = useState(false);
  const [appointment, setAppointment] = useState({
    date: "",
    time: "",
  }); // Lưu thông tin đặt lịch hẹn

  const date_time = `${appointment.date}T${appointment.time}`;
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [showThankYou, setShowThankYou] = useState(false); // Trạng thái hiển thị bảng cảm ơn
  const accountID = localStorage.getItem("accountID"); // Lấy accountID
  // Xử lý khi người dùng nhấn nút "Đặt lịch hẹn"
  const handleSubmit = async () => {
    if (!appointment.date || !appointment.time) {
      toast.error("Please enter date and time.");
      return;
    }

    try {
      const response = await api.post(`appointment/adopt`, {
        date_time,
        accountID,
        petID,
      });
      if (response.status === 200) {
        setShowModal(false);
        setShowThankYou(true);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      if (error.response && error.response.status === 409) {
        console.error("Conflict error:", error.response.data);
      }
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  };

  useEffect(() => {
    const today = new Date();
    const min = new Date(today.setDate(today.getDate() + 2)) // Lấy ngày hiện tại cộng thêm 4 ngày
      .toISOString()
      .split("T")[0]; // Định dạng thành YYYY-MM-DD
    const max = new Date(today.setDate(today.getDate() + 15)) // Giới hạn tối đa thêm 8 ngày từ ngày hiện tại
      .toISOString()
      .split("T")[0]; // Định dạng thành YYYY-MM-DD
    setMinDate(min);
    setMaxDate(max);
  }, []);

  // Xử lý khi người dùng tick vào ô "Đồng ý với chính sách"
  const handleAgreeChange = (event) => {
    setAgreed(event.target.checked);
  };

  // Xử lý khi người dùng bấm nút "Xác nhận"
  const handleConfirmClick = () => {
    if (agreed) {
      setShowModal(true);
    } else {
      toast.error("Please agree to the policy before continuing.");
    }
  };

  const handleAppointmentChange = (event) => {
    const { name, value } = event.target;
    if (name === "date") {
      // Kiểm tra xem ngày nhập vào có nằm trong khoảng minDate và maxDate không
      if (
        new Date(value) < new Date(minDate) ||
        new Date(value) > new Date(maxDate)
      ) {
        toast.error(`Please select a date from ${minDate} to ${maxDate}.`);
        return; // Ngăn không cho cập nhật nếu ngày không hợp lệ
      }
    }

    if (name === "time") {
      const selectedTime = new Date(`1970-01-01T${value}:00`);
      const startTime = new Date(`1970-01-01T08:00:00`);
      const endTime = new Date(`1970-01-01T17:00:00`);
      if (selectedTime < startTime || selectedTime > endTime) {
        toast.error("Please choose a time from 8:00 to 17:00.");
        return; // Ngăn không cho cập nhật nếu thời gian không hợp lệ
      }
    }

    setAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm đóng modal
  const handleClose = () => {
    setShowModal(false);
    navigate(`/petdetail/${petID}`);
  };

  return (
    <div className="adoption-process-container">
      {/*Quy trình nhận nuôi */}
      <div className="adoption-process-content">
        <h1 className="adoption-title">Adoption Process</h1>
        <hr class="small-divider center mb-2"></hr>

        <p className="adoption-intro">
          Before deciding to adopt a dog or cat, please ask yourself if you are
          ready to take full responsibility for them, including financial,
          accommodation, and emotional commitment. Adoption requires a strong
          agreement from yourself, your family, and those involved. Please
          consider carefully before contacting FurryFriendFund for adoption.
        </p>
        <h3>Ready to go? Follow these steps:</h3>
        <ul className="adoption-steps-list">
          <li>
            <i class="fa-solid fa-1">.</i>
            Read the pet information you want to adopt on FFF's website.
          </li>

          <li>
            <i class="fa-solid fa-2">.</i>
            Contact the volunteer in charge of the pet to get more information.
          </li>
          <li>
            <i class="fa-solid fa-3">.</i>
            Join the adoption interview.
          </li>
          <li>
            <i class="fa-solid fa-4">.</i>
            Prepare the necessary facilities, sign the adoption papers, and pay
            the medical fee.
          </li>
          <li>
            <i class="fa-solid fa-5">.</i>
            You need to regularly update your pet's status every two weeks. If
            the deadline is exceeded and reminders have been sent multiple
            times, your account will be banned, and you will be penalized
            approximately 5 millions VietNam Dong.
          </li>
        </ul>
        <div className="adoption-policy">
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={handleAgreeChange}
            />
            I agree to the <strong>adoption policies and regulations</strong>.
          </label>
        </div>
        <button className="confirm-button" onClick={handleConfirmClick}>
          Accept
        </button>
      </div>

      {/*Đặt lịch hẹn */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Schedule an Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Form.Group controlId="appointmentDate">
              <Form.Label className="label">Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                min={minDate}
                max={maxDate}
                value={appointment.date}
                onChange={handleAppointmentChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="appointmentTime" className="mt-3">
              <Form.Label className="label">Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={appointment.time}
                onChange={handleAppointmentChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="footer">
          <Button className="cancel-button" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="agree-button" onClick={handleSubmit}>
            Schedule Appointment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hiển thị bảng cảm ơn*/}
      <Modal show={showThankYou} onHide={() => setShowThankYou(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thank you!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="thank-body">
          Thank you for your interest in adopting a pet. We will contact you as
          soon as possible to complete the adoption procedure. If you have any
          questions, please feel free to contact us via email or hotline.
        </Modal.Body>
        <Modal.Footer className="thank-footer">
          <Button className="close-button" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdoptionProcess;
