export const HOST = import.meta.env.VITE_SERVER_URL;

//AUTH ROUTES
export const AUTH_ROUTES = `${HOST}/api/auth`
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const LOGOUT_USER  = `${AUTH_ROUTES}/logout`
export const UPDATE_USERINFO = `${AUTH_ROUTES}/update-info`

// MOVIES ROUTES - 
export const MOVIES_ROUTES = `${HOST}/api/movies`
export const GET_ALL_MOVIES  = `${MOVIES_ROUTES}/GetallMovies`
export const GET_MOVIES_BY_ID = `${MOVIES_ROUTES}/getMovies`


// REVIEW ROUTES - 
export const REVIEW_ROUTES = `${HOST}/api/reviews/movies`

// WatchList 

export const WATCHLIST_ROUTES = `${HOST}/api/watchlist`
export const ADD_MOVIES_WATCHLIST = `${WATCHLIST_ROUTES}/AddWatchlist`
export const GET_MOVIES_WATCHLIST = `${WATCHLIST_ROUTES}/GetWatchlist`
export const REMOVE_WATCHLIST = `${WATCHLIST_ROUTES}/removeWatchlist`