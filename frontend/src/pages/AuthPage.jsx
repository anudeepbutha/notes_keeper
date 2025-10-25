import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '../App/slices/authSlice';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Tab buttons */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 text-center font-semibold transition ${
              isSignIn
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 text-center font-semibold transition ${
              !isSignIn
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Show either Signin or Signup */}
        {isSignIn ? <SigninForm /> : <SignupForm />}
      </div>
    </div>
  );
}

// Inline Signin Form
function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const API_BASE = "http://localhost:5001";
    try {
      const response = await fetch(`${API_BASE}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setAuth({ token: data.token, user: { email } }));
        navigate('/');
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to sign in');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter your password"
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Sign In
      </button>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </form>
  );
}

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const API_BASE = "http://localhost:5001";
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        setPassword('');
      } else {
        const errData = await response.json();
        setError(errData.message || 'Failed to sign up');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="Enter your password"
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Sign Up
      </button>
      {success && (
        <p className="text-green-500 text-sm text-center mt-2">
          Account created successfully! Please sign in.
        </p>
      )}
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </form>
  );
}