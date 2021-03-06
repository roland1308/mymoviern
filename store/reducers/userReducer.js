import {
  ADD_USER_SUCCESS,
  ADD_USER_BEGIN,
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

const initialState = {
  userName: null,
  language: null,
  movies: [],
  movieStars: [],
  series: [],
  serieStars: [],
  next: [],
  suggestions: [],
  isLoading: true,
};

let suggestionIndex = null;

const userReducer = (state = initialState, action) => {
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
        next: [],
        suggestions: [],
        isLoading: true,
      };
    case ADD_USER_SUCCESS:
      const {
        userName,
        language,
        movies,
        movieStars,
        series,
        serieStars,
        next,
        suggestions,
      } = action.payload;
      return {
        ...state,
        userName,
        language,
        movies,
        movieStars,
        series,
        serieStars,
        next,
        suggestions,
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
        next: [],
        suggestions: [],
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
      const {movieIndex, movieId, thisMovieStars} = action.payload;
      let newMovies = state.movies;
      let newMovieStars = state.movieStars;
      newMovies[movieIndex] = movieId;
      newMovieStars[movieIndex] = thisMovieStars;
      return {
        ...state,
        movies: newMovies,
        movieStars: newMovieStars,
        isLoading: false,
      };
    case ADD_SERIE_SUCCESS:
      const {serieIndex, serieId, thisSerieStars} = action.payload;
      let newSeries = state.series;
      let newSerieStars = state.serieStars;
      newSeries[serieIndex] = serieId;
      newSerieStars[serieIndex] = thisSerieStars;
      return {
        ...state,
        series: newSeries,
        serieStars: newSerieStars,
        isLoading: false,
      };
    case ADD_NEXT_SUCCESS:
      const {index, id} = action.payload;
      let newNext = state.next;
      newNext[index] = id;
      return {
        ...state,
        next: newNext,
        isLoading: false,
      };
    case ADD_TIP_SUCCESS:
      suggestionIndex = state.suggestions.findIndex(
        (element) => element.prompter === action.payload.prompter
      );
      let newSuggestions = state.suggestions;
      newSuggestions[suggestionIndex] = action.payload.tips;
      return {
        ...state,
        suggestions: newSuggestions,
        isLoading: false,
      };
    case REMOVE_TIP_SUCCESS:
      suggestionIndex = state.suggestions.findIndex(
        (element) => element.prompter === action.payload.prompter
      );
      let removeSuggestions = state.suggestions;
      removeSuggestions[suggestionIndex].tips.splice(
        action.payload.tipIndex * 2,
        2
      );
      if (removeSuggestions[suggestionIndex].tips.length === 0) {
        removeSuggestions.splice(suggestionIndex, 1);
      }
      return {
        ...state,
        suggestions: removeSuggestions,
        isLoading: false,
      };
    case REMOVE_TIP_VIEWED_SUCCESS:
      suggestionIndex = state.suggestions.findIndex(
        (element) => element.prompter === action.payload.prompter
      );
      let removeViewedSuggestions = state.suggestions;
      removeViewedSuggestions[suggestionIndex].tips[
        action.payload.tipIndex * 2
      ] = false;
      return {
        ...state,
        suggestions: removeViewedSuggestions,
        isLoading: false,
      };
    case REMOVE_MOVIE_SUCCESS:
      const {movieIndexToRemove} = action.payload;
      let moviesForRemove = state.movies;
      let movieStarsForRemove = state.movieStars;
      moviesForRemove.splice(movieIndexToRemove, 1);
      movieStarsForRemove.splice(movieIndexToRemove, 1);
      return {
        ...state,
        movies: moviesForRemove,
        movieStars: movieStarsForRemove,
        isLoading: false,
      };
    case REMOVE_SERIE_SUCCESS:
      const {serieIndexToRemove} = action.payload;
      let seriesForRemove = state.series;
      let serieStarsForRemove = state.serieStars;
      seriesForRemove.splice(serieIndexToRemove, 1);
      serieStarsForRemove.splice(serieIndexToRemove, 1);
      return {
        ...state,
        series: seriesForRemove,
        serieStars: serieStarsForRemove,
        isLoading: false,
      };
    case REMOVE_NEXT_SUCCESS:
      const {indexToRemove} = action.payload;
      let nextForRemove = state.next;
      nextForRemove.splice(indexToRemove, 1);
      return {
        ...state,
        next: nextForRemove,
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
};
export default userReducer;
