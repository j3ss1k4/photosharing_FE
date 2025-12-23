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

/**
 * Define UserList, a React component of Project 4.
 */
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
        // navigate("/login");
      });
  }, []);

  return (
    <div>
      <Typography variant="body1" style={{ padding: "10px", fontWeight: "bold" }}>
        Users List
      </Typography>
      
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem 
              alignItems="center"
              // Sử dụng flex-wrap để nếu tên dài quá thì bong bóng xuống dòng
              style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '5px' }}
            >
              {/* 1. Tên User */}
              <Link 
                to={"/users/" + item._id} 
                style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1, minWidth: '100px' }}
              >
                <ListItemText primary={item.first_name + " " + item.last_name} />
              </Link>

              {/* Khu vực hiển thị 2 bong bóng (Dạng Text) */}
              <div style={{ display: 'flex', gap: '5px' }}>
                
                {/* 2. Bong bóng Xanh (Photos) - Dạng Text */}
                <Link to={"/photos/" + item._id} style={{ textDecoration: 'none' }}>
                    <Chip
                        // Thay icon bằng text trực tiếp trong label
                        label={`Photos: ${item.photo_count || 0}`}
                        color="success" // Màu xanh lá
                        size="small"
                        clickable
                        variant="filled"
                        style={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                    />
                </Link>

                {/* 3. Bong bóng Đỏ (Comments) - Dạng Text */}
                <Link to={"/comments/" + item._id} style={{ textDecoration: 'none' }}>
                    <Chip
                        // Thay icon bằng text (Cmts là viết tắt của Comments)
                        label={`Cmts: ${item.comment_count || 0}`}
                        color="error" // Màu đỏ
                        size="small"
                        clickable
                        variant="filled"
                        style={{ fontSize: '0.75rem', fontWeight: 'bold' }}
                    />
                </Link>

              </div>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
