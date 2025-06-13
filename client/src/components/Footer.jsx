import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-stone-900 text-white">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">CodeJudge</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A modern platform for competitive programming and coding practice.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/home" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/problemList" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Problems
                                </Link>
                            </li>
                            <li>
                                <Link to="/getLeaderboard" className="text-gray-400 hover:text-white transition-colors duration-200">
                                    Leaderboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                Email:{' '}
                                <a
                                    href="mailto:support@codejudge.com"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    support@codejudge.com
                                </a>
                            </li>
                            <li>
                                Follow us on{' '}
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    Twitter
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} CodeJudge. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
