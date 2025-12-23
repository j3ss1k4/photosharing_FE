import React, { useState, useEffect } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,Button
} from "@mui/material";
import { getData, handleData } from "../../modelData/api";
import "./styles.css";
import { Navigate, useNavigate, Link, useParams } from "react-router-dom";
import { API } from "../../App.js";

/**
 * Define UserDetail, a React component of Project 4.
 */
export function UserDetail() {
  const user = useParams();
  const [userDetail, setUserDetail] = useState([]);
  const [status, setStatus] = useState("Loading ...");
  const navigate = useNavigate();

  useEffect(() => {
    setStatus("Loading ...");
    getData(API + "/api/users/" + user.userId)
      .then((data) => {
        setUserDetail(data);
        setStatus("OK");
      })
      .catch((err) => {
        console.log(err);
        setStatus("Error");
        navigate("/login");
      });
  }, [user]);

  return (
    <>
      <Typography variant="body1">
        This should be the UserDetail view of the PhotoShare app. Since it is
        invoked from React Router the params from the route will be in property
        match. So this should show details of user: {user.userId}. You can fetch
        the model for the user from models.userModel.
        <Divider />
        {status == "OK" ? (
          <div>
            First name: {userDetail.first_name}
            <br />
            Last name: {userDetail.last_name}
            <br />
            Location: {userDetail.location}
            <br />
            Description: {userDetail.description}
            <br />
            Occupation: {userDetail.occupation}
            <br />
            <br />
            Occupation: {user.userId}
            <br />
            <Link to={"../photos/" + user.userId}>My PhotoShare</Link>
            <Button><Link to={"/edit/"+user.userId}>Edit</Link></Button>
          </div>
          
        ) : (
          status
        )}
         

      </Typography>
    </>
  );
}

export function Me({ setUser }) {
  const [info, setInfo] = useState({});
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    handleData(API + "/api/users/update/me", "POST", info)
      .then((data) => {
        setInfo(data);
        console.log(info);
        alert("Update successful");
        navigate("/users");
      })
      .catch((e) => {
        setInfo(null);
        console.log(e);
        alert("Update failed" + e.message);
      });
  }
  function handleDelete() {
    // Kiểm tra xem đã có thông tin user (đặc biệt là ID) chưa
    if (!info || !info._id) {
      alert("User information not loaded yet.");
      return;
    }

    // Hỏi xác nhận trước khi xóa
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      // Gọi API: DELETE /api/users/:id
      handleData(API + "/api/users/" + info._id, "DELETE")
        .then((data) => {
          console.log("Delete response:", data);
          alert("Delete successful");

          // Cập nhật state ở App.js (để UI biết là đã logout)
          if (setUser) setUser(null);

          // Chuyển hướng về trang logout như yêu cầu
          navigate("/logout");
        })
        .catch((err) => {
          console.error(err);
          alert("Delete failed: " + (err.message || "Unknown error"));
        });
    }
  }
  useEffect(() => {
    getData(API + "/api/users/about/me")
      .then((data) => {
        setInfo(data);
        console.log(info);
      })
      .catch((e) => {
        setInfo(null);
        console.log(e);
      });
  }, []);

  return (
    <div>
      <h2>About me</h2>
      <p>View your details.</p>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="login_name"
            onChange={(e) => setInfo({ ...info, login_name: e.target.value })}
            value={info?.login_name || ""}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="login_pass"
            onChange={(e) => setInfo({ ...info, login_pass: e.target.value })}
            value={info?.login_pass || ""}
          />
        </label>
        <br />
        <label>
          First name:
          <input
            type="text"
            name="first_name"
            onChange={(e) => setInfo({ ...info, first_name: e.target.value })}
            value={info?.first_name || ""}
          />
        </label>
        <br />
        <label>
          Last name:
          <input
            type="text"
            name="last_name"
            onChange={(e) => setInfo({ ...info, last_name: e.target.value })}
            value={info?.last_name || ""}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            onChange={(e) => setInfo({ ...info, location: e.target.value })}
            value={info?.location || ""}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            type="text"
            name="description"
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
            value={info?.description || ""}
          />
        </label>
        <br />
        <label>
          Occupation:
          <input
            type="text"
            name="occupation"
            onChange={(e) => setInfo({ ...info, occupation: e.target.value })}
            value={info?.occupation || ""}
          />
        </label>
        <br />
        <button type="submit">Update me</button>
        <button
          type="button"
          onClick={handleDelete}
          style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
        >
          Delete User
        </button>
      </form>
    </div>
  );
}

export function Detail(){
  const userId = useParams().userId;
  const [info, setInfo] = useState({});
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    handleData(API + "/api/users/edit/" + userId, "POST", info)
      .then((data) => {
        setInfo(data);
        console.log(info);
        alert("Update successful");
        navigate("/users");
      })
      .catch((e) => {
        setInfo(null);
        console.log(e);
        alert("Update failed" + e.message);
      });
  }

  useEffect(() => {
    getData(API + "/api/users/"+ userId)
      .then((data) => { 
        setInfo(data); 
        console.log(data); 
      })
      .catch((err) => { 
        setInfo(null); 
        console.log(err); 
      });
  }, []);

  return (
    <div>
      <h2>Edit </h2>
      <p>View your details.</p>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="login_name"
            onChange={(e) => setInfo({ ...info, login_name: e.target.value })}
            value={info?.login_name || ""}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="login_pass"
            onChange={(e) => setInfo({ ...info, login_pass: e.target.value })}
            value={info?.login_pass || ""}
          />
        </label>
        <br />
        <label>
          First name:
          <input
            type="text"
            name="first_name"
            onChange={(e) => setInfo({ ...info, first_name: e.target.value })}
            value={info?.first_name || ""}
          />
        </label>
        <br />
        <label>
          Last name:
          <input
            type="text"
            name="last_name"
            onChange={(e) => setInfo({ ...info, last_name: e.target.value })}
            value={info?.last_name || ""}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            onChange={(e) => setInfo({ ...info, location: e.target.value })}
            value={info?.location || ""}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            type="text"
            name="description"
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
            value={info?.description || ""}
          />
        </label>
        <br />
        <label>
          Occupation:
          <input
            type="text"
            name="occupation"
            onChange={(e) => setInfo({ ...info, occupation: e.target.value })}
            value={info?.occupation || ""}
          />
        </label>
        <br />
        <button type="submit">Update me</button>
        {/* <button
          type="button"
          onClick={handleDelete}
          style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
        >
          Delete User
        </button> */}
      </form>
    </div>
  );
}