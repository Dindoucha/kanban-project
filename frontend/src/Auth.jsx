import { createContext, useState,useEffect } from "react";
import { showToast } from "./components/Toast";
import apiFetch from "./api";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = localStorage.getItem("authToken");
  const ping = async() =>{
    try{
      await apiFetch('/ping', 'GET', null,token);
      setIsAuthenticated(true)
    } catch (err) {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false)
    }
  }
  useEffect(() =>{ ping()} ,[])
  
  const login = async (email, password) => {
    try {
      const data = await apiFetch('/login', 'POST', { email, password });
      const token = data.token;
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout =async () => {
    try {
      const token = localStorage.getItem("authToken");
      await apiFetch('/logout', 'POST', null, token);
      showToast("success", "You have been successfully signed out.");
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    }
   };

 return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
 );
};
export default AuthProvider