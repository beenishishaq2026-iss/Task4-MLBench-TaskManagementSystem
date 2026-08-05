import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTasks, deleteTask } from '../api/tasks';
import { useAuth } from '../context/AuthContext';

const priorityColors = {
    High: 'bg-red-400 text-white',
    Medium: 'bg-amber-300 text-indigo-950',
    Low: 'bg-pink-400 text-indigo-950',
};

const statusColors = {
    Pending: 'bg-blue-200 text-gray-700',
    'In Progress': 'bg-violet-400 text-white',
    Completed: 'bg-emerald-300 text-indigo-950',
};

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [page, setPage] = useState(1);
    const limit = 6;

    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getTasks({ search, status, priority, sort, page, limit });
            setTasks(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            setSearch(searchInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        fetchTasks();
    }, [search, status, priority, sort, page]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteTask(id);
            fetchTasks();
        } catch (err) {
            alert('Failed to delete task');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-purple-100 px-4 sm:px-6 py-6 sm:py-8 relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-lime-400 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute top-1/4 -right-10 w-56 h-56 bg-amber-300 rounded-full opacity-40 blur-2xl"></div>
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-400 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-48 h-48 bg-red-400 rounded-full opacity-30 blur-2xl"></div>

            <div className="max-w-6xl mx-auto relative">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950">Your Tasks</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage and track everything in one place</p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Link
                            to="/dashboard"
                            className="flex-1 sm:flex-none text-center bg-red-400 text-black font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md hover:shadow-lg transition text-xs sm:text-sm border-2 border-indigo-700/30"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/tasks/new"
                            className="flex-1 sm:flex-none text-center bg-lime-400 text-black font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-lime-300 transition text-xs sm:text-sm shadow-md border-2 border-indigo-700/30"
                        >
                            + New Task
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex-1 sm:flex-none bg-indigo-300 text-black font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl hover:bg-indigo-400 transition text-xs sm:text-sm shadow-md border-2 border-indigo-700/30"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-300 rounded-2xl p-3 sm:p-4 shadow-md mb-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center border-2 border-indigo-800/30">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full sm:flex-1 sm:min-w-[180px] bg-violet-50 border-2 border-transparent rounded-lg px-4 py-2 text-black font-medium placeholder-gray-500 focus:outline-none focus:border-indigo-700"
                    />

                    <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
                        <select
                            value={status}
                            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
                            className="w-full sm:w-auto bg-violet-50 rounded-lg px-3 py-2 text-black font-medium focus:outline-none text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <select
                            value={priority}
                            onChange={(e) => { setPage(1); setPriority(e.target.value); }}
                            className="w-full sm:w-auto bg-violet-50 rounded-lg px-3 py-2 text-black font-medium focus:outline-none text-sm"
                        >
                            <option value="">All Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                        <select
                            value={sort}
                            onChange={(e) => { setPage(1); setSort(e.target.value); }}
                            className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-violet-50 rounded-lg px-3 py-2 text-black font-medium focus:outline-none text-sm"
                        >
                            <option value="-createdAt">Newest First</option>
                            <option value="createdAt">Oldest First</option>
                            <option value="dueDate">Due Date Earliest</option>
                            <option value="-dueDate">Due Date Latest</option>
                            <option value="priority">Priority Low to High</option>
                            <option value="-priority">Priority High to Low</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : tasks.length === 0 ? (
                    <div className="bg-red-200 rounded-2xl p-8 sm:p-10 text-center text-gray-400 shadow-md border-2 border-indigo-700/30">
                        No tasks found. Create your first task!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tasks.map((task) => (
                            <div key={task._id} className="bg-red-100 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition border-2 border-indigo-900/30 hover:border-indigo-700/60">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-indigo-950 text-base sm:text-lg break-words">{task.title}</h3>
                                </div>
                                {task.description && (
                                    <p className="text-indigo-950 font-normal text-left text-sm mb-3 line-clamp-2 break-words">
                                        {task.description}
                                    </p>
                                )}
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full w-auto min-w-[5.5rem] text-center shrink-0 ${priorityColors[task.priority]}`}>
                                        {task.priority}
                                    </span>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full w-auto min-w-[5.5rem] text-center shrink-0 ${statusColors[task.status]}`}>
                                        {task.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mb-4">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/tasks/${task._id}/edit`}
                                        className="flex-1 text-center bg-violet-50 text-indigo-700 font-semibold py-2 rounded-lg hover:bg-violet-100 transition text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(task._id)}
                                        className="flex-1 bg-red-50 text-red-500 font-semibold py-2 rounded-lg hover:bg-red-100 transition text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="bg-white text-indigo-950 font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-md disabled:opacity-40 border-2 border-indigo-700/30 text-sm"
                        >
                            Prev
                        </button>
                        <span className="text-indigo-950 font-medium text-sm text-center">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                            disabled={page === pagination.totalPages}
                            className="bg-white text-indigo-950 font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-md disabled:opacity-40 border-2 border-indigo-700/30 text-sm"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;