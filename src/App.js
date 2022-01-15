import React from 'react';

import logo from './logo.svg';
import './App.scss';

import Main from './pages/Main';
import {
	UserContextProvider
} from './store/UserContext';


function App() {
  return (
    <div className="App">
      <UserContextProvider>
      	<Main />
      </UserContextProvider>
    </div>
  );
}

export default App;
