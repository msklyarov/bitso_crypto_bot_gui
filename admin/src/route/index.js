import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import fetchConfigAction from '../module/actions/fetch';
import setConfigAction from '../module/actions/set';
import clearConfigAction from '../module/actions/clear';

import EditComponent from './components/edit';

class EditContainer extends React.Component {
  componentDidMount() {
    this.props.fetchConfig();
  }

  componentWillUnmount() {
    this.props.clearConfig();
  }

  render() {
    console.log('this.props.config', this.props.config);

    return (
      <EditComponent config={this.props.config} onSave={this.props.setConfig} />
    );
  }
}

const select = (state, props) => ({
  config: state.config,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchConfig: fetchConfigAction,
      setConfig: setConfigAction,
      clearConfig: clearConfigAction,
    },
    dispatch,
  );

export default connect(
  select,
  mapDispatchToProps,
)(EditContainer);
