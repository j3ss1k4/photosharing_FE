async function getData(url) {
  try {
    // Chuẩn bị Header
    const headers = {};
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    // Xử lý lỗi HTTP (404, 500, 401...)
    if (!res.ok) {
      // Cố gắng đọc lỗi từ server trả về (text hoặc json)
      const errorText = await res.text();
      throw new Error(errorText || `HTTP Error ${res.status}`);
    }

    // Trả về JSON
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getData Error: ", error);
    throw error; // QUAN TRỌNG: Phải ném lỗi để component biết mà xử lý
  }
}

/**
 * Hàm gửi dữ liệu (POST, PUT, DELETE...)
 */
async function handleData(url, method = "POST", data) {
  try {
    // Chuẩn bị Header
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
    });

    // Xử lý lỗi HTTP
    if (!res.ok) {
      // SỬA LỖI: res.text() trả về Promise, cần await
      const errorText = await res.text();

      // Thử parse xem lỗi có phải JSON không (backend thường trả về {message: "..."})
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(
          errorJson.message || errorJson || `HTTP Error ${res.status}`
        );
      } catch (e) {
        // Nếu không phải JSON thì dùng text thô
        throw new Error(errorText || `HTTP Error ${res.status}`);
      }
    }

    // Nếu thành công trả về JSON
    const results = await res.json();
    return results;
  } catch (error) {
    console.error("handleData Error: ", error);
    // SỬA LỖI QUAN TRỌNG NHẤT:
    // Phải throw error để bên Login nhận được và nhảy vào .catch()
    throw error;
  }
}

export { getData, handleData };
