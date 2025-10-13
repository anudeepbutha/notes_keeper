import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AuthPage from './pages/AuthPage';
import TodoPage from './pages/Home';

export default function App() {
  const { token } = useSelector((state) => state.auth);

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