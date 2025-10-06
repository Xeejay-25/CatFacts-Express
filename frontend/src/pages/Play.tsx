import { analytics } from '../utils/analytics';

export default function Play() {
    const handleSelectPlayer = () => {
        analytics.selectPlayerClicked();
        // TODO: Open player picker modal/view
        alert('Select Player feature coming soon!');
    };

    const handleCreatePlayer = () => {
        analytics.createPlayerClicked();
        // TODO: Open create player modal/view
        alert('Create Player feature coming soon!');
    };

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
