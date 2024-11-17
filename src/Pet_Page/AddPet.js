import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { BASE_URL } from "../services/axios";
import "../styles/addpet.scss";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const AddPet = ({ onPetAdded = () => {} }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [petData, setPetData] = useState({
    name: "",
    breed: "",
    sex: "",
    age: "",
    weight: "",
    note: "",
    size: "",
    potty_trained: false,
    dietary_requirements: false,
    spayed: false,
    vaccinated: false,
    socialized: false,
    rabies_vaccinated: false,
    origin: "",
    img_url: "",
    categoryID: 0,
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const roleID = localStorage.getItem("roleID");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPetData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetData((prev) => ({
        ...prev,
        img_url: file, // Lưu file vào img_url thay vì tạo thuộc tính image mới
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    // Lặp qua tất cả các trường dữ liệu
    for (const key in petData) {
      if (key === "img_url" && petData[key]) {
        formData.append("img_url", petData[key]); // Gửi file với key là img_url
      } else {
        formData.append(key, petData[key]);
      }
    }

    // Log để kiểm tra dữ liệu
    console.log("Pet Data being sent:");
    for (const [key, value] of formData.entries()) {
      if (key === "img_url") {
        console.log("img_url:", {
          name: value.name,
          size: value.size,
          type: value.type,
        });
      } else {
        console.log(`${key}:`, value);
      }
    }

    try {
      const response = await axios.postForm("pets/addPets", formData);
      toast.success("Added pet successfully. Waiting admin to accept");
      onPetAdded();
      navigate("/petlistadmin");
    } catch (error) {
      console.error("Error adding pet:", error);
      if (error.response) {
        console.error("Response data:", error.response.data); // Log the response data
      }
      toast.error("Failed to add pet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setPetData((prev) => ({
      ...prev,
      categoryID: value ? parseInt(value, 10) : 0,
    }));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container pets-container">
      <h1 className="add-pet__title">CREATE PET</h1>
      <div className="row">
        <div className="col-lg-6 col-md-6 col-sm-12 text-center">
          <input
            type="file"
            name="img_url"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Pet Preview"
              className="img-preview"
              style={{ width: "50%", marginTop: "10px" }}
            />
          )}
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 text-center">
          <input
            type="text"
            placeholder="Pet Name"
            className="form-control"
            name="name"
            value={petData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Pet Breed"
            className="form-control"
            name="breed"
            value={petData.breed}
            onChange={handleChange}
            required
          />
          <select
            className="form-select male"
            name="sex"
            value={petData.sex}
            onChange={handleChange}
            required
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="number"
            step="0.5"
            placeholder="Pet Age(Month)"
            className="form-control"
            name="age"
            value={petData.age}
            onChange={handleChange}
            required
            min="0"
          />
          <input
            type="number"
            step="0.1"
            placeholder="Pet Weight(Kg)"
            className="form-control"
            name="weight"
            value={petData.weight}
            onChange={handleChange}
            min="0.1"
          />

          <select
            type="text"
            placeholder="Size"
            className="form-control"
            name="size"
            value={petData.size}
            onChange={handleChange}
          >
            <option value="">Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
          <select
            className="form-select"
            placeholder="Category"
            name="categoryID"
            value={petData.categoryID}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Category</option>
            <option value="1">Dog</option>
            <option value="2">Cat</option>
          </select>
          <input
            type="text"
            placeholder="Origin"
            className="form-control"
            name="origin"
            value={petData.origin}
            onChange={handleChange}
          />
          <textarea
            placeholder="Description"
            className="form-control"
            name="description"
            value={petData.description}
            onChange={handleChange}
          />
          {/*Checkbox */}
          <div className="col-md-3">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="potty_trained"
                checked={petData.potty_trained}
                onChange={handleChange}
              />
              <label className="form-check-label">Potty Trained</label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="spayed"
                checked={petData.spayed}
                onChange={handleChange}
              />
              <label className="form-check-label">Spayed</label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="vaccinated"
                checked={petData.vaccinated}
                onChange={handleChange}
              />
              <label className="form-check-label">Vaccinated</label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="socialized"
                checked={petData.socialized}
                onChange={handleChange}
              />
              <label className="form-check-label">Socialized</label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="rabies_vaccinated"
                checked={petData.rabies_vaccinated}
                onChange={handleChange}
              />
              <label className="form-check-label">Rabies Vaccinated</label>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="dietary_requirements"
                checked={petData.dietary_requirements}
                onChange={handleChange}
              />
              <label className="form-check-label">Dietary Requirements</label>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="create-button w-50"
            type="submit"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPet;
