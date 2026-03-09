import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  const checkUserLoggedIn = async () => {
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkUserLoggedIn();
    // eslint-disable-next-line
  }, [token]);

  // Login User
  const loginUser = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      toast.success('Login successful!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
      return false;
    }
  };

  // Register User
  const registerUser = async (name, email, password, phone, wellnessGoal, experienceLevel, preferredTime, dietPreference, timeAvailable) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone, wellnessGoal, experienceLevel, preferredTime, dietPreference, timeAvailable });
      setUser(data);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
      return false;
    }
  };

  // Logout
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
