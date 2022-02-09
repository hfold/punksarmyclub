import React from 'react';

import logo from './logo.svg';
import './App.scss';
import 'react-slidy/lib/index.scss'

import Main from './pages/Main';
import {
	UserContextProvider
} from './store/UserContext';
import {
  CacheContextProvider
} from './store/CacheContext';
import {NotificationContainer} from 'react-notifications';

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.debug = () => {}
}

function App() {
  return (
    <div className="App">
      <CacheContextProvider>
      <UserContextProvider>
      	<Main />
      </UserContextProvider>
      </CacheContextProvider>
      <NotificationContainer/>
    </div>
  );
}

export default App;
