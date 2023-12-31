import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import moment from "moment";
import { default as React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../table/Table.css";
import { Switch } from "@mui/material";
import CreateQuiz from "../../createQuiz/CreateQuiz";

function Table() {
  // State variables for handling dialog and quiz list
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [keys, setKeys] = useState([]);
  const [currentKey, setCurrentKey] = useState("");
  const [inactiveQuizs, setInactiveQuizs] = useState([]);
  const [edit, setEdit] = useState("");

  // Function to handle status change (active/inactive)
  const handleStatusChange = (checked, key) => {
    if (!checked) {
      setInactiveQuizs([...inactiveQuizs, key]);
    } else {
      setInactiveQuizs([...inactiveQuizs.filter((q) => q !== key)]);
    }
  };

  // React Router navigate hook
  const navigate = useNavigate();

  // Function to navigate to play quiz page
  const playQuiz = (params) => {
    navigate(`/play-quiz/${params}`);
    setCurrentKey(params);
  };

  // Function to handle opening dialog for deleting a quiz
  const handleClickOpen = (params) => {
    setCurrentKey(params);
    setOpen(true);
  };

  // Function to close the delete confirmation dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Function to delete a quiz
  const deleteQuiz = () => {
    if (currentKey.length > 0) localStorage.removeItem(currentKey);
    setKeys(Object.keys(localStorage));
    setOpen(false);
  };

  // Effect hook to initialize quiz keys
  useEffect(() => {
    const keys = Object.keys(localStorage);
    setKeys(keys);
  }, []);

  // JSX code for rendering the table
  return (
    <div className="table-layout">
      <table>
        <thead>
          <tr>
            <th>Quiz No</th>
            <th>Title</th>
            <th>Quiz Type</th>
            <th>Status</th>
            <th>Created On </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keys.length > 0
            ? keys.map((key, index) => {
                const storedData = JSON.parse(localStorage.getItem(key));
                console.log(storedData);
                if (storedData) {
                  return (
                    <tr key={index}>
                      <td>{index + 1} . </td>
                      <td>{storedData?.title || "-"}</td>
                      <td>{storedData.questionType}</td>
                      <td>
                        <span>
                          {inactiveQuizs.includes(key) ? "Inactive" : "Active"}
                        </span>
                        <Switch
                          defaultChecked={storedData.active}
                          color="success"
                          onChange={(e) =>
                            handleStatusChange(e.target.checked, key)
                          }
                        />
                      </td>
                      <td>{moment(storedData.date).format("lll")}</td>
                      <td>
                        <div className="action-style">
                          <PlayArrowIcon
                            className={`action-btn ${
                              inactiveQuizs.includes(key) && "disabled"
                            }`}
                            onClick={() =>
                              !inactiveQuizs.includes(key) && playQuiz(key)
                            }
                            titleAccess="Play Quiz"
                          />
                          <EditIcon
                            className="action-btn"
                            titleAccess="Edit"
                            onClick={() => setEdit(key)}
                          />
                          <DeleteIcon
                            onClick={() => handleClickOpen(key)}
                            className="action-btn"
                            titleAccess="Delete"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={index}>
                      <td>No Data Found</td>
                    </tr>
                  );
                }
              })
            : "No Data Found"}
        </tbody>
      </table>
      {/* Delete confirmation dialog */}
      <div>
        <Dialog
          open={open}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Are you sure you want to Delete"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Deleting this this will result in losing the file permanently and
              is not recoverable
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => deleteQuiz()}
              color="error"
              variant="contained"
            >
              Yes
            </Button>
            <Button onClick={handleClose} color="error" variant="contained">
              No
            </Button>
          </DialogActions>
        </Dialog>

        {edit && (
          <Dialog
            open
            onClose={() => setEdit("")}
            className="editDialog"
            maxWidth="false"
          >
            <DialogContent>
              <CreateQuiz prefilled preFilledQuestion={edit} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default Table;
