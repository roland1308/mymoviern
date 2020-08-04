import { ADD_USER_BEGIN, ADD_USER_SUCCESS, ADD_USER_FAILURE } from '../constants';
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

export const addUserBegin = () => ({
    type: ADD_USER_BEGIN
});
export const addUserSuccess = user => ({
    type: ADD_USER_SUCCESS,
    payload: user
});
export const addUserFailure = error => ({
    type: ADD_USER_FAILURE,
});

