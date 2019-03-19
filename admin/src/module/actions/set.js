import axios from 'axios';
import ActionTypes from '../constants/action_types';

export default config => ({
  type: ActionTypes.CONFIG_SET.name,
  payload: axios.post('http://localhost:3001/', config).then(() => config),
});
