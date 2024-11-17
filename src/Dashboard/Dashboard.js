import React, { useState, useEffect, useCallback } from "react";
import axios from "../services/axios";
import "../styles/dashboard.scss";
import Spinner from "../components/Spinner";
import api from "../services/axios";
import { PieChart } from "@mui/x-charts/PieChart";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [isLoading, setIsLoading] = useState(false);
  const [accountStats, setAccountStats] = useState({});
  const [roleStats, setRoleStats] = useState({});
  const [petStats, setPetStats] = useState({});
  const [eventStats, setEventStats] = useState({});
  const [donationStats, setDonationStats] = useState({});

  const fetchAccountStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getAccounts");
      setAccountStats(response.data.data);
    } catch (error) {
      console.error("Error fetching account stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch role statistics
  const fetchRoleStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getRoleAccounts");
      setRoleStats(response.data.data);
    } catch (error) {
      console.error("Error fetching role stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch pet statistics
  const fetchPetStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getPetTotal");
      setPetStats(response.data.data);
    } catch (error) {
      console.error("Error fetching pet stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch event statistics
  const fetchEventStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getEventTotal");
      setEventStats(response.data.data);
    } catch (error) {
      console.error("Error fetching event stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch donation statistics
  const fetchDonationStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/getDonateTotal");
      setDonationStats(response.data.data);
    } catch (error) {
      console.error("Error fetching donation stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data based on active tab
  const refreshData = useCallback(() => {
    switch (activeTab) {
      case "accounts":
        fetchAccountStats();
        fetchRoleStats();
        break;
      case "pets":
        fetchPetStats();
        break;
      case "events":
        fetchEventStats();
        break;
      case "donations":
        fetchDonationStats();
        break;
      default:
        break;
    }
  }, [
    activeTab,
    fetchAccountStats,
    fetchRoleStats,
    fetchPetStats,
    fetchEventStats,
    fetchDonationStats,
  ]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const renderAccountCharts = () => {
    const accountData = [
      { id: 0, value: accountStats.available || 0, label: "Available" },
      { id: 1, value: accountStats.banned || 0, label: "Banned" },
      { id: 2, value: accountStats.waiting || 0, label: "Waiting" },
    ];

    const roleData = [
      { id: 0, value: roleStats.admin || 0, label: "Admin" },
      { id: 1, value: roleStats.staff || 0, label: "Staff" },
      { id: 2, value: roleStats.member || 0, label: "Member" },
    ];

    return (
      <div className="stats-container">
        <div className="stats-section">
          <h3>Account Status</h3>
          <div className="chart-container">
            <PieChart
              series={[
                {
                  data: accountData,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              width={350}
              height={200}
            />
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Available</td>
                <td>{accountStats.available}</td>
              </tr>
              <tr>
                <td>Banned</td>
                <td>{accountStats.banned}</td>
              </tr>
              <tr>
                <td>Waiting</td>
                <td>{accountStats.waiting}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{accountStats.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="stats-section">
          <h3>Account Roles</h3>
          <div className="chart-container">
            <PieChart
              series={[
                {
                  data: roleData,
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              width={350}
              height={200}
            />
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Admin</td>
                <td>{roleStats.admin}</td>
              </tr>
              <tr>
                <td>Staff</td>
                <td>{roleStats.staff}</td>
              </tr>
              <tr>
                <td>Member</td>
                <td>{roleStats.member}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{roleStats.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPetCharts = () => {
    const petData = [
      { id: 0, value: petStats.available || 0, label: "Available" },
      { id: 1, value: petStats.unavailable || 0, label: "Unavailable" },
      { id: 2, value: petStats.adopted || 0, label: "Adopted" },
    ];

    return (
      <div className="stats-section">
        <h3>Pet Statistics</h3>
        <div className="chart-container">
          <PieChart
            series={[
              {
                data: petData,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -30 },
              },
            ]}
            width={400}
            height={200}
          />
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Available</td>
              <td>{petStats.available}</td>
            </tr>
            <tr>
              <td>Unavailable</td>
              <td>{petStats.unavailable}</td>
            </tr>
            <tr>
              <td>Adopted</td>
              <td>{petStats.adopted}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>{petStats.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar-dashboard">
        <h2>Dashboard</h2>
        <ul>
          <li
            className={activeTab === "accounts" ? "active" : ""}
            onClick={() => setActiveTab("accounts")}
          >
            Accounts
          </li>
          <li
            className={activeTab === "pets" ? "active" : ""}
            onClick={() => setActiveTab("pets")}
          >
            Pets
          </li>
          <li
            className={activeTab === "events" ? "active" : ""}
            onClick={() => setActiveTab("events")}
          >
            Events
          </li>
          <li
            className={activeTab === "donations" ? "active" : ""}
            onClick={() => setActiveTab("donations")}
          >
            Donations
          </li>
        </ul>
      </div>

      <div className="main-content">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="stats-container">
            {activeTab === "accounts" && renderAccountCharts()}
            {activeTab === "pets" && (
              <div className="stats-section">
                <h3>Pet Statistics</h3>
                <div className="chart-container">
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: 0,
                            value: petStats.available || 0,
                            label: "Available",
                          },
                          {
                            id: 1,
                            value: petStats.unavailable || 0,
                            label: "Unavailable",
                          },
                          {
                            id: 2,
                            value: petStats.adopted || 0,
                            label: "Adopted",
                          },
                        ],
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: { innerRadius: 30, additionalRadius: -30 },
                      },
                    ]}
                    width={400}
                    height={200}
                  />
                </div>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Available</td>
                      <td>{petStats.available}</td>
                    </tr>
                    <tr>
                      <td>Unavailable</td>
                      <td>{petStats.unavailable}</td>
                    </tr>
                    <tr>
                      <td>Adopted</td>
                      <td>{petStats.adopted}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{petStats.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "events" && (
              <div className="stats-section">
                <h3>Event Statistics</h3>
                <div className="chart-container">
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: 0,
                            value: eventStats.waiting || 0,
                            label: "Waiting",
                          },
                          {
                            id: 1,
                            value: eventStats.updating || 0,
                            label: "Updating",
                          },
                          {
                            id: 2,
                            value: eventStats.published || 0,
                            label: "Published",
                          },
                          {
                            id: 3,
                            value: eventStats.ending || 0,
                            label: "Ending",
                          },
                        ],
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: { innerRadius: 30, additionalRadius: -30 },
                      },
                    ]}
                    width={400}
                    height={200}
                  />
                </div>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Waiting</td>
                      <td>{eventStats.waiting}</td>
                    </tr>
                    <tr>
                      <td>Updating</td>
                      <td>{eventStats.updating}</td>
                    </tr>
                    <tr>
                      <td>Published</td>
                      <td>{eventStats.published}</td>
                    </tr>
                    <tr>
                      <td>Ending</td>
                      <td>{eventStats.ending}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{eventStats.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "donations" && (
              <div className="stats-section">
                <h3>Donation Statistics</h3>
                <div className="chart-container">
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: 0,
                            value: donationStats.anonymous || 0,
                            label: "Anonymous",
                          },
                          {
                            id: 1,
                            value: donationStats.eventDonate || 0,
                            label: "Event Donations",
                          },
                        ],
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: { innerRadius: 30, additionalRadius: -30 },
                      },
                    ]}
                    width={450}
                    height={200}
                  />
                </div>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Anonymous</td>
                      <td>{donationStats.anonymous}</td>
                    </tr>
                    <tr>
                      <td>Event Donations</td>
                      <td>{donationStats.eventDonate}</td>
                    </tr>
                    <tr>
                      <td>Total</td>
                      <td>{donationStats.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
