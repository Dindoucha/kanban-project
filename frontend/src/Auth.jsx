// AuthContext.js
import { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);

 // Function to log in and set authentication state
  const login = async (email, password) => {
    const response = await fetch('http://your-laravel-api.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return errorData
    }

    const data = await response.json();
    const token = data.token;

    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  }

 // Function to log out and clear authentication state
 const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
 };

 return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
 );
};
export default AuthProvider