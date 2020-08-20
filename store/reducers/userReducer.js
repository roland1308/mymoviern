import { ADD_USER_SUCCESS, ADD_USER_BEGIN, ADD_USER_FAILURE, ADD_MOVIE_BEGIN, ADD_MOVIE_SUCCESS, ADD_SERIE_SUCCESS, ADD_MOVIE_FAILURE, SET_ISLOADING } from '../constants';
const initialState = {
    userName: null,
    language: null,
    movies: [],
    movieStars: [],
    series: [],
    serieStars: [],
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
                series: [],
                serieStars: [],
                isLoading: true,
            };
        case ADD_USER_SUCCESS:
            const { userName, language, movies, movieStars, series, serieStars } = action.payload
            return {
                ...state,
                userName,
                language,
                movies,
                movieStars,
                series,
                serieStars,
                isLoading: false,
            };
        case ADD_USER_FAILURE:
            return {
                ...state,
                userName: null,
                language: null,
                movies: [],
                movieStars: [],
                series: [],
                serieStars: [],
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
            const { movieIndex, movieId, thisMovieStars } = action.payload
            let newMovies = state.movies
            let newMovieStars = state.movieStars
            newMovies[movieIndex] = movieId
            newMovieStars[movieIndex] = thisMovieStars
            return {
                ...state,
                movies: newMovies,
                movieStars: newMovieStars,
                isLoading: false,
            };
        case ADD_SERIE_SUCCESS:
            const { serieIndex, serieId, thisSerieStars } = action.payload
            let newSeries = state.series
            let newSerieStars = state.serieStars
            newSeries[serieIndex] = serieId
            newSerieStars[serieIndex] = thisSerieStars
            return {
                ...state,
                series: newSeries,
                serieStars: newSerieStars,
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