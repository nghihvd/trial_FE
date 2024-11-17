import React, { useState, useEffect, useMemo } from "react"; // Added useEffect for fetching donators
import axios from "axios";
import { BASE_URL } from "../services/axios";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PageTitle from "../components/PageTitle"; // Import the new component
import "../styles/donate.scss"; // Import the new SCSS file
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import OtherSupportMethods from "../components/OtherSupportMethods";
import ContactBanner from "../components/ContactBanner";

const Donate = () => {
  const [donators, setDonators] = useState([]); // State for donators
  const [anonymousDonators, setAnonymousDonators] = useState([]); // State for anonymous donators
  const api_donate =
    "https://script.google.com/macros/s/AKfycbyQxSQp5kQd_tzarGa2l61fY2BKAVqC3jIhEhaqGOHOhraucs1P3c87XX4dsAqKRNjUvg/exec";
  const accountID = localStorage.getItem("accountID");
  const eventID = sessionStorage.getItem("eventID");
  let content = ``;

  if (accountID != null && eventID != null) {
    content = `Acc ${accountID} donate ${eventID} `;
  } else if (accountID == null && eventID != null) {
    content = `Donate event ${eventID} `;
  } else {
    content = `Donate FFF`;
  }

  const imageURL = `https://api.vietqr.io/image/970422-1319102004913-wjc5eta.jpg?accountName=TRUONG%20PHUC%20LOC&amount=0&addInfo=${content.replaceAll(
    " ",
    "%20"
  )}`;

  // Combine the useEffect hooks
  useEffect(() => {
    // Fetch donators
    const fetchDonators = async () => {
      try {
        const [donatorsResponse, anonymousResponse] = await Promise.all([
          axios.get(`${BASE_URL}accounts/showDonators`),
          axios.get(`${BASE_URL}donation/getAnonymousDonator`),
        ]);
        setDonators(donatorsResponse.data.data);
        setAnonymousDonators(anonymousResponse.data.data);
        anonymousResponse.data.data.sort(
          (a, b) => new Date(b.date_time) - new Date(a.date_time)
        );
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchDonators();

    // Handle unload
    const handleUnload = () => {
      sessionStorage.removeItem("eventID");
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleDonations = async () => {
    try {
      // Lấy dữ liệu quyên góp
      const donateData = await axios.get(api_donate);
      let donates = donateData.data.data;
      console.log(donateData.data.data);
      toast.success(
        `We will check transaction history. Please check your total donation after a few seconds`
      );
      // Thêm tất cả các khoản quyên góp
      for (let donation of donates) {
        try {
          const response = await axios.post(`${BASE_URL}donation/add`, {
            donateID: donation.id,
            date_time: donation.date_time.replace(" ", "T") + "Z",
            note: donation.content,
            amount: donation.amount,
          });
          console.log(response.data.message);
        } catch (error) {
          console.log(error.response.data);
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const [page, setPage] = useState(0);
  const [page1, setPage1] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowsPerPage1, setRowsPerPage1] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const filteredDonators = donators.filter(
    (donator) =>
      donator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donator.accountID.toString().includes(searchTerm)
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeRowsPerPage1 = (event) => {
    setRowsPerPage1(+event.target.value);
    setPage(0);
  };

  return (
    <div className="donate-container">
      <div className="row">
        <div className="col-sm-7 col-md-7 col-lg-7 donation-notes">
          <h1>I Want to Support</h1>
          <hr className="small-divider left donate-divider" />
          <p>
            All activities of the FurryFriendFund group are entirely based on
            community contributions. The monthly expenses of the group include
            rent, utilities, food, water, medicine, and supplies to support the
            beautiful pets in our care. The group greatly appreciates your
            support to maintain our shelter. A contribution of 50,000 to 100,000
            VND per month can significantly help our group and the animals in
            need.
          </p>
          <p>
            All expenses will be equally distributed among the animals and the
            construction of the shared shelter. Additionally, the group will
            continue to receive donations in the form of used items (like old
            clothes), food, medical supplies, and more.
          </p>
          <p>
            *Note: The group does not use Zalo to request information such as
            sensitive details.
          </p>

          <h4>Scan the QR code above and check the information:</h4>
          <p>
            <strong>Bank:</strong> MB Bank
          </p>
          <p>
            <strong>Account Number:</strong> 1319102004913
          </p>
          <p>
            <strong>Account Name:</strong> TRUONG PHUC LOC
          </p>
          <p>
            <strong>Content:</strong> {content}
          </p>
          <p>
            After a successful donation, click
            <Button className="edit-button" onClick={handleDonations}>
              Here
            </Button>{" "}
            to check the transaction history and save your donation.
          </p>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="fa-solid fa-magnifying-glass search-button"></i>
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={6}
                      className="title-donate"
                    >
                      <h2>Donators</h2>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <h4>Account ID</h4>
                    </TableCell>
                    <TableCell>
                      <h4>Name</h4>
                    </TableCell>
                    <TableCell align="right">
                      <h4>Total Donation</h4>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDonators // Use sorted and filtered list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((donator) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={donator.id}
                      >
                        <TableCell>{donator.accountID}</TableCell>
                        <TableCell>{donator.name}</TableCell>
                        <TableCell align="right">
                          {donator.total_donation.toLocaleString()} VNĐ
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
              count={filteredDonators.length} // Update count for pagination
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>

        <div className="col-sm-5 col-md-5 col-lg-5 res-margin donate-image-anym">
          <img
            src={imageURL}
            alt="Sample"
            style={{ width: "500px", height: "500px" }}
          />
          <Paper
            sx={{ width: "100%", overflow: "hidden" }}
            className="anonymous-donate"
          >
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={2}
                      className="title-donate"
                    >
                      <h2>Anonymous Donators</h2>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <h4>Date</h4>
                    </TableCell>
                    <TableCell align="right">
                      <h4>Total Donation</h4>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {anonymousDonators
                    .slice(
                      page1 * rowsPerPage1,
                      page1 * rowsPerPage1 + rowsPerPage1
                    )
                    .map((donator) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={donator.id}
                      >
                        <TableCell>
                          {new Date(donator.date_time).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {donator.amount.toLocaleString()} VNĐ
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
              count={anonymousDonators.length}
              rowsPerPage={rowsPerPage1}
              page={page1}
              onPageChange={handleChangePage1}
              onRowsPerPageChange={handleChangeRowsPerPage1}
            />
          </Paper>
        </div>
      </div>
      <OtherSupportMethods />
    </div>
  );
};

export default Donate;
