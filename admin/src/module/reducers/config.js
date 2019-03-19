import ActionTypes from '../constants/action_types';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.CONFIG_FETCH.FULFILLED:
      return action.payload;
    case ActionTypes.CONFIG_SET.FULFILLED:
      return action.payload;
    case ActionTypes.CONFIG_CLEAR:
      return {};
    default:
      return state;
  }
};
