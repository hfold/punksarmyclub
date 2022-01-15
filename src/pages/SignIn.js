import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Button, Spinner } from 'reactstrap';

const SignIn = (props) => {
  const [loading, setLoading] = React.useState(false)
  const { doOpenAuth } = useConnect();
  
  return (<div style={{alignItems: 'center'}}>
    <h1 className="title">Punks Army NFT Club</h1>
    <Button color="primary" style={{color: '#fff', display: 'block', margin: '60px auto', textTransform: 'uppercase'}} size="lg" 
    onClick={() => {
      setLoading(true)
      doOpenAuth()
      setLoading(false)
    }}>{loading ? <Spinner /> : <b>Join the club</b>}</Button>
    </div>);
};

export default SignIn;