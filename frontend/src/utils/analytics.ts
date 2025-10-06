// Analytics utility for tracking user interactions
// Logs events to console (can be extended to send to analytics service)

type AnalyticsEvent =
    | 'play_clicked'
    | 'view_leaderboards_clicked'
    | 'select_player_clicked'
    | 'create_player_clicked'
    | 'back_to_welcome_clicked'
    | 'back_to_play_clicked';

interface EventData {
    [key: string]: any;
}

export const logEvent = (eventName: AnalyticsEvent, data?: EventData): void => {
    const timestamp = new Date().toISOString();
    const eventPayload = {
        event: eventName,
        timestamp,
        ...data
    };

    console.log('[Analytics]', eventPayload);

    // Future enhancement: send to analytics service
    // Example: sendToAnalyticsService(eventPayload);
};

export const analytics = {
    playClicked: () => logEvent('play_clicked'),
    viewLeaderboardsClicked: () => logEvent('view_leaderboards_clicked'),
    selectPlayerClicked: () => logEvent('select_player_clicked'),
    createPlayerClicked: () => logEvent('create_player_clicked'),
    backToWelcomeClicked: () => logEvent('back_to_welcome_clicked'),
    backToPlayClicked: () => logEvent('back_to_play_clicked'),
};
