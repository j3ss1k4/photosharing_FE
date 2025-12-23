import { React, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import "./styles.css";
import { handleData } from "../../modelData/api";
import { API } from "../../App.js";

export function Login({ onLogin }) {
  const [loginName, setLoginName] = useState("");
  const [passwd, setPasswd] = useState("");
  // const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    const data = { login_name: loginName, passwd: passwd };
    handleData(API + "/api/admin/login", "POST", data)
      .then((data) => {
        console.log("Login Response:", data);
        // console.log("token", token);
        if (data.token) {
          localStorage.setItem("token", data.token);
        } else {
          console.error("Warning: No token received from server");
        }
        onLogin(data.user);
        navigate("/");
      })
      .catch((e) => alert("Login failed: " + e));
  }
  return (
    <div>
      <h2>Login Page</h2>
      <p></p>
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Username:
          <input
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input value={passwd} onChange={(e) => setPasswd(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export function Logout({ onLogout }) {
  const navigate = useNavigate();
  useEffect(() => {
    onLogout("");
    localStorage.removeItem("token");
    navigate("/login");
  }, []);
  return null;
}

export function Register() {
  const [info, setInfo] = useState({
    login_name: "",
    passwd: "",
    retype_password: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  function checkPasswordMatch() {
    return info.passwd === info.retype_password;
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!checkPasswordMatch()) {
      alert("Password do not match");
      return;
    }
    const { retype_password, ...payload } = info;
    handleData(API + "/api/admin/register", "POST", payload)
      .then((data) => alert("Registration succesful! Please log in."))
      .catch((err) => alert("Registration failed: " + err.message));
  }

  return (
    <div>
      <h2>Register Page</h2>
      <p>Registration functionality</p>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="login_name"
            onChange={(e) => setInfo({ ...info, login_name: e.target.value })}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="passwd"
            onChange={(e) => setInfo({ ...info, passwd: e.target.value })}
          />
        </label>
        <br />
        <label>
          Retype - Password:
          <input
            type="password"
            name="retype_password"
            onChange={(e) =>
              setInfo({ ...info, retype_password: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          First name:
          <input
            type="text"
            name="first_name"
            onChange={(e) => setInfo({ ...info, first_name: e.target.value })}
          />
        </label>
        <br />
        <label>
          Last name:
          <input
            type="text"
            name="last_name"
            onChange={(e) => setInfo({ ...info, last_name: e.target.value })}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            onChange={(e) => setInfo({ ...info, location: e.target.value })}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            type="text"
            name="description"
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
          />
        </label>
        <br />
        <label>
          Occupation:
          <input
            type="text"
            name="occupation"
            onChange={(e) => setInfo({ ...info, occupation: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Register Me</button>
      </form>
    </div>
  );
}
