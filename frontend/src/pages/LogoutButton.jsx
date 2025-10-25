import { useDispatch } from 'react-redux';
import { clearAuth } from '../App/slices/authSlice'; 

const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('Server logout failed');
      }

    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
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