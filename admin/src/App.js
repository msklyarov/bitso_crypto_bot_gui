import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Edit from './route';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Edit />
        </div>
      </Provider>
    );
  }
}

export default App;
