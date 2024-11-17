import { useState, useEffect, useCallback } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { BASE_URL } from "../services/axios";
import "../styles/petListAdmin.scss";
import { FaFilter } from "react-icons/fa";
import AddPet from "./AddPet";
import StatusDot from "../components/StatusDot";
import Spinner from "../components/Spinner";
import api from "../services/axios";
const PetListAdmin = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [petsPerPage] = useState(12);
  const [searchParams, setSearchParams] = useState({
    name: "",
    age: "",
    categoryID: 0,
    sex: "",
  });
  const [ageError, setAgeError] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false); // State để kiểm soát hiển thị AddPet
  const roleID = localStorage.getItem("roleID");
  const [isSearch, setIsSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Token:", localStorage.getItem("token"));
    console.log("RoleID:", roleID);
    const checkRole = async () => {
      try {
        if (roleID === "1" || roleID === "2") {
          await apiListAllPets();
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    checkRole();
  }, [navigate]);

  const handlePetClick = (pet) => {
    if (pet.petID) {
      console.log("Navigating to pet detail with ID:", pet.petID);
      navigate(`/petdetail/${pet.petID}`, { state: { pet } });
    } else {
      console.error("Pet ID is undefied");
    }
  };

  const apiListAllPets = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/pets/showListAllOfPets");
      console.log("API response:", response);
      if (response.data && Array.isArray(response.data)) {
        setPets(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        setPets([]);
      }
    } catch (error) {
      console.error("Error fetching all pets:", error);
      if (error.response) {
        if (error.response.status) {
          console.error("Error response status:", error.response.status);
        } else {
          console.error("Status is missing in response.");
        }
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    apiListAllPets(); // Gọi hàm fetchPets khi component được mount
  }, []);

  const handlePetAdded = () => {
    setShowAddPet(false); // Đặt lại trạng thái showAddPet về false
    apiListAllPets(); // Gọi lại API để cập nhật danh sách pet
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
      const response = await api.get("/pets/searchByNameAndBreedAdmin", {
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
        setAgeError("Age must be 1 or greater");
      }
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        [name]:
          name === "categoryID" ? (value === "" ? 0 : parseInt(value)) : value,
      }));
    }
  };

  const getImageUrl = useCallback((imgUrl) => {
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  }, []);

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading || isSearch) {
    return <Spinner />;
  }

  return (
    <div className="pets-list-admin-container">
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
            {roleID === "2" && (
              <div className="add-update-button">
                <NavLink
                  to="/addpet"
                  className="nav-link-add-pet"
                  onClick={() => setShowAddPet(true)}
                >
                  <h3>Create Pet</h3>
                </NavLink>
              </div>
            )}
          </div>
        </form>
      </div>
      {showAddPet && <AddPet onPetAdded={handlePetAdded} />}
      {/* Ensure this is correct */}
      {/* Chỉ hiển thị AddPet khi showAddPet là true */}
      {/* Truyền hàm handlePetAdded vào AddPet */}
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
                {pet.status && <StatusDot status={pet.status} />}
              </div>
              <div className="pet-info-divider"></div>
              <p>Age: {pet.age} month</p>
              <p>Sex: {pet.sex}</p>
              <button onClick={() => handlePetClick(pet)}>View Details</button>
            </div>
          ))
        ) : (
          <p>No pets found</p>
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
    </div>
  );
};

export default PetListAdmin;
