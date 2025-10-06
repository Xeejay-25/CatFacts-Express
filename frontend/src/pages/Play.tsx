import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playerStorage } from '../utils/api';
import type { User } from '../utils/api';
import { analytics } from '../utils/analytics';

export default function Play() {
    const navigate = useNavigate();
    const [currentPlayer, setCurrentPlayer] = useState<User | null>(null);

    useEffect(() => {
        // Check if a player is already selected
        const player = playerStorage.getCurrentPlayer();
        setCurrentPlayer(player);
    }, []);

    const handleSelectPlayer = () => {
        analytics.selectPlayerClicked();
        navigate('/select-player');
    };

    const handleCreatePlayer = () => {
        analytics.createPlayerClicked();
        navigate('/create-player');
    };

    const handleChangePlayer = () => {
        playerStorage.clearCurrentPlayer();
        setCurrentPlayer(null);
        navigate('/select-player');
    };

    const handleStartGame = (difficulty: 'easy' | 'medium' | 'hard') => {
        // TODO: Implement game start logic
        alert(`Starting ${difficulty} game for ${currentPlayer?.name}!`);
    };

    // If player is selected, show game options
    if (currentPlayer) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200 flex items-center justify-center px-4 py-12">
                <div className="max-w-4xl w-full">
                    {/* Player Info Header */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="text-5xl" role="img" aria-label="Player">🎮</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{currentPlayer.name}</h2>
                                    {currentPlayer.email && (
                                        <p className="text-gray-600">{currentPlayer.email}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleChangePlayer}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-xl transition-all"
                            >
                                Change Player
                            </button>
                        </div>
                    </div>

                    {/* Game Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">Choose Difficulty</h1>
                        <p className="text-xl text-gray-700">
                            Select your challenge level and start matching!
                        </p>
                    </div>

                    {/* Difficulty Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Easy */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform transition-all duration-200 hover:scale-105">
                            <div className="flex flex-col items-center space-y-4">
                                <span className="text-5xl" role="img" aria-label="Easy">🌱</span>
                                <h3 className="text-2xl font-bold text-green-600">Easy</h3>
                                <p className="text-gray-600 text-center">4x4 Grid<br/>8 Pairs</p>
                                <button
                                    onClick={() => handleStartGame('easy')}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
                                >
                                    Start Easy
                                </button>
                            </div>
                        </div>

                        {/* Medium */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform transition-all duration-200 hover:scale-105">
                            <div className="flex flex-col items-center space-y-4">
                                <span className="text-5xl" role="img" aria-label="Medium">🔥</span>
                                <h3 className="text-2xl font-bold text-orange-600">Medium</h3>
                                <p className="text-gray-600 text-center">4x6 Grid<br/>12 Pairs</p>
                                <button
                                    onClick={() => handleStartGame('medium')}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
                                >
                                    Start Medium
                                </button>
                            </div>
                        </div>

                        {/* Hard */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl transform transition-all duration-200 hover:scale-105">
                            <div className="flex flex-col items-center space-y-4">
                                <span className="text-5xl" role="img" aria-label="Hard">⚡</span>
                                <h3 className="text-2xl font-bold text-red-600">Hard</h3>
                                <p className="text-gray-600 text-center">6x6 Grid<br/>18 Pairs</p>
                                <button
                                    onClick={() => handleStartGame('hard')}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
                                >
                                    Start Hard
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-700 hover:text-gray-900 font-semibold"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // If no player is selected, show player selection options
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200 flex items-center justify-center px-4 py-12">
            <div className="max-w-5xl w-full text-center">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">Ready to Play?</h1>
                    <p className="text-xl text-gray-700">
                        Choose how you want to start your memory game adventure!
                    </p>
                </div>

                {/* Two Options Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Select Player Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl transform transition-all duration-200 hover:scale-105">
                        <div className="flex flex-col items-center space-y-6">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-4xl" role="img" aria-label="Person">👤</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-gray-800">Select Player</h2>

                            {/* Description */}
                            <p className="text-gray-600 text-base">
                                Choose from existing players
                            </p>

                            {/* Button */}
                            <button
                                onClick={handleSelectPlayer}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                                aria-label="Select an existing player"
                            >
                                Select Player
                            </button>
                        </div>
                    </div>

                    {/* Create Player Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-xl transform transition-all duration-200 hover:scale-105">
                        <div className="flex flex-col items-center space-y-6">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-4xl" role="img" aria-label="Sparkles">✨</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-bold text-gray-800">Create Player</h2>

                            {/* Description */}
                            <p className="text-gray-600 text-base">
                                Start fresh with a new profile
                            </p>

                            {/* Button */}
                            <button
                                onClick={handleCreatePlayer}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg"
                                aria-label="Create a new player profile"
                            >
                                Create Player
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
