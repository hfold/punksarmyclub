import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Card,
CardBody,
CardTitle,
CardSubtitle,
CardText,
Button, Spinner } from 'reactstrap';



import globals from '../common/utils/globals';
import {
  UserContext
} from '../store/UserContext';

const Transactions = (props) => {
	const {UserState, UserDispatch} = React.useContext(UserContext);
	const [loaded, setLoaded] = React.useState(false)
  	const [loading, setLoading] = React.useState(false)
  	const { doOpenAuth } = useConnect();

  	React.useEffect( () => {
		if(!loaded) {

			const load = async () => {
				
			    fetch(globals.STACKS_API_BASE_URL+"/extended/v1/address/"+UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]+"/transactions?limit=50&unanchored=true")
			      .then(res => res.json())
			      .then(
			        (result) => {
			          setLoaded(true)
			          result.results.map(tx => UserDispatch({
			          	type: 'add_transaction',
			          	tx: tx
			          }))
			        },
			        (error) => {
			        	setLoaded(true)
			          //console.log('e', error)
			        }
			      )
			    
			}

			load()
		    
		}
	});

	const getSt = (str) => {
		switch(str) {
			case 'success': return 'text-success';
			case 'error': case 'abort_by_response': return 'text-danger';
			default: return ''
		}
	}
  
  return (UserState.txs.filter(el => el.tx_type === 'contract_call').map(tx => {
  	
  	return <Card style={{marginBottom: 12, borderRadius: 0}} key={"tx_"+tx.tx_id}
	  >
	    <CardBody>
	      <CardTitle tag="h5">
	        {tx.tx_id}
	      </CardTitle>
	      <CardSubtitle
	        className="mb-2 text-muted"
	        tag="h6"
	      >
	        <span className={getSt(tx.tx_status)}>{tx.tx_status}</span> {tx.parent_burn_block_time_iso}
	      </CardSubtitle>
	      <CardText>
	        <b>{tx.contract_call.function_name}</b>
	      </CardText>
	    </CardBody>
	  </Card>}
  ));
};

export default Transactions;