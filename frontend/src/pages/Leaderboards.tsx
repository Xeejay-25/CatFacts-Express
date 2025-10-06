import { useState } from 'react';
import { Link } from 'react-router-dom';
import { analytics } from '../utils/analytics';

// Mock data for demonstration
const mockIndividualGames = [
    {
        id: 1,
        playerName: 'Demo',
        crown: '👑',
        score: 1500,
        date: 'Sep 25, 11:06 PM',
        difficulty: 'easy',
        time: '0:45',
        moves: 25
    },
    {
        id: 2,
        playerName: 'asd',
        crown: '🥈',
        score: 1261,
        date: 'Sep 25, 11:36 PM',
        difficulty: 'easy',
        time: '0:39',
        moves: 16
    },
    {
        id: 3,
        playerName: 'Demo',
        crown: '🥉',
        score: 1243,
        date: 'Sep 25, 11:00 PM',
        difficulty: 'easy',
        time: '0:57',
        moves: 20
    },
    {
        id: 4,
        playerName: 'asd',
        crown: '#4',
        score: 1231,
        date: 'Sep 26, 08:40 AM',
        difficulty: 'easy',
        time: '1:09',
        moves: 20
    },
    {
        id: 5,
        playerName: 'Efren',
        crown: '#5',
        score: 1181,
        date: 'Sep 25, 10:53 PM',
        difficulty: 'easy',
        time: '0:59',
        moves: 26
    }
];

const mockPlayerStats = [
    {
        id: 1,
        playerName: 'Demo',
        crown: '👑',
        bestScore: 1500,
        gamesCompleted: 0,
        avgScore: 0,
        avgTime: 0
    },
    {
        id: 2,
        playerName: 'asd',
        crown: '🥈',
        bestScore: 1261,
        gamesCompleted: 0,
        avgScore: 0,
        avgTime: 0
    },
    {
        id: 3,
        playerName: 'Efren',
        crown: '🥉',
        bestScore: 1181,
        gamesCompleted: 0,
        avgScore: 0,
        avgTime: 0
    }
];

export default function Leaderboards() {
    const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');

    // Check if there are any scores
    const hasScores = mockIndividualGames.length > 0;

    const handleBackToPlay = () => {
        analytics.backToPlayClicked();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200 px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-700 hover:text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
                        aria-label="Back to game"
                    >
                        <span className="mr-2">←</span>
                        <span className="font-medium">Back to Game</span>
                    </Link>

                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <span className="text-4xl" role="img" aria-label="Trophy">🏆</span>
                            <h1 className="text-5xl font-bold text-gray-800">Leaderboard</h1>
                        </div>
                        <p className="text-gray-700 text-lg">Top scores and player rankings</p>
                    </div>
                </div>

                {/* Two Cards Layout */}
                {hasScores ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Left Card: Best Individual Game Performances */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                            <div className="flex items-center space-x-2 mb-6">
                                <span className="text-3xl" role="img" aria-label="Trophy">🏆</span>
                                <h2 className="text-2xl font-bold text-gray-800">Best individual game performances</h2>
                            </div>

                            {/* Difficulty Filter */}
                            <div className="flex space-x-2 mb-6">
                                {(['Easy', 'Medium', 'Hard'] as const).map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        onClick={() => setSelectedDifficulty(difficulty)}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${selectedDifficulty === difficulty
                                                ? 'bg-gray-800 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        aria-label={`Filter by ${difficulty} difficulty`}
                                        aria-pressed={selectedDifficulty === difficulty}
                                    >
                                        {difficulty}
                                    </button>
                                ))}
                            </div>

                            {/* Games List */}
                            <div className="space-y-3">
                                {mockIndividualGames.map((game, index) => (
                                    <div
                                        key={game.id}
                                        className={`rounded-2xl p-4 ${index === 0 ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3 flex-1">
                                                <span className="text-2xl">{game.crown}</span>
                                                <div>
                                                    <div className="font-bold text-gray-800">{game.playerName}</div>
                                                    <div className="text-sm text-gray-600">{game.date}</div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-800">{game.score}</div>
                                                <div className="flex items-center space-x-2 text-xs">
                                                    <span className="bg-green-500 text-white px-2 py-1 rounded">
                                                        {game.difficulty}
                                                    </span>
                                                    <span className="text-gray-600">
                                                        {game.time} · {game.moves} moves
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Card: Best Overall Player Statistics */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                            <div className="flex items-center space-x-2 mb-6">
                                <span className="text-3xl" role="img" aria-label="Star">⭐</span>
                                <h2 className="text-2xl font-bold text-gray-800">Best overall player statistics</h2>
                            </div>

                            {/* Player Stats List */}
                            <div className="space-y-6">
                                {mockPlayerStats.map((player) => (
                                    <div key={player.id} className="bg-gray-50 rounded-2xl p-6">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <span className="text-2xl">{player.crown}</span>
                                            <div className="flex-1">
                                                <div className="font-bold text-xl text-gray-800">{player.playerName}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-purple-600">{player.bestScore}</div>
                                                <div className="text-xs text-gray-600">Best Score</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-2xl mb-1" role="img" aria-label="Checkmark">🎯</div>
                                                <div className="text-sm text-gray-600">Completed</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl mb-1" role="img" aria-label="Star">⭐</div>
                                                <div className="text-sm text-gray-600">Avg Score</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl mb-1" role="img" aria-label="Clock">⏱️</div>
                                                <div className="text-sm text-gray-600">Avg Time</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl text-center">
                        <div className="text-6xl mb-6" role="img" aria-label="Empty box">📦</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">No scores yet</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Play your first game to get on the board!
                        </p>
                        <Link
                            to="/play"
                            onClick={handleBackToPlay}
                            className="inline-block bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-10 rounded-2xl transform transition-all duration-200 hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
                            aria-label="Start playing to get on the leaderboard"
                        >
                            Start Playing
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
