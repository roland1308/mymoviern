import { ADD_USER_BEGIN, ADD_USER_SUCCESS, ADD_USER_FAILURE, ADD_MOVIE_BEGIN, ADD_MOVIE_SUCCESS, ADD_MOVIE_FAILURE, SET_ISLOADING } from '../constants';
import { setMessage } from './generalActions';

const axios = require("axios");

export const addUser = user => {
    return async dispatch => {
        dispatch(addUserBegin());
        try {
            const response = await axios.post("https://mymoviesback.herokuapp.com/users/add", user)
            if (response.status !== 200) {
                dispatch(addUserFailure());
                dispatch(setMessage(response))
            } else {
                dispatch(addUserSuccess(response.data))
                dispatch(setMessage("User correctly created"))
            }
        } catch (error) {
            dispatch(addUserFailure())
            if (error.response.data.code === 11000) {
                dispatch(setMessage("Username already exists"))
            } else {
                dispatch(setMessage(error.message))
            }
        }
        return "done";
    };
};

export const logUser = user => {
    return async dispatch => {
        dispatch(addUserBegin());
        try {
            const response = await axios.post("https://mymoviesback.herokuapp.com/users/login", user)
            if (response.status !== 200) {
                dispatch(addUserFailure());
                dispatch(setMessage(response))
            } else {
                dispatch(addUserSuccess(response.data))
                dispatch(setMessage("User logged in"))
            }
        } catch (error) {
            dispatch(addUserFailure())
            if (error.response.data) {
                dispatch(setMessage("Log In Error"))
            } else {
                dispatch(setMessage(error.message))
            }
        }
        return "done";
    };
};

export const addMovieToUser = data => {
    return async dispatch => {
        dispatch(addMovieBegin());
        try {
            const response = await axios.put("https://mymoviesback.herokuapp.com/users/addStars", data)
            if (response.status !== 200) {
                dispatch(addMovieFailure());
                dispatch(setMessage("response"))
            } else {
                dispatch(addMovieSuccess(data))
                dispatch(setMessage("Thank you!"))
            }
        } catch (error) {
            dispatch(addMovieFailure())
            if (error.response.data) {
                dispatch(setMessage("An error has occurred"))
            } else {
                dispatch(setMessage("error.message"))
            }
        }
        return "done";
    };
};

export const addUserBegin = () => ({
    type: ADD_USER_BEGIN
});
export const addUserSuccess = user => ({
    type: ADD_USER_SUCCESS,
    payload: user
});
export const addUserFailure = () => ({
    type: ADD_USER_FAILURE,
});

export const addMovieBegin = () => ({
    type: ADD_MOVIE_BEGIN
});
export const addMovieSuccess = user => ({
    type: ADD_MOVIE_SUCCESS,
    payload: user
});
export const addMovieFailure = () => ({
    type: ADD_MOVIE_FAILURE,
});

export const setIsLoading = status => ({
    type: SET_ISLOADING,
    payload: status
});

