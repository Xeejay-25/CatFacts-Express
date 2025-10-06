import { Link, useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics';

export default function Navigation() {
    const location = useLocation();

    const handleLogoClick = () => {
        analytics.backToWelcomeClicked();
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            className="bg-white/80 backdrop-blur-sm shadow-sm"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Home Link */}
                    <Link
                        to="/"
                        onClick={handleLogoClick}
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
                        aria-label="Cat Facts Memory Game - Go to home"
                    >
                        <span className="text-3xl" role="img" aria-label="Cat">🐱</span>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-800 leading-tight">Cat Facts</span>
                            <span className="text-xs text-indigo-600 font-semibold leading-tight">Memory Game</span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isActive('/')
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            aria-label="Welcome page"
                            aria-current={isActive('/') ? 'page' : undefined}
                        >
                            Welcome
                        </Link>
                        <Link
                            to="/leaderboards"
                            onClick={() => analytics.viewLeaderboardsClicked()}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isActive('/leaderboards')
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            aria-label="Leaderboards page"
                            aria-current={isActive('/leaderboards') ? 'page' : undefined}
                        >
                            Leaderboards
                        </Link>
                        <Link
                            to="/play"
                            onClick={() => analytics.playClicked()}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isActive('/play')
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            aria-label="Play page"
                            aria-current={isActive('/play') ? 'page' : undefined}
                        >
                            Play
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
