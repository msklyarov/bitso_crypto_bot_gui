import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import * as reducers from './module/reducer';

const createRootReducer = () =>
  combineReducers({
    ...reducers,
  });

const baseMiddleware = [promiseMiddleware];

const middleware = [...baseMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(
  createRootReducer(),
  {},
  composeEnhancers(applyMiddleware(...middleware)),
);
