export const ROUTES = {
  main: '/main',

  home: '/',
  users: '/users',
  broadcastPartners: '/broadcast-partners',
  worldFeedInfo: '/world-feed-info',
  tournamentInfo: '/tournament-info',
  eventSchedules: '/event-schedules',
  images: '/images',
  photosVideoAudio: '/photos-video-and-audio',
  transcripts: '/transcripts',
  videos: '/videos',

  signIn: '/sign-in',
  forgotPassword: '/forgot-password',
  signUp: '/sign-up',

  archive: '/archive',

  footer: '/footer',
  header: '/header',
  sidebar: '/nav',
  userDayInfo: '/user-day-info',
  whatsApp: '/whatsapp',

  oncourtSiteInformation: 'oncourt-site-information',
  shuttleReservationForm: '/shuttle-reservation-form',
};

export const PRIVATE_ROUTES = [
  ROUTES.home,
  ROUTES.users,
  ROUTES.photosVideoAudio,
  ROUTES.transcripts,
  ROUTES.worldFeedInfo,
  ROUTES.tournamentInfo,
  ROUTES.eventSchedules,
  ROUTES.images,
  ROUTES.videos,
  ROUTES.archive,
  ROUTES.shuttleReservationForm,
  ROUTES.whatsApp,
];

export const UN_AUTH_ROUTES = [
  ROUTES.main,
  ROUTES.signIn,
  ROUTES.forgotPassword,
  ROUTES.signUp,
];

export const ADMIN_ROUTES = [ROUTES.users];

export const ROUTES_WITHOUT_HEADER = [
  ROUTES.signIn,
  ROUTES.forgotPassword,
  ROUTES.signUp,
];

export const ROUTES_WITHOUT_USER_DAY_INFO = [
  ROUTES.main,
  ROUTES.signIn,
  ROUTES.forgotPassword,
  ROUTES.signUp,
];

export const ROUTES_WITHOUT_FOOTER = [
  ROUTES.signIn,
  ROUTES.forgotPassword,
  ROUTES.signUp,
];

export const ROUTES_WITHOUT_SIDEBAR = [
  ROUTES.signIn,
  ROUTES.forgotPassword,
  ROUTES.signUp,
  ROUTES.main,
];

export const GLOBAL_COMPONENT_ROUTES = [
  ROUTES.header,
  ROUTES.userDayInfo,
  ROUTES.sidebar,
  ROUTES.footer,
];
