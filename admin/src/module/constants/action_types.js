import create from '../../utils/create_redux_promise_action_type';
const actionTypes = {
  CONFIG_FETCH: create('ISSUES_FETCH'),
  CONFIG_SET: create('CONFIG_SET'),
  CONFIG_CLEAR: 'CONFIG_CLEAR',
};

export default actionTypes;
