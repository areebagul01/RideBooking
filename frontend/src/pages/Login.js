/** @jsxImportSource @emotion/react */
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <div
        className="w-full min-h-[calc(100vh-64px)] flex items-center bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("/background.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Left: Login form */}
        <div className="w-full md:w-1/2 z-10 flex justify-center items-center">
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-md max-w-md w-full p-6 m-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 text-white py-2 rounded  hover:bg-yellow-700 transition"
              >
                Login
              </button>

              <div className="text-center mt-4">
                <p>
                  Don&apos;t have an account?
                  <a href="/register" className="text-blue-600 ml-1 hover:underline">
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right text */}
        <div className="hidden md:flex w-1/2 z-10 justify-center items-center p-10">
          <div className="text-white text-right space-y-4 drop-shadow-md">
            <h2 className="text-5xl font-bold">Book Your Ride Instantly</h2>
            <p className="text-lg">
              Fast, reliable, and affordable rides at your fingertips.
              Join thousands of happy riders today!
            </p>
            <p className="text-sm italic">
              Your journey starts here — anywhere, anytime.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
