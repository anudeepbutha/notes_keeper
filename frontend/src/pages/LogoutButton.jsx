import { useDispatch } from 'react-redux';
// Adjust the path to your authSlice file
import { clearAuth } from '../App/slices/authSlice'; 

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // 1. Call the /logout endpoint
      // The PDF table specifies this is a POST request [cite: 44]
      const response = await fetch('/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        // Even if server fails, we log out the client
        console.error('Server logout failed');
      }

    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // 2. Always clear Redux authSlice
      // This will clear the token and user from the client state 
      dispatch(clearAuth());
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout 🚪
    </button>
  );
};

export default LogoutButton;