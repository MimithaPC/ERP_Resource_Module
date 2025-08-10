import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 New state

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long, include at least one number and one special character.');
      return;
    }

    setError('');
    onLogin(email, password);
    navigate('/');
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false); // 👈 Reset password visibility too
  };

  return (
    <div className='h-screen bg-gray-300 flex justify-center items-center'>
      <form
        onSubmit={handleLogin}
        className='bg-gray-700 p-10 rounded-2xl w-[500px] shadow-xl'
      >
        <h1 className='text-white text-4xl font-bold text-center mb-8'>Login</h1>

        {error && (
          <div className='text-red-400 text-center mb-4'>{error}</div>
        )}

        <div className='text-white mb-6'>
          <label className='block mb-2'>Email:</label>
          <input
            className='w-full px-4 py-2 bg-gray-600 rounded'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className='text-white mb-2'>
          <label className='block mb-2'>Password:</label>
          <input
            className='w-full px-4 py-2 bg-gray-600 rounded'
            type={showPassword ? 'text' : 'password'} // 👈 Toggle input type
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className='text-white mb-6'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              className='mr-2'
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>
        </div>

        <div className='flex justify-between mb-6'>
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl'
          >
            Sign In
          </button>

          <button
            type='button'
            onClick={handleReset}
            className='bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-2xl'
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
