import React from 'react';
import { userSession, authOptions } from '../common/utils/auth';
import { Connect } from '@stacks/connect-react';
import {
  UserContext
} from '../store/UserContext';

import TweenOne from 'rc-tween-one';
import SignedIn from './SignedIn';
import SignIn from './SignIn';

import {Container, Row, Col} from 'reactstrap';
import Wrapper from '../common/components/Wrapper';
import {BsArrowUpCircle} from "react-icons/bs";
function Home(props) {
  
	

  const {UserState, UserDispatch} = React.useContext(UserContext)
  
  return (<Container>
  </Container>);
  
};

export default Wrapper({route: 'Home', 
  hasHeader: true
}, Home)