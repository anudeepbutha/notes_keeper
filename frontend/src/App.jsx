import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setAuth, clearAuth } from './App/slices/authSlice';

import AuthPage from './pages/AuthPage';
import TodoPage from './pages/Home';

export default function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('http://localhost:5001/verify', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setAuth({ 
            token: data.token, 
            user: data.user 
          }));
        } else {
          dispatch(clearAuth());
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        dispatch(clearAuth());
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [dispatch]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        {token ? (
          <>
            <Route path="/" element={<TodoPage />} />
          </>
        ) : (
          <>
            <Route path="/" element={<AuthPage />} />
          </>
        )}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}