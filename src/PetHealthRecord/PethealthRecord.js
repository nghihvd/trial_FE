import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import Spinner from "../components/Spinner";
import "../styles/petHealthRecord.scss";
import { toast } from "react-toastify";
import { styled } from "@mui/system";
import DeleteDialog from "../components/DeleteDialog";

import Button from "@mui/material/Button";

const PetHealthRecord = ({ petID, pet }) => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const roleID = localStorage.getItem("roleID");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editedRows, setEditedRows] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newRecord, setNewRecord] = useState({
    veterinarian_name: "",
    check_in_date: "",
    check_out_date: "",
    illness_name: "",
    veterinary_fee: 0,
    note: "",
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  useEffect(() => {
    fetchPetHealthRecords();
  }, [petID]);

  const fetchPetHealthRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/petHealth/showPetHealth/${petID}`);
      if (response.data.data) {
        setHealthRecords(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to fetch pet health records");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRow = (record) => {
    setEditedRows((prev) => ({ ...prev, [record.recordID]: { ...record } }));
  };

  const handleSaveEdit = async (recordID) => {
    try {
      const updatedRecord = editedRows[recordID];

      if (
        new Date(updatedRecord.check_out_date) <=
        new Date(updatedRecord.check_in_date)
      ) {
        toast.error("Check-out date must be after check-in date");
        return;
      }

      const response = await axios.put(
        "/petHealth/updateHealth",
        updatedRecord
      );
      if (response.data.data) {
        toast.success(response.data.message);
        fetchPetHealthRecords();
        setEditedRows((prev) => {
          const newState = { ...prev };
          delete newState[recordID]; // Xóa bản ghi đã chỉnh sửa
          return newState;
        });
      } else {
        throw new Error("Failed to update record");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update record");
      console.error(err);
    }
  };

  const handleDeleteRow = (recordID) => {
    setRecordToDelete(recordID);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      try {
        await axios.delete(`/petHealth/deleteHealth/${recordToDelete}`);
        toast.success("Record deleted successfully");
        fetchPetHealthRecords();
      } catch (err) {
        toast.error("Failed to delete record");
        console.error(err);
      } finally {
        setOpenDeleteDialog(false);
        setRecordToDelete(null);
      }
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      if (
        new Date(newRecord.check_out_date) <= new Date(newRecord.check_in_date)
      ) {
        toast.error("Check-out date must be after check-in date");
        return;
      }

      const response = await axios.post("/petHealth/addRecord", {
        ...newRecord,
        petID,
      });
      if (response.data.data) {
        toast.success(response.data.message);
        fetchPetHealthRecords();
        setShowAddForm(false);
        setNewRecord({
          veterinarian_name: "",
          check_in_date: "",
          check_out_date: "",
          illness_name: "",
          veterinary_fee: "",
          note: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      setError(err.response.data.message);
      console.error(err);
    }
  };

  const handleCancelEdit = (recordID) => {
    setEditedRows((prev) => {
      const newState = { ...prev };
      delete newState[recordID]; // Remove the edited row state
      return newState;
    });
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - healthRecords.length) : 0;

  return (
    <div className="pet-health-records">
      <h2>Pet Health Records</h2>
      {roleID === "2" && pet.status === "Available" && (
        <div className="controls">
          <Button
            className="action-button add-new-record-button"
            variant="contained"
            color="primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add New Record
          </Button>
        </div>
      )}
      {showAddForm && (
        <form onSubmit={handleAddRecord} className="pethealthdetail">
          <input
            type="text"
            name="veterinarian_name"
            placeholder="Veterinarian Name"
            value={newRecord.veterinarian_name}
            onChange={(e) =>
              setNewRecord({ ...newRecord, veterinarian_name: e.target.value })
            }
            required
          />
          <input
            type="date"
            name="check_in_date"
            value={newRecord.check_in_date}
            onChange={(e) =>
              setNewRecord({ ...newRecord, check_in_date: e.target.value })
            }
            required
          />
          <input
            type="date"
            name="check_out_date"
            value={newRecord.check_out_date}
            min={newRecord.check_in_date || undefined}
            onChange={(e) =>
              setNewRecord({ ...newRecord, check_out_date: e.target.value })
            }
            required
          />
          <input
            type="text"
            name="illness_name"
            placeholder="Illness Name"
            value={newRecord.illness_name}
            onChange={(e) =>
              setNewRecord({ ...newRecord, illness_name: e.target.value })
            }
            required
          />
          <input
            type="number"
            name="veterinary_fee"
            placeholder="Veterinary Fee"
            min={1}
            step={1}
            value={newRecord.veterinary_fee}
            onChange={(e) =>
              setNewRecord({ ...newRecord, veterinary_fee: e.target.value })
            }
            required
          />
          <input
            type="text"
            name="note"
            placeholder="Notes"
            value={newRecord.note}
            onChange={(e) =>
              setNewRecord({ ...newRecord, note: e.target.value })
            }
          />
          <button className="action-button add-record-button" type="submit">
            Add Record
          </button>
        </form>
      )}
      <Root sx={{ maxWidth: "100%", width: "100%" }}>
        <table aria-label="custom pagination table">
          <thead>
            <tr>
              <th>Veterinarian</th>
              <th>Check-in Date</th>
              <th>Check-out Date</th>
              <th>Illness</th>
              <th>Veterinary Fee</th>
              <th>Notes</th>
              {roleID === "2" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(rowsPerPage > 0
              ? healthRecords.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : healthRecords
            ).map((row) => (
              <tr key={row.recordID}>
                <td>
                  {editedRows[row.recordID] ? (
                    <input
                      type="text-edit"
                      value={editedRows[row.recordID].veterinarian_name}
                      onChange={(e) =>
                        setEditedRows((prev) => ({
                          ...prev,
                          [row.recordID]: {
                            ...prev[row.recordID],
                            veterinarian_name: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    row.veterinarian_name
                  )}
                </td>
                <td>
                  {editedRows[row.recordID] ? (
                    <input
                      type="date-edit"
                      value={
                        new Date(editedRows[row.recordID].check_in_date)
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setEditedRows((prev) => ({
                          ...prev,
                          [row.recordID]: {
                            ...prev[row.recordID],
                            check_in_date: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    new Date(row.check_in_date).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editedRows[row.recordID] ? (
                    <input
                      type="date-edit"
                      value={
                        new Date(editedRows[row.recordID].check_out_date)
                          .toISOString()
                          .split("T")[0]
                      }
                      min={editedRows[row.recordID].check_in_date}
                      onChange={(e) =>
                        setEditedRows((prev) => ({
                          ...prev,
                          [row.recordID]: {
                            ...prev[row.recordID],
                            check_out_date: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    new Date(row.check_out_date).toLocaleDateString()
                  )}
                </td>
                <td>
                  {editedRows[row.recordID] ? (
                    <input
                      type="text-edit"
                      value={editedRows[row.recordID].illness_name}
                      onChange={(e) =>
                        setEditedRows((prev) => ({
                          ...prev,
                          [row.recordID]: {
                            ...prev[row.recordID],
                            illness_name: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    row.illness_name
                  )}
                </td>
                <td>
                  {editedRows[row.recordID] ? (
                    <input
                      type="number"
                      value={editedRows[row.recordID].veterinary_fee}
                      onChange={(e) =>
                        setEditedRows((prev) => ({
                          ...prev,
                          [row.recordID]: {
                            ...prev[row.recordID],
                            veterinary_fee: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    `${row.veterinary_fee.toLocaleString()} VNĐ`
                  )}
                </td>
                <td>
                  {editedRows[row.recordID] ? (
                    <input
                      type="text"
                      value={editedRows[row.recordID].note}
                      onChange={(e) =>
                        setEditedRows((prev) => ({
                          ...prev,
                          [row.recordID]: {
                            ...prev[row.recordID],
                            note: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    row.note
                  )}
                </td>
                {roleID === "2" && (
                  <td>
                    {editedRows[row.recordID] ? (
                      <div className="table-actions">
                        <Button
                          className="action-button save-button"
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveEdit(row.recordID)}
                        >
                          Save
                        </Button>
                        <Button
                          className="action-button cancel-button"
                          variant="contained"
                          color="secondary"
                          onClick={() => handleCancelEdit(row.recordID)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="table-actions">
                        <Button
                          className="action-button edit-button2"
                          variant="contained"
                          color="secondary"
                          onClick={() => handleEditRow(row)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="action-button delete-button"
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteRow(row.recordID)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {emptyRows > 0 && (
              <tr style={{ height: 41 * emptyRows }}>
                <td colSpan={7} aria-hidden />
              </tr>
            )}
          </tbody>
        </table>
      </Root>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
        itemName="Pet Health Record"
      />
    </div>
  );
};

const Root = styled("div")({
  // Styles for the Root component
});

export default PetHealthRecord;
