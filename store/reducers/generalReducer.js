import { SET_LANGUAGE, TOGGLE_BACK, IS_BACK_VISIBLE } from '../constants';
const initialState = {
    language: 'it',
    isBackButton: "true",
    backIs: "off",
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
        default:
            return state;
    }
}
export default generalReducer;