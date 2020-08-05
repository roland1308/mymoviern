import { ADD_USER_SUCCESS, ADD_USER_BEGIN, ADD_USER_FAILURE } from '../constants';
const initialState = {
    userName: null,
    language: null,
    loadingUser: false,
};

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USER_BEGIN:
            return {
                ...state,
                userName: null,
                language: null,
                loadingUser: true,
            };
        case ADD_USER_SUCCESS:
            const { userName, language } = action.payload
            return {
                ...state,
                userName,
                language,
                loadingUser: false,
            };
        case ADD_USER_FAILURE:
            return {
                ...state,
                userName: null,
                language: null,
                loadingUser: false,
            };
        default:
            return state;
    }
}
export default generalReducer;