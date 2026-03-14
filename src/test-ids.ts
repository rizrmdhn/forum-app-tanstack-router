export const TEST_IDS = {
  NAV_BAR: {
    LOGIN_BUTTON: 'nav-bar-login-button',
    LOGOUT_BUTTON: 'nav-bar-logout-button',
  },
  LOGIN: {
    EMAIL_INPUT: 'login-email-input',
    PASSWORD_INPUT: 'login-password-input',
    SUBMIT: 'login-submit',
  },
  THREAD_CARD: {
    UPVOTE: (id: string) => `thread-card-upvote-${id}`,
    DOWNVOTE: (id: string) => `thread-card-downvote-${id}`,
  },
} as const;
