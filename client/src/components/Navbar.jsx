import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const token = localStorage.getItem('token');
    const [, , removeCookie] = useCookies(['userEmail', 'userToken']);

    const handleLogout = () => {
        // Close the mobile menu when logging out
        setIsMenuOpen(false);

        // Remove token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Remove cookies
        removeCookie('userEmail', { path: '/' });
        removeCookie('userToken', { path: '/' });

        // Redirect to login page
        navigate('/login');
    };

    // Function to close the menu when a link is clicked
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-stone-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <span className="text-2xl font-bold text-gray-100">CodeJudge</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {token ? (
                                <>
                                    <Link to="/home" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        Home
                                    </Link>
                                    <Link to="/problemList" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        Problems
                                    </Link>
                                    <Link to="/getLeaderboard" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        Leaderboard
                                    </Link>
                                    <Link to="/profile" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {isMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {token ? (
                            <>
                                <Link
                                    to="/home"
                                    onClick={handleLinkClick}
                                    className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/problemList"
                                    onClick={handleLinkClick}
                                    className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Problems
                                </Link>
                                <Link
                                    to="/getLeaderboard"
                                    onClick={handleLinkClick}
                                    className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Leaderboard
                                </Link>
                                <Link
                                    to="/profile"
                                    onClick={handleLinkClick}
                                    className="block hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout} // handleLogout already includes closing the menu
                                    className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={handleLinkClick}
                                className="block bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium text-center"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;