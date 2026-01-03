import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    window.location.href = "/";
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    window.location.href = "/";
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const switchRole = async (role) => {
    const { data } = await api.post("/users/switch-role", { role });
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    window.location.href = "/";
  };

  const becomeAdmin = async () => {
    const { data } = await api.post("/users/become-admin");
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    window.location.href = "/seller";
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, switchRole, becomeAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
