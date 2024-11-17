import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { BASE_URL } from "../services/axios";
import "../styles/Eventdetail.scss";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import EventStatus from "../components/EventStatus";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const roleID = localStorage.getItem("roleID");
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await api.get(`/events/${eventId}/getEventById`, {
          params: { eventId: eventId },
        });
        if (response.data.status === 200) {
          setEvent(response.data.data);
        } else {
          toast.error("Failed to load event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("An error occurred while loading event details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await api.get(`/donation/getDonateByEvent/${eventId}`);
        if (response.data.status === 200) {
          setDonations(response.data.data);
        } else {
          setDonations([]);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
        console.log("No donations found");

        setDonations([]);
      }
    };

    if (eventId) {
      fetchDonations();
    }
  }, [eventId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDonate = () => {
    sessionStorage.setItem("eventID", event.eventID);
    navigate(`/donatevent`);
  };

  const getImageUrl = (imgUrl) => {
    if (imgUrl.startsWith("images\\"))
      return `${BASE_URL}${imgUrl.replace("\\", "/")}`;
    return imgUrl;
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="event-detail-container">
      <div className="row">
        <div className="col-sm-8 col-md-8 col-lg-8 event">
          <h1>{event.event_name}</h1>
          <h4>
            Status: <EventStatus status={event.status} />
          </h4>
          <p>
            <strong>Event time:</strong>{" "}
            {new Date(event.start_date).toLocaleDateString()}
          </p>
          <img
            src={getImageUrl(event.img_url)}
            alt={event.event_name}
            style={{ width: "40%", height: "40%" }}
          />
          <p className="description">{event.description}</p>
          {(!isLoggedIn || (isLoggedIn && roleID === "3")) && (
            <button className="donate-button" onClick={handleDonate}>
              Donate now
            </button>
          )}
        </div>
        <div className="col-sm-4 col-md-4 col-lg-4 history-donation-table">
          <div className="donation-history" style={{ marginTop: "2rem" }}>
            <h2>Donation History</h2>
            {donations.length === 0 ? (
              <p>No donations yet</p>
            ) : (
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <h4>Date</h4>
                        </TableCell>
                        <TableCell>
                          <h4>Account ID</h4>
                        </TableCell>
                        <TableCell align="right">
                          <h4>Amount</h4>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {donations
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((donation, index) => (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                          >
                            <TableCell>
                              {new Date(donation.date_time).toLocaleDateString(
                                "vi-VN"
                              )}
                            </TableCell>
                            <TableCell>
                              {donation.accountID || "Anonymous"}
                            </TableCell>
                            <TableCell align="right">
                              {donation.amount.toLocaleString()} VND
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  className="root-table"
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={donations.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
