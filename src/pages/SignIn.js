import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Button, Spinner } from 'reactstrap';
import {NotificationManager} from 'react-notifications';
const SignIn = (props) => {
  const [loading, setLoading] = React.useState(false)
  const { doOpenAuth } = useConnect();
  
  return (<div style={{textAlign: 'center'}}>
    <Button color="primary" className="main-btn" size="lg" 
    onClick={() => {
      //NotificationManager.info('ok');
      setLoading(true)
      doOpenAuth()
      setLoading(false)
    }}>{loading ? <Spinner /> : <b>Join the Army</b>}</Button>
    </div>);
};

export default SignIn;