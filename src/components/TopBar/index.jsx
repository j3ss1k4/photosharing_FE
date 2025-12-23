import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import { getData, handleData } from "../../modelData/api.js";
import { API } from "../../App.js";
import { FormControlLabel, Checkbox } from "@mui/material";

import "./styles.css";
/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar({ state, advancedFeatures, toggleAdvancedFeatures }) {
  const location = useLocation();
  const [contextText, setContextText] = useState("");

  async function upadateContextText() {
    const loca = location.pathname.split("/");
    if (loca.length < 3) return;

    const data = loca[1];
    const params = loca[2];
    const path = API + "/api/users/" + params;
    try {
      if (data === "users") {
        setContextText(
          `Detail of User: ${state.first_name} ${state.last_name} `
        );
      } else if (data === "photos") {
        setContextText(`Photos of: ${state.first_name} ${state.last_name}`);
      } else {
        setContextText("");
      }
    } catch (error) {
      console.log("Error fetch user:", error);
    }
  }

  useEffect(() => {
    setContextText("");
    upadateContextText();
    console.log("state" + state);
  }, []);

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" color="inherit">
          <Link to="/users">{"Đỗ Thanh Thảo"}</Link>
        </Typography>

        <Typography variant="h6" color="inherit">
          {contextText}
        </Typography>

        <Typography variant="h6" color="inherit">
          {!state || !state._id ? (
            <div>
              <Link to="/login"> Login </Link>
              <Link to="/register"> Register</Link>
            </div>
          ) : (
            <div>
              <Typography variant="h6" color="inherit">
                {/* <Link to="/me">{"Hi: " + state.first_name + "   "}</Link> */}
                 {/* <div>{"Hi: " + state.first_name + "   "}</div> */}
                <Link to="/addphoto"> Add Photo </Link>
                <Link to="/logout"> Logout</Link>
              </Typography>
            </div>
          )}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={advancedFeatures}
              onChange={toggleAdvancedFeatures}
              color="default" // Hoặc màu trắng cho nổi bật trên thanh xanh
            />
          }
          label="Enable Advanced Features"
        />
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
