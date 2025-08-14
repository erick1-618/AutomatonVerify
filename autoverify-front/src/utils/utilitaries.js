import { jwtDecode } from "jwt-decode"

function checkToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token)
    const now = Date.now() / 1000; // tempo atual em segundos
    if (decoded.exp < now) {
      // token expirou
      localStorage.removeItem("token")
      return false;
    }
    return true;
  } catch (error) {
    // token inválido
    return false;
  }
}

function getUserName(token){
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode(token)
      const username = decoded.sub;
      return username;
    } catch (err) {;
      return null;
    }
}

export {checkToken, getUserName}