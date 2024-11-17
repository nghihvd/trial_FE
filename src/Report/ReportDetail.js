import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const ReportDetail = () => {
  const location = useLocation();
  const petID = location.state?.petID;
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/report/getPetReports/${petID}`);
        setReports(response.data.data);
        setVideo(response.data.data[0]?.video);
        console.log(response.data.data);
      } catch (error) {
        toast.error("Error fetching report history");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [petID]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const videoSrc = video ? `data:video/webm;base64,${video}` : null;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <h2>Report History for Pet ID: {petID}</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id}>
              <h2>Date of report: {formatDate(report.date_report)}</h2>
              <video
                src={videoSrc}
                controls
                style={{ width: "400px", height: "300px" }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportDetail;
