import { React, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./styles.css";
import { handleData } from "../../modelData/api";
import { API } from "../../App.js";

export default function FileUpload({ user }) {
  const navigate = useNavigate();

  function handleAddPhoto() {
    const photoInput = document.getElementById("photo");
    const photoFile = photoInput.files[0];
    if (photoFile) {
      const formData = new FormData();
      formData.append("photo", photoFile);
      fetch(`${API}/api/photo/new`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token") || "",
        },
      })
        .then((res) => {
          if (res.ok) {
            alert("Photo uploaded successfully!");
            navigate("/photos/" + user._id);
          } else {
            alert("Upload failed by Server");
          }
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
          alert("Failed to upload photo.");
        });
    }
  }

  return (
    <div>
      <h1>Upload photo</h1>
      <input type="file" id="photo" required />
      <button onClick={handleAddPhoto}>Add Photo</button>
    </div>
  );
}
