import React, { useState, useEffect, use } from "react";
import { getData, handleData } from "../../modelData/api";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip
} from "@mui/material";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { API } from "../../App.js";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    getData(API + "/api/users")
      .then((data) => {
        setUsers(data);
        setStatus("OK");
      })
      .catch((err) => {
        alert(err);
        setStatus("Error loading user list");
      });
  }, []);

  return (
    <div className="user-list-container">
      <div className="user-list-title">
        Users List
      </div>
      
      <ul className="user-list">
        {users.map((item) => (
          <li key={item._id} className="user-item">
            <Link to={"/users/" + item._id} className="user-name-link">
              {item.first_name} {item.last_name}
            </Link>
  
            <div className="user-badges">
              
              <Link 
                to={"/photos/" + item._id} 
                className="badge badge-photos"
              >
                 {item.photo_count || 0}
              </Link>
  
              <Link 
                to={"/comments/" + item._id} 
                className="badge badge-comments"
              >
                 {item.comment_count || 0}
              </Link>
              
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
