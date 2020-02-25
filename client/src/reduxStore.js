import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import mainReducer from './reducers/mainReducer';
import lessonListReducer from './reducers/lessonListReducer';

const reducers = combineReducers({
    main: mainReducer,
    lesson: lessonListReducer,
});

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

window.store = store;

export default store;