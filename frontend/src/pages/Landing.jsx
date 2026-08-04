import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-emerald-300 flex items-center justify-center px-4 relative overflow-hidden">

            <div className="absolute top-16 right-10 w-16 h-16 text-pink-500 text-5xl select-none rotate-12">✦</div>

            <div className="relative w-full max-w-sm text-center">
                <h1 className="text-4xl font-extrabold text-indigo-950 leading-tight mb-8">
                    Task Management System
                </h1>

                <div className="flex flex-col items-center gap-3 mb-10">
                    <span className="bg-amber-300 text-indigo-950 font-bold px-6 py-2 rounded-full text-lg -rotate-2 shadow-md">
                        goal
                    </span>
                    <div className="flex gap-3">
                        <span className="bg-red-400 text-indigo-950 font-bold px-6 py-2 rounded-full text-lg rotate-2 shadow-md">
                            task
                        </span>
                        <span className="bg-pink-400 text-indigo-950 font-bold px-6 py-2 rounded-full text-lg -rotate-1 shadow-md">
                            plan
                        </span>
                    </div>
                    <span className="bg-violet-700 text-white font-bold w-40 h-16 rounded-full shadow-md mt-2 flex items-center justify-center text-lg">
                        do it!
                    </span>
                </div>

                <Link
                    to="/signup"
                    className="inline-block bg-lime-400 text-indigo-950 font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition"
                >
                    Get Started
                </Link>

                <p className="text-indigo-950 font-semibold text-sm mt-5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-950 font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Landing;