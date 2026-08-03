import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getTaskById, updateTask } from '../api/tasks';

const EditTask = () => {
    const { id } = useParams();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [serverError, setServerError] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await getTaskById(id);
                const task = res.data.data;
                setIsCompleted(task.status === 'Completed');
                reset({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                });
            } catch (err) {
                setServerError('Failed to load task');
            } finally {
                setFetching(false);
            }
        };
        fetchTask();
    }, [id, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            const payload = isCompleted ? { status: data.status } : data;
            await updateTask(id, payload);
            navigate('/tasks');
        } catch (error) {
            setServerError(error.response?.data?.message || 'Failed to update task');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-purple-100 flex items-center justify-center text-indigo-950">
                Loading task...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-purple-100 px-4 py-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-lime-400 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute top-1/4 -right-10 w-56 h-56 bg-amber-300 rounded-full opacity-40 blur-2xl"></div>
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-400 rounded-full opacity-30 blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-48 h-48 bg-red-400 rounded-full opacity-30 blur-2xl"></div>

            <div className="w-full max-w-lg bg-gray-300 rounded-3xl p-8 shadow-xl border-2 border-indigo-700/30 relative">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold text-indigo-950">Edit Task</h2>
                    <Link to="/tasks" className="text-sm text-gray-500 hover:text-indigo-700">Back</Link>
                </div>

                {isCompleted && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-xl px-4 py-2 mb-4">
                        This task is marked Completed. Only the status can be changed.
                    </div>
                )}

                {serverError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-4">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-indigo-950 mb-1 block">Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            type="text"
                            disabled={isCompleted}
                            className="w-full bg-violet-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-indigo-950 placeholder-gray-400 focus:outline-none focus:border-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-indigo-950 mb-1 block">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            disabled={isCompleted}
                            className="w-full bg-violet-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-indigo-950 placeholder-gray-400 focus:outline-none focus:border-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-indigo-950 mb-1 block">Priority</label>
                            <select
                                {...register('priority')}
                                disabled={isCompleted}
                                className="w-full bg-violet-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-indigo-950 focus:outline-none focus:border-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-indigo-950 mb-1 block">Status</label>
                            <select
                                {...register('status')}
                                className="w-full bg-violet-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-indigo-950 focus:outline-none focus:border-indigo-700"
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-indigo-950 mb-1 block">Due Date</label>
                        <input
                            {...register('dueDate', { required: 'Due date is required' })}
                            type="date"
                            min={today}
                            disabled={isCompleted}
                            className="w-full bg-violet-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-indigo-950 focus:outline-none focus:border-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-700 text-white font-semibold rounded-xl py-3 mt-2 hover:bg-indigo-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Task'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTask;