export const HOST = import.meta.env.VITE_SERVER_URL;
//AUTH ROUTES
export const AUTH_ROUTES = `${HOST}/api/auth`
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const ADMIN_LOGIN_ROUTE = `${AUTH_ROUTES}/adminLogin`
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`
export const LOGOUT_USER  = `${AUTH_ROUTES}/logout`


// MOVIES ROUTES - 
export const MOVIES_ROUTES = `${HOST}/api/movies`
export const ADD_MOVIES = `${MOVIES_ROUTES}/AddMovies`
export const GET_ALL_MOVIES  = `${MOVIES_ROUTES}/GetallMovies`
export const DELETE_MOVIES = `${MOVIES_ROUTES}/DeleteMovies`
export const UPDATE_MOVIES = `${MOVIES_ROUTES}/UpdateMovies`




 

