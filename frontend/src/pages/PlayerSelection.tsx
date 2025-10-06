import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, playerStorage } from '../utils/api';
import type { User } from '../utils/api';
import { analytics } from '../utils/analytics';

export default function PlayerSelection() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedUsers = await userApi.getAllUsers();
            setUsers(fetchedUsers);
        } catch (err) {
            console.error('Failed to load users:', err);
            setError('Failed to load players. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlayer = (user: User) => {
        analytics.selectPlayerClicked();
        playerStorage.setCurrentPlayer(user);
        navigate('/play');
    };

    const handleCreateNewPlayer = () => {
        analytics.createPlayerClicked();
        navigate('/create-player');
    };

    const handleBackToWelcome = () => {
        analytics.backToWelcomeClicked();
        navigate('/');
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200 flex items-center justify-center px-4 py-12">
            <div className="max-w-6xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-3">Select Player</h1>
                    <p className="text-xl text-gray-700">Choose a player to continue your gaming journey</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                        <p className="mt-4 text-gray-700 text-lg">Loading players...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-8">
                        <p className="font-semibold">{error}</p>
                        <button
                            onClick={loadUsers}
                            className="mt-3 text-sm underline hover:no-underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Players Grid */}
                {!loading && !error && users.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => handleSelectPlayer(user)}
                                className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer p-8 text-center border-2 border-transparent hover:border-purple-400"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleSelectPlayer(user);
                                    }
                                }}
                            >
                                {/* Icon */}
                                <div className="text-6xl mb-4">
                                    <span role="img" aria-label="Game controller">🎮</span>
                                </div>

                                {/* Player Name */}
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 truncate">
                                    {user.name}
                                </h3>

                                {/* Player Info */}
                                <div className="space-y-2 text-left">
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                        <span className="text-sm text-gray-600 font-medium">Email:</span>
                                        <span className="text-sm text-gray-800 font-semibold truncate ml-2">
                                            {user.email || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                        <span className="text-sm text-gray-600 font-medium">Joined:</span>
                                        <span className="text-sm text-gray-800 font-semibold">
                                            {formatDate(user.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Click to Select */}
                                <p className="mt-6 text-sm text-purple-600 font-semibold">
                                    Click to select
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Players State */}
                {!loading && !error && users.length === 0 && (
                    <div className="text-center py-12 max-w-md mx-auto">
                        <span className="text-8xl mb-6 block">✨</span>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Players Yet</h2>
                        <p className="text-gray-700 mb-8">Create your first player to start your memory game journey!</p>
                    </div>
                )}

                {/* Action Buttons */}
                {!loading && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        {/* Create New Player Button */}
                        <button
                            onClick={handleCreateNewPlayer}
                            className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-2xl transform transition-all duration-200 hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center space-x-3"
                        >
                            <span className="text-2xl" role="img" aria-label="Sparkles">✨</span>
                            <span className="text-lg">Create New Player</span>
                        </button>

                        {/* Back to Welcome Button */}
                        <button
                            onClick={handleBackToWelcome}
                            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-8 rounded-2xl transform transition-all duration-200 hover:scale-105 shadow-md focus:outline-none focus:ring-4 focus:ring-gray-300"
                        >
                            ← Back to Welcome
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
