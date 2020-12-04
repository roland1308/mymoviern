import {
  ADD_USER_BEGIN,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
  ADD_MOVIE_BEGIN,
  ADD_MOVIE_SUCCESS,
  ADD_SERIE_SUCCESS,
  ADD_MOVIE_FAILURE,
  SET_ISLOADING,
  REMOVE_MOVIE_SUCCESS,
  REMOVE_SERIE_SUCCESS,
  ADD_NEXT_SUCCESS,
  REMOVE_NEXT_SUCCESS,
  ADD_TIP_SUCCESS,
  REMOVE_TIP_SUCCESS,
  REMOVE_TIP_VIEWED_SUCCESS,
} from '../constants';
import {
  setMessage,
  setIsLogged,
  setAlreadyNext,
  toggleMustRefresh,
} from './generalActions';

const axios = require('axios');

export const addUser = (user) => {
  return async (dispatch) => {
    dispatch(addUserBegin());
    try {
      const response = await axios.post(
        'https://mymoviesback.herokuapp.com/users/add',
        user
      );
      if (response.status !== 200) {
        dispatch(addUserFailure());
        dispatch(setMessage(response));
      } else {
        dispatch(addUserSuccess(response.data));
        dispatch(setMessage('User correctly created'));
      }
    } catch (error) {
      dispatch(addUserFailure());
      if (error.response.data.code === 11000) {
        dispatch(setMessage('Username already exists'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const logUser = (user) => {
  return async (dispatch) => {
    dispatch(addUserBegin());
    try {
      const response = await axios.post(
        'https://mymoviesback.herokuapp.com/users/login',
        user
      );
      if (response.status !== 200) {
        dispatch(addUserFailure());
        dispatch(setMessage(response));
      } else {
        if (!user.remembered) {
          dispatch(setMessage('User logged in'));
        }
        dispatch(setIsLogged(true));
        dispatch(addUserSuccess(response.data));
      }
    } catch (error) {
      dispatch(addUserFailure());
      if (error.response.data) {
        dispatch(setMessage('Log In Error'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const addMovieToUser = (data) => {
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'https://mymoviesback.herokuapp.com/users/addmoviestars',
        data
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        await axios.put(
          'https://mymoviesback.herokuapp.com/films/addfilm',
          data
        );
        dispatch(addMovieSuccess(data));
        dispatch(setMessage('Thank you!'));
      }
    } catch (error) {
      dispatch(addMovieFailure());
      if (error) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const removeMovieToUser = (data) => {
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'https://mymoviesback.herokuapp.com/users/removemoviestars',
        data
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        const response1 = await axios.put(
          'https://mymoviesback.herokuapp.com/films/removefilm',
          data
        );
        if (response1.status !== 200) {
          dispatch(addMovieFailure());
          dispatch(setMessage(response1));
        } else {
          dispatch(removeMovieSuccess(data));
          dispatch(setMessage('Removed!'));
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(addMovieFailure());
      if (error.response.data) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const addSerieToUser = (data) => {
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'https://mymoviesback.herokuapp.com/users/addseriestars',
        data
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        await axios.put(
          'https://mymoviesback.herokuapp.com/series/addserie',
          data
        );
        dispatch(addSerieSuccess(data));
        dispatch(setMessage('Thank you!'));
      }
    } catch (error) {
      dispatch(addMovieFailure());
      if (error.response.data) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const removeSerieToUser = (data) => {
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'https://mymoviesback.herokuapp.com/users/removeseriestars',
        data
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        const response1 = await axios.put(
          'https://mymoviesback.herokuapp.com/series/removeserie',
          data
        );
        if (response1.status !== 200) {
          dispatch(addMovieFailure());
          dispatch(setMessage(response1));
        } else {
          dispatch(removeSerieSuccess(data));
          dispatch(setMessage('Removed!'));
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(addMovieFailure());
      if (error.response.data) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const addNextToUser = (data) => {
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'https://mymoviesback.herokuapp.com/users/addnext',
        data
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        dispatch(setAlreadyNext(true));
        dispatch(addNextSuccess(data));
        dispatch(setMessage('Added to your Next List!'));
      }
    } catch (error) {
      dispatch(addMovieFailure());
      if (error.response.data) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const removeNextToUser = (data) => {
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'https://mymoviesback.herokuapp.com/users/removenext',
        data
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        dispatch(setAlreadyNext(false));
        dispatch(removeNextSuccess({indexToRemove: data.index}));
        dispatch(setMessage('Removed from your Next List!'));
      }
    } catch (error) {
      dispatch(addMovieFailure());
      if (error.response.data) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const addTipToUser = (suggestion) => {
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'localhost:5000/users/addsuggestion',
        // 'https://mymoviesback.herokuapp.com/users/addsuggestion',
        suggestion
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        dispatch(addTipSuccess(suggestion));
        dispatch(setMessage('Suggestion sent!'));
      }
    } catch (error) {
      dispatch(addMovieFailure());
      if (error.response.data) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const removeTipToUser = (userName, suggestion) => {
  const data = {userName, suggestion};
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'https://mymoviesback.herokuapp.com/users/removesuggestion',
        data
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        dispatch(removeTipSuccess(suggestion));
        dispatch(toggleMustRefresh());
        dispatch(setMessage('Suggestion removed!'));
      }
    } catch (error) {
      dispatch(addMovieFailure());
      if (error.response.data) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const removeViewedTip = (userName, suggestion) => {
  const data = {userName, suggestion};
  return async (dispatch) => {
    dispatch(addMovieBegin());
    try {
      const response = await axios.put(
        'https://mymoviesback.herokuapp.com/users/removeviewed',
        data
      );
      if (response.status !== 200) {
        dispatch(addMovieFailure());
        dispatch(setMessage(response));
      } else {
        dispatch(removeViewedTipSuccess(suggestion));
        dispatch(toggleMustRefresh());
      }
    } catch (error) {
      dispatch(addMovieFailure());
      if (error.response.data) {
        dispatch(setMessage('An error has occurred'));
      } else {
        dispatch(setMessage(error.message));
      }
    }
    return 'done';
  };
};

export const addUserBegin = () => ({
  type: ADD_USER_BEGIN,
});
export const addUserSuccess = (user) => ({
  type: ADD_USER_SUCCESS,
  payload: user,
});
export const addUserFailure = () => ({
  type: ADD_USER_FAILURE,
});

export const addMovieBegin = () => ({
  type: ADD_MOVIE_BEGIN,
});
export const addMovieSuccess = (user) => ({
  type: ADD_MOVIE_SUCCESS,
  payload: user,
});
export const addSerieSuccess = (user) => ({
  type: ADD_SERIE_SUCCESS,
  payload: user,
});
export const addMovieFailure = () => ({
  type: ADD_MOVIE_FAILURE,
});
export const addNextSuccess = (data) => ({
  type: ADD_NEXT_SUCCESS,
  payload: data,
});
export const removeNextSuccess = (data) => ({
  type: REMOVE_NEXT_SUCCESS,
  payload: data,
});
export const addTipSuccess = (data) => ({
  type: ADD_TIP_SUCCESS,
  payload: data,
});
export const removeTipSuccess = (data) => ({
  type: REMOVE_TIP_SUCCESS,
  payload: data,
});
export const removeViewedTipSuccess = (data) => ({
  type: REMOVE_TIP_VIEWED_SUCCESS,
  payload: data,
});
export const removeMovieSuccess = (data) => ({
  type: REMOVE_MOVIE_SUCCESS,
  payload: data,
});

export const removeSerieSuccess = (data) => ({
  type: REMOVE_SERIE_SUCCESS,
  payload: data,
});

export const setIsLoading = (status) => ({
  type: SET_ISLOADING,
  payload: status,
});
