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
  
  return (<Container>{
    UserState.logged 
    ? 
    <Row>
      
      <h3 className="call_to_action_choose_collection" style={{padding: 20}}>
        <TweenOne
          animation={{ 
            y: -5, 
            yoyo: true, 
            repeat: -1, 
            duration: 500
          }}
          paused={false}
          
          className="code-box-shape"
        ><BsArrowUpCircle /></TweenOne>
        <TweenOne
          animation={{ 
            y: -5, 
            yoyo: true, 
            repeat: -1, 
            duration: 500
          }}
          paused={false}
          
          className="code-box-shape"
        >
        Choose a collection
        </TweenOne>
        </h3>
    </Row>
    : <SignIn />}
    
  </Container>);
  
};

export default Wrapper({route: 'Home', 
  hasHeader: true
}, Home)