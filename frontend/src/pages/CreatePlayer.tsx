import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi, playerStorage } from '../utils/api';

export default function CreatePlayer() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!name.trim()) {
            setError('Player name is required');
            return;
        }

        if (name.trim().length < 2) {
            setError('Player name must be at least 2 characters');
            return;
        }

        if (email && !isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Create user via API
            const newUser = await userApi.createUser({
                name: name.trim(),
                email: email.trim() || undefined
            });

            // Store as current player
            playerStorage.setCurrentPlayer(newUser);

            // Navigate to play page
            navigate('/play');
        } catch (err: any) {
            console.error('Failed to create player:', err);
            setError(err.message || 'Failed to create player. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleBackToSelection = () => {
        navigate('/select-player');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Card Container */}
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-8 border-2 border-purple-100">
                    {/* Icon */}
                    <div className="text-center mb-6">
                        <span className="text-6xl" role="img" aria-label="Sparkles">✨</span>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Player</h1>
                        <p className="text-gray-600">Start your memory game journey!</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                            <p className="text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Player Name Field */}
                        <div>
                            <label htmlFor="playerName" className="block text-gray-700 font-semibold mb-2">
                                Player Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="playerName"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                                maxLength={255}
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                                Email <span className="text-gray-500 text-sm font-normal">(optional)</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null);
                                }}
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all"
                                disabled={loading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl transform transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Player...
                                </span>
                            ) : (
                                'Create Player & Start Playing'
                            )}
                        </button>
                    </form>

                    {/* Back Button */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={handleBackToSelection}
                            disabled={loading}
                            className="text-purple-600 hover:text-purple-800 font-semibold disabled:text-gray-400 transition-colors"
                        >
                            ← Back to options
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-700">
                        Your data is stored locally and securely. 🔒
                    </p>
                </div>
            </div>
        </div>
    );
}
