import { createStore, combineReducers, applyMiddleware } from 'redux';
import generalReducer from './reducers/generalReducer';
import userReducer from './reducers/userReducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers(
    {
        general: generalReducer,
        user: userReducer
    }
);

const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(thunk));
}

export default configureStore;