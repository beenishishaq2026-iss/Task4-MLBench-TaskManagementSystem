import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const statusColors = {
    Pending: 'bg-blue-200 text-indigo-950',
    'In Progress': 'bg-violet-400 text-white',
    Completed: 'bg-lime-400 text-indigo-950',
};

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, tasksRes] = await Promise.all([
                    API.get('/tasks/dashboard/stats'),
                    API.get('/tasks', { params: { limit: 5, sort: '-createdAt' } }),
                ]);
                setStats(statsRes.data.data);
                setRecentTasks(tasksRes.data.data);
            } catch (err) {
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (error) return <div className="min-h-screen bg-purple-100 flex items-center justify-center text-red-500">{error}</div>;

    const cards = loading ? [] : [
        { label: 'Total Tasks', value: stats.totalTasks, bg: 'bg-lime-400', text: 'text-indigo-950' },
        { label: 'Pending', value: stats.pendingTasks, bg: 'bg-amber-300', text: 'text-indigo-950' },
        { label: 'In Progress', value: stats.inProgressTasks, bg: 'bg-violet-400', text: 'text-indigo-950' },
        { label: 'Completed', value: stats.completedTasks, bg: 'bg-emerald-300', text: 'text-indigo-950' },
        { label: 'Due Today', value: stats.tasksDueToday, bg: 'bg-red-400', text: 'text-indigo-950' },
    ];

    return (
        <div className="min-h-screen w-full bg-purple-100 px-4 sm:px-6 py-8 relative overflow-x-hidden overflow-y-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-lime-400 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute top-1/4 -right-10 w-56 h-56 bg-amber-300 rounded-full opacity-40 blur-2xl"></div>
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-400 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-48 h-48 bg-red-400 rounded-full opacity-30 blur-2xl"></div>

            <div className="max-w-6xl mx-auto relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-indigo-950">Hello, {user?.name}</h1>
                        <p className="text-gray-500 text-sm mt-1">Here's what's on your plate today</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link
                            to="/tasks"
                            className="flex-1 sm:flex-none text-center bg-white text-indigo-950 font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition text-sm border-2 border-indigo-700/30"
                        >
                            View Tasks
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex-1 sm:flex-none bg-white text-indigo-950 font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition text-sm border-2 border-indigo-950/30"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin"></div>
                    </div>
                ) : (
                <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {cards.map((card) => (
                        <div
                            key={card.label}
                            className={`rounded-3xl p-6 shadow-md border-2 border-indigo-700/20 flex flex-col justify-center min-h-[110px] ${card.bg}`}
                        >
                            <p className={`text-3xl font-extrabold leading-none ${card.text}`}>{card.value}</p>
                            <p className={`text-sm mt-2 font-medium leading-tight ${card.text}`}>{card.label}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-indigo-700/30">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-indigo-950">Recent Tasks</h2>
                        <Link to="/tasks" className="text-sm font-semibold text-indigo-700 hover:underline">
                            View All
                        </Link>
                    </div>

                    {recentTasks.length === 0 ? (
                        <p className="text-gray-400 text-sm py-6 text-center">
                            No tasks yet. <Link to="/tasks/new" className="text-indigo-700 font-semibold hover:underline">Create your first task</Link>.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {recentTasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="flex items-center justify-between bg-violet-50 rounded-xl px-4 py-3"
                                >
                                    <div>
                                        <p className="font-semibold text-indigo-950">{task.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full w-24 text-center shrink-0 ${statusColors[task.status]}`}>
                                        {task.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;