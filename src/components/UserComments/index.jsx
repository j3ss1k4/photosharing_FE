import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Button,
  Alert,
} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getData } from "../../modelData/api.js";
import { API } from "../../App.js";
// import "./styles.css";

// Hàm format ngày tháng cho đẹp
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function UserComments() {
  const { userId } = useParams(); // Lấy ID của user cần xem comment
  const navigate = useNavigate();
  
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("Loading...");

  // --- 1. Gọi API lấy danh sách comment ---
  useEffect(() => {
    // Giả sử bạn đã tạo API này ở Backend (như hướng dẫn trước)
    // Endpoint: /api/commentsOfUser/:userId
    getData(`${API}/api/comment/commentsOfUser/${userId}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setComments(data);
          setStatus("OK");
        } else {
          setComments([]);
          setStatus("No comments found");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("Error loading comments");
      });
  }, [userId]);

  // --- 2. Xử lý khi click vào Comment ---
  const handleCommentClick = (photoOwnerId, photoId) => {
    // Chuyển hướng đến trang xem ảnh chi tiết
    // URL: /photos/{id_người_đăng_ảnh}/{id_bức_ảnh}
    // Điều này tận dụng tính năng Deep Linking/Stepper của bài Extra Credit
    navigate(`/photos/${photoOwnerId}/${photoId}`);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Nút Quay lại - Đã thay icon bằng text và thêm style button */}
      <Button
        variant="contained" // Thêm variant để nút nổi bật hơn (có nền xanh)
        color="primary"     // Màu sắc chủ đạo
        onClick={() => navigate(-1)}
        style={{ marginBottom: "20px" }}
      >
        Back
      </Button>

      <Typography variant="h4" gutterBottom>
        User Comments History
      </Typography>

      <Paper elevation={3} style={{ padding: "10px" }}>
        {status !== "OK" ? (
          <Typography variant="body1" style={{ padding: "20px" }}>
            {status}
          </Typography>
        ) : comments.length === 0 ? (
          <Alert severity="info">This user has not commented on any photos.</Alert>
        ) : (
          <List>
            {comments.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  alignItems="flex-start"
                  button // Làm cho dòng này có thể click được
                  onClick={() => handleCommentClick(item.photo_owner_id, item.photo_id)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Thumbnail của bức ảnh */}
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={`${API}/api/photo/images/${item.file_name}`}
                      alt="Photo thumbnail"
                      sx={{ width: 60, height: 60, marginRight: 2 }}
                    />
                  </ListItemAvatar>

                  {/* Nội dung comment */}
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold", color: "#1976d2" }}
                      >
                        "{item.comment}"
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          on photo: {item.file_name}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(item.date_time)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
}

export default UserComments;