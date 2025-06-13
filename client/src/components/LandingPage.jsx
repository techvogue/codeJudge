import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <div className="bg-stone-900 text-white h-[95vh] flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Welcome to CodeJudge
                    </h1>
                    <p className="text-xl px-3 md:px-0 md:text-2xl text-gray-300 mb-8">
                        Master coding through practice and competition
                    </p>
                   <div className="flex flex-col md:flex-row items-center justify-center gap-4">
    <Link
        to="/problemList"
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium w-60 text-center"
    >
        Start Coding
    </Link>
    <Link
        to="/getLeaderboard"
        className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-md text-lg font-medium w-60 text-center"
    >
        View Leaderboard
    </Link>
</div>

                </div>
            </div>


            {/* Features Section */}
            <div className="py-16 ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Why Choose CodeJudge?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-4xl mb-4">💻</div>
                            <h3 className="text-xl font-semibold mb-2">Practice Problems</h3>
                            <p className="text-gray-600">
                                Access a wide range of coding problems to improve your skills
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-4xl mb-4">🏆</div>
                            <h3 className="text-xl font-semibold mb-2">Compete</h3>
                            <p className="text-gray-600">
                                Challenge yourself and compete with other programmers
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="text-blue-600 text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                            <p className="text-gray-600">
                                Monitor your improvement with detailed statistics
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-stone-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Coding Journey?</h2>
                    <p className="text-xl mb-8">Join thousands of developers who are already improving their skills</p>
                    <Link
                        to="/signup"
                        className="relative p-2 overflow-hidden border border-black bg-white px-6 text-stone-800 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-500 before:transition-all before:duration-500 hover:text-white hover:shadow-red-500 hover:before:left-0 hover:before:w-full"
                    >
                        <span className="relative z-10 text-lg font-semibold">Sign Up Now</span>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default LandingPage; 