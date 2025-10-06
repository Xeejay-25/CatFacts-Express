import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { analytics } from '../utils/analytics';

export default function Welcome() {
    const navigate = useNavigate();

    const handlePlayClick = () => {
        analytics.playClicked();
        navigate('/select-player');
    };

    const handleLeaderboardsClick = () => {
        analytics.viewLeaderboardsClicked();
        navigate('/leaderboards');
    };

    // Handle Enter key press to trigger Play
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handlePlayClick();
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200 flex items-center justify-center px-4 py-12">
            <div className="max-w-4xl w-full text-center">
                {/* Hero Section */}
                <div className="mb-12">
                    {/* Logo and Title */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <span className="text-8xl mb-6" role="img" aria-label="Cat">😺</span>
                        <div>
                            <h1 className="text-6xl font-bold text-gray-800 mb-2">Cat Facts</h1>
                            <h2 className="text-4xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Memory Game
                            </h2>
                        </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        Match cards, score points, and discover fascinating cat facts! Test your memory skills while learning amazing things about our feline friends.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
                    {/* Primary CTA - Play */}
                    <button
                        onClick={handlePlayClick}
                        className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-2xl transform transition-all duration-200 hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center space-x-3"
                        aria-label="Play the memory game"
                    >
                        <span className="text-2xl" role="img" aria-label="Game controller">🎮</span>
                        <span className="text-xl">Play</span>
                    </button>

                    {/* Secondary CTA - View Leaderboards */}
                    <button
                        onClick={handleLeaderboardsClick}
                        className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-10 rounded-2xl transform transition-all duration-200 hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 flex items-center justify-center space-x-3"
                        aria-label="View leaderboards"
                    >
                        <span className="text-2xl" role="img" aria-label="Trophy">🏆</span>
                        <span className="text-xl">View Leaderboard</span>
                    </button>
                </div>

                {/* Decorative Icons */}
                <div className="mt-12 flex justify-center space-x-4 text-4xl opacity-70">
                    <span role="img" aria-label="Paw prints">🐾</span>
                    <span role="img" aria-label="Target">🎯</span>
                    <span role="img" aria-label="Star">⭐</span>
                    <span role="img" aria-label="Brain">🧠</span>
                    <span role="img" aria-label="Rainbow">🌈</span>
                </div>
            </div>
        </div>
    );
}
