import { SET_LANGUAGE, TOGGLE_BACK, IS_BACK_VISIBLE, IS_WORLD_VISIBLE, SET_HOME_BAR, SET_OTHER_BAR, SET_MESSAGE, SET_IS_LOGGED, SET_DETAIL_BAR } from '../constants';
const initialState = {
    language: 'en-US',
    isBackButton: "true",
    backIs: false,
    worldIs: true,
    checkIs: false,
    popupMsg: null,
    isLogged: false,
    addMovieStar: true,
};

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload
            };
        case TOGGLE_BACK:
            return {
                ...state,
                isBackButton: !state.isBackButton
            };
        case IS_BACK_VISIBLE:
            return {
                ...state,
                backIs: action.payload
            };
        case IS_WORLD_VISIBLE:
            return {
                ...state,
                worldIs: action.payload
            };
        case SET_HOME_BAR:
            return {
                ...state,
                worldIs: true,
                backIs: false,
                checkIs: false
            };
        case SET_OTHER_BAR:
            return {
                ...state,
                worldIs: false,
                backIs: true,
                checkIs: false
            };
        case SET_DETAIL_BAR:
            return {
                ...state,
                worldIs: false,
                backIs: true,
                checkIs: true
            };
        case SET_MESSAGE:
            return {
                ...state,
                popupMsg: action.payload
            };
        case SET_IS_LOGGED:
            return {
                ...state,
                isLogged: action.payload
            };
        default:
            return state;
    }
}
export default generalReducer;