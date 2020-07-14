import { createStore, combineReducers } from 'redux';
import generalReducer from './reducers/generalReducer';
const rootReducer = combineReducers(
    { general: generalReducer }
);
const configureStore = () => {
    return createStore(rootReducer);
}
export default configureStore;