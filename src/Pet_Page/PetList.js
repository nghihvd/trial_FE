import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios, { BASE_URL } from "../services/axios";
import "../styles/petslist.scss";
import { FaFilter } from "react-icons/fa";
import StatusDot from "../components/StatusDot";
import Spinner from "../components/Spinner";
import BackToTop from "../components/BackToTop";
import BannerDonate from "../components/BannerDonate";
import api from "../services/axios";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import AppointmentList from "../components/AppointmentList";

const PetsList = () => {
  const [pets, setPets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [petsPerPage] = useState(12);
  const [searchParams, setSearchParams] = useState({
    name: "",
    age: "",
    categoryID: 0,
    sex: "",
  });
  const navigate = useNavigate();
  const [ageError, setAgeError] = useState("");
  const [noResults, setNoResults] = useState(false);
  const roleID = localStorage.getItem("roleID");
  const [isLoading, setIsLoading] = useState(true);
  const accountID = localStorage.getItem("accountID");
  const [memberAppointments, setMemberAppointments] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    apiListPets();
    apiShowAppointmentforMember(accountID);
  }, []);

  const apiListPets = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/pets/showListOfPets");
      // Lọc chỉ lấy pet có status là 'Available' hoặc 'Waiting'
      const filteredPets = response.data.filter(
        (pet) => pet.status === "Available" || pet.status === "Waiting"
      );
      setPets(filteredPets);
    } catch (error) {
      console.error("Error Api pets:", error);
      if (error.code === "ERR_NETWORK") {
        console.error("Network error!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const apiShowAppointmentforMember = async (accountID) => {
    try {
      const response = await api.get(
        `/appointment/showAppointmentForMember/${accountID}`
      );
      console.log(response.data);
      if (response.data.status === 200) {
        setMemberAppointments(response.data.data);
      } else {
        setMemberAppointments([]);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error Api Show Appointment for Member:", error);
      setMemberAppointments([]);
    }
  };

  const handleCancelAppointment = async (appointmentID) => {
    setIsLoading(true);
    try {
      const response = await api.delete("/appointment/cancelAppointment", {
        data: { appointID: appointmentID },
      });

      if (response.data.status === 200) {
        toast.success(response.data.message); // Hiển thị thông báo thành công
        // Refresh lại danh sách appointments
        apiShowAppointmentforMember(accountID);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      // Hiển thị thông báo lỗi từ server nếu có
      toast.error(
        error.response?.data?.message || "Error canceling appointment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearch(true);
    try {
      const searchData = {
        name: searchParams.name || "",
        age: searchParams.age ? parseFloat(searchParams.age) : 0,
        categoryID: searchParams.categoryID || 0,
        sex: searchParams.sex || "",
      };

      const response = await api.get("/pets/searchByNameAndBreed", {
        params: searchData,
      });
      if (response.data.length === 0) {
        setNoResults(true);
        setPets([]);
      } else {
        setNoResults(false);
        setPets(response.data);
      }
    } catch (error) {
      console.error("Error searching pets:", error);
      setNoResults(true);
      setPets([]);
    } finally {
      setIsSearch(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      const floatValue = parseFloat(value);
      if (value === "" || (floatValue >= 0 && !isNaN(floatValue))) {
        setSearchParams((prevParams) => ({
          ...prevParams,
          [name]: value,
        }));
        setAgeError("");
      } else {
        setAgeError("Age must be 0 or greater");
      }
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        [name]:
          name === "categoryID" ? (value === "" ? 0 : parseInt(value)) : value,
      }));
    }
  };

  const handlePetClick = (pet) => {
    if (pet.petID) {
      navigate(`/petdetail/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };

  const getImageUrl = useCallback((imgUrl) => {
    if (!imgUrl) return "/path/to/default/image.jpg";
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  }, []);

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenCancelDialog = (appointmentID) => {
    setAppointmentToCancel(appointmentID);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setAppointmentToCancel(null);
  };

  if (isLoading || isSearch) {
    return <Spinner />;
  }

  return (
    <div className="pets-list-container">
      <div className="filter-and-search">
        <div className="search-section">
          <div className="search-inputs">
            <input
              type="text"
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </div>

          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={ageError !== "" || isSearch}
          >
            Search
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="other-filters">
            <div className="filter-section">
              <h3>
                <FaFilter /> filter
              </h3>
            </div>
            <input
              type="number"
              name="age"
              value={searchParams.age}
              onChange={handleInputChange}
              placeholder="Select Age"
              step="0.5"
              min="0"
            />
            {ageError && <span className="error">{ageError}</span>}
            <select
              name="categoryID"
              value={searchParams.categoryID}
              onChange={handleInputChange}
            >
              <option value={0}>Select Category</option>
              <option value={1}>Dog</option>
              <option value={2}>Cat</option>
            </select>
            <select
              name="sex"
              value={searchParams.sex}
              onChange={handleInputChange}
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </form>
      </div>
      {memberAppointments.length > 0 && (
        <AppointmentList
          appointments={memberAppointments}
          onCancelAppointment={handleOpenCancelDialog}
        />
      )}

      <ConfirmDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={() => {
          handleCancelAppointment(appointmentToCancel);
          handleCloseConfirmDialog();
        }}
        title="Cancel Appointment"
        content="Are you sure you want to cancel this appointment?"
        confirmText="Yes, Cancel"
        cancelText="No, Keep it"
      />

      <div className="pets-grid">
        {currentPets.length > 0 ? (
          currentPets.map((pet) => (
            <div
              key={pet.petID}
              className="pet-item"
              onClick={() => handlePetClick(pet)}
            >
              <img src={getImageUrl(pet.img_url)} alt={pet.name} />
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <StatusDot status={pet.status} />
              </div>
              <div className="pet-info-divider"></div>
              <p>Age: {pet.age} month</p>
              <p>Sex: {pet.sex}</p>
              <button onClick={() => handlePetClick(pet)}>View Details</button>
            </div>
          ))
        ) : (
          <h2>No pets found on the system! </h2>
        )}
      </div>
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(pets.length / petsPerPage) },
          (_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          )
        )}
      </div>
      <BannerDonate />
      <BackToTop />
    </div>
  );
};

export default PetsList;
