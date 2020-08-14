import { ADD_USER_SUCCESS, ADD_USER_BEGIN, ADD_USER_FAILURE, ADD_MOVIE_BEGIN, ADD_MOVIE_SUCCESS, ADD_MOVIE_FAILURE, SET_ISLOADING } from '../constants';
const initialState = {
    userName: null,
    language: null,
    movies: [],
    movieStars: [],
    isLoading: false,
};

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USER_BEGIN:
            return {
                ...state,
                userName: null,
                language: null,
                movies: [],
                movieStars: [],
                isLoading: true,
            };
        case ADD_USER_SUCCESS:
            const { userName, language, movies, movieStars } = action.payload
            return {
                ...state,
                userName,
                language,
                movies,
                movieStars,
                isLoading: false,
            };
        case ADD_USER_FAILURE:
            return {
                ...state,
                userName: null,
                language: null,
                movies: [],
                movieStars: [],
                isLoading: false,
            };
        case SET_ISLOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        case ADD_MOVIE_BEGIN:
            return {
                ...state,
                isLoading: true,
            };
        case ADD_MOVIE_SUCCESS:
            const { index, movieId, stars } = action.payload
            let newMovies = state.movies
            let newStars = state.movieStars
            newMovies[index] = movieId
            newStars[index] = stars
            return {
                ...state,
                movies: newMovies,
                movieStars: newStars,
                isLoading: false,
            };
        case ADD_MOVIE_FAILURE:
            return {
                ...state,
                isLoading: false,
            };

        default:
            return state;
    }
}
export default generalReducer;