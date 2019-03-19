import axios from 'axios';
import ActionTypes from '../constants/action_types';

export default (filter, page) => ({
  type: ActionTypes.CONFIG_FETCH.name,
  payload: axios.get('http://localhost:3001/').then(response => response.data),
});
