import React, { Component } from 'react';
import { StoreProvider } from 'easy-peasy';
import { ConfigProvider, message } from 'antd';
import Wallet from './Wallet';
import store from './store';

class App extends Component {
  componentDidCatch(error, errorInfo) {
    message.error(error.message);
  }

  render() {
    return (
      <StoreProvider store={store}>
        <ConfigProvider>
          <Wallet />
        </ConfigProvider>
      </StoreProvider>
    );
  }
}

export default App;
