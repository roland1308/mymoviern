import { ADD_USER_SUCCESS, ADD_USER_BEGIN, ADD_USER_FAILURE, SET_ISLOADING } from '../constants';
const initialState = {
    userName: null,
    language: null,
    isLoading: false,
};

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USER_BEGIN:
            return {
                ...state,
                userName: null,
                language: null,
                isLoading: true,
            };
        case ADD_USER_SUCCESS:
            const { userName, language } = action.payload
            return {
                ...state,
                userName,
                language,
                isLoading: false,
            };
        case ADD_USER_FAILURE:
            return {
                ...state,
                userName: null,
                language: null,
                isLoading: false,
            };
        case SET_ISLOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
}
export default generalReducer;