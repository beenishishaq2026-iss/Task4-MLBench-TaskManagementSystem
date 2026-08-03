import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            const res = await API.post('/auth/login', data);
            const { user, token } = res.data.data;
            login(user, token);
            navigate('/dashboard');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-purple-100 flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-lime-400 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute top-1/4 -right-10 w-56 h-56 bg-amber-300 rounded-full opacity-40 blur-2xl"></div>
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-400 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-48 h-48 bg-red-400 rounded-full opacity-30 blur-2xl"></div>

            <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border-2 border-indigo-700/30">
                <h2 className="text-3xl font-extrabold text-indigo-950 mb-1">Welcome back</h2>
                <p className="text-gray-500 text-sm mb-6">Log in to keep your tasks on track</p>

                {serverError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-4">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-indigo-950 mb-1 block">Email</label>
                        <input
                            {...register('email', { required: 'Email is required' })}
                            type="email"
                            className="w-full bg-violet-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-indigo-950 placeholder-gray-400 focus:outline-none focus:border-indigo-700 transition"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-indigo-950 mb-1 block">Password</label>
                        <input
                            {...register('password', { required: 'Password is required' })}
                            type="password"
                            className="w-full bg-violet-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-indigo-950 placeholder-gray-400 focus:outline-none focus:border-indigo-700 transition"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-700 text-white font-semibold rounded-xl py-3 mt-2 hover:bg-indigo-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="text-gray-500 text-sm text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-700 font-semibold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;