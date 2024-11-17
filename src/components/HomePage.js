import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../styles/homepage.scss";
import { NavLink, useNavigate } from "react-router-dom";
import aboutUsImage from "../assets/images/logo.png"; // Đảm bảo bạn có hình ảnh này
import Spinner from "./Spinner";
import axios from "../services/axios";
import BackToTop from "./BackToTop"; // Import component
import BannerDonate from "./BannerDonate";
import api, { BASE_URL } from "../services/axios";
import Card from "react-bootstrap/Card";
import moment from "moment";
import "../styles/events.scss";
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [otherPets, setOtherPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pets
        const petsResponse = await axios.get("/pets/showListOfPets");
        setOtherPets(petsResponse.data);

        // Fetch events
        const eventsResponse = await api.get("/events/showEvents");
        if (eventsResponse.data.status === 200) {
          setEvents(eventsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (imgUrl) => {
    if (imgUrl.startsWith("http")) return imgUrl;
    return `${BASE_URL}${imgUrl}`;
  };

  useEffect(() => {
    const accountID = localStorage.getItem("accountID");
    if (accountID) {
      sessionStorage.setItem("accountID", accountID);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const handleEventClick = (eventID) => {
    navigate(`/events/${eventID}`);
  };

  const getEventTimeInfo = (event) => {
    const now = moment();
    const startDate = moment(event.start_date);
    const endDate = moment(event.end_date);

    if (now.isBefore(startDate)) {
      const daysUntilStart = startDate.diff(now, "days");
      if (daysUntilStart === 0) {
        return "Event starts soon";
      }
      return `Event starts in ${daysUntilStart} day${
        daysUntilStart > 1 ? "s" : ""
      }`;
    } else if (now.isBetween(startDate, endDate)) {
      return "Event is ongoing";
    }
    return null;
  };

  return (
    /**Banner */
    <div className="homepage">
      <section className="hero-section">
        <h2>FurryFriendsFund</h2>
        <p>"Open your heart, adopt a furry friend in need!"</p>
      </section>

      <section className="about-us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h2>Adopt Pets - FurryFriendsFund</h2>
              <p>
                We are a group of passionate young students from FPT University,
                working together on a meaningful project focused on the adoption
                and fundraising support for stray dogs and cats. With the goal
                of giving these pets a new home, our group not only connects
                abandoned dogs and cats with loving owners but also organizes
                fundraising events to help cover the costs of their care and
                medical treatment. Through this project, we hope to spread the
                message of love and responsibility towards these less fortunate
                pets, while also fostering a connected community that stands
                together for animal welfare.
              </p>

              <NavLink to="/contact" className="nav-link">
                <button className="about-us-button">ABOUT US</button>
              </NavLink>
            </div>
            <div className="col-md-4">
              <img
                src={aboutUsImage}
                alt="About Us"
                className="about-us-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách các bé */}
      <section className="featured-pets">
        <h2>Lists of pets</h2>
        <Carousel
          responsive={responsive}
          infinite={true}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {otherPets.map((otherPet, index) => (
            <div key={index} className="pet-card">
              <NavLink to={`/petdetail/${otherPet.petID}`} className="nav-link">
                <img src={getImageUrl(otherPet.img_url)} alt={otherPet.name} />
                <h3>{otherPet.name}</h3>
                <p>Sex: {otherPet.sex}</p>
                <p>Age: {otherPet.age}</p>
                <p>Vaccinated: {otherPet.vaccinated ? "Yes" : "No"}</p>
              </NavLink>
            </div>
          ))}
        </Carousel>
        <NavLink to="/petlist" className="nav-link">
          <button className="adopt-button">ADOPT</button>
        </NavLink>
      </section>

      {/* Thay thế phần Events */}
      <section className="featured-events">
        <h2>Events</h2>
        <Carousel
          responsive={responsive}
          infinite={true}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {events.map((event) => (
            <div
              key={event.eventID}
              className="event-card"
              onClick={() => handleEventClick(event.eventID)}
            >
              <Card.Img
                variant="top"
                src={getImageUrl(event.img_url)}
                alt={event.title}
              />
              <Card.Body>
                <Card.Title>{event.event_name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {event.title}
                </Card.Subtitle>
                <div className="event-description"> {event.description}</div>
                {getEventTimeInfo(event) && (
                  <Card.Text
                    className="event-time-info"
                    style={{
                      fontSize: "14px",
                      color: "green",
                      fontWeight: "bold",
                      marginTop: "10px",
                      padding: "5px",
                      borderRadius: "4px",
                    }}
                  >
                    {getEventTimeInfo(event)}
                  </Card.Text>
                )}
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">
                  Start Date: {new Date(event.start_date).toLocaleDateString()}
                </small>
                <br />
                <small className="text-muted">
                  End Date: {new Date(event.end_date).toLocaleDateString()}
                </small>
                <br />
              </Card.Footer>
            </div>
          ))}
        </Carousel>

        <NavLink to="/events" className="nav-link">
          <button className="view-all-events">VIEW ALL EVENTS</button>
        </NavLink>
      </section>

      <BannerDonate />

      <BackToTop />
    </div>
  );
};

export default HomePage;
