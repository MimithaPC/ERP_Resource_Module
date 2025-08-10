import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationProps {
  onRegister: (email: string, password: string) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Simulate successful registration
    setError('');
    alert('Registration successful!');
    onRegister(email, password); // <-- pass email and password
    navigate('/login');
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="h-screen bg-gray-300 flex justify-center items-center">
      <form
        onSubmit={handleRegister}
        className="bg-gray-700 p-10 rounded-2xl w-[500px] shadow-xl"
      >
        <h1 className="text-white text-4xl font-bold text-center mb-8">
          Register
        </h1>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <div className="text-white mb-6">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-600 rounded"
            required
          />
        </div>

        <div className="text-white mb-8">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-600 rounded"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-2xl"
          >
            Register
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-2xl"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
