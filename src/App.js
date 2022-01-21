import React from 'react';

import logo from './logo.svg';
import './App.scss';
import 'react-slidy/lib/index.scss'

import Main from './pages/Main';
import {
	UserContextProvider
} from './store/UserContext';
import {NotificationContainer} from 'react-notifications';


function App() {
  return (
    <div className="App">
      <UserContextProvider>
      	<Main />
      </UserContextProvider>
      <NotificationContainer/>
    </div>
  );
}

export default App;
