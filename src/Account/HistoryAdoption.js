import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import "../styles/adminpage.scss";
import { NavLink } from "react-bootstrap";

const HistoryAdoption = () => {
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const accountID = localStorage.getItem("accountID");

  const getImageUrl = useCallback((img_url) => {
    if (img_url.startsWith("http")) return img_url;
    // Chỉnh sửa ở đây để tạo URL đúng định dạng
    return `http://localhost:8081/${img_url.replace(/\\/g, "/")}`;
  }, []);

  useEffect(() => {
    const fetchAdoptedPets = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/pets/historyAdopt/${accountID}`);
        setAdoptedPets(response.data.data);
        console.log(response.data.data);
        setImagePreview(getImageUrl(response.data.data.img_url));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdoptedPets();
  }, [accountID]);

  const handleReportVideo = (pet) => {
    if (pet.petID) {
      navigate(`/report/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefined");
    }
  };

  const handleViewDetail = (pet) => {
    navigate(`/petdetail/${pet.petID}`, { state: { pet } });
  };

  const handleViewReportHistory = (pet) => {
    if (pet.petID) {
      navigate(`/reportdetail/${pet.petID}`, { state: { petID: pet.petID } });
    } else {
      console.error("Pet ID is undefined");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="admin-notifications">
      <div className="notifications-content">
        <h1>Adopted Pets History</h1>
        {adoptedPets.length === 0 ? (
          <p>No pets found in adoption history.</p>
        ) : (
          <ul className="notification-list">
            {adoptedPets.map((pet) => (
              <li key={pet.petID} className="notification-item">
                <div className="pet-image-history">
                  <img
                    src={getImageUrl(pet.img_url)}
                    alt={pet.name}
                    className="img-preview"
                    style={{ width: "50%", height: "50%" }}
                  />
                </div>
                <div className="pet-info-history">
                  <h2>{pet.name}</h2>
                  <p>Breed: {pet.breed}</p>
                  <p>Age: {pet.age} months</p>
                  <p>Weight: {pet.weight} kg</p>
                </div>
                <div className="button-report">
                  <button
                    className="report-button"
                    onClick={() => handleReportVideo(pet)}
                  >
                    Report
                  </button>
                  <button
                    className="report-button"
                    onClick={() => handleViewDetail(pet)}
                  >
                    View Detail
                  </button>
                  <button
                    className="report-button"
                    onClick={() => handleViewReportHistory(pet)}
                  >
                    View History Report
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryAdoption;
