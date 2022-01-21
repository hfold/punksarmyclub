import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Card,
CardBody,
CardTitle,
CardSubtitle,
CardText,
Button, Spinner, Row, Col } from 'reactstrap';



import globals from '../common/utils/globals';
import {
  UserContext
} from '../store/UserContext';

import {
  	useParams,
  	useLocation
} from "react-router-dom";

import Wrapper from '../common/components/Wrapper';
import moment from 'moment';

const getDate = (str) => {
	return moment(str).format('YYYY.MM.DD HH:mm:ss')
}
const Transactions = (props) => {
	const {UserState, UserDispatch} = React.useContext(UserContext);
	const [loaded, setLoaded] = React.useState(false)
  	const [loading, setLoading] = React.useState(false)
  	const { doOpenAuth } = useConnect();

  	let {collection} = useParams();
	const location = useLocation();
  	const [txs, setTxs] = React.useState([])
  	const contract_id = globals.COLLECTIONS[collection].address+'.'+globals.COLLECTIONS[collection].ctr_name;
  	
  	const load = async () => {
		
		if(loading) return;

		setLoading(true)

	    fetch(globals.STACKS_API_BASE_URL+"/extended/v1/address/"+UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]+"/transactions?limit=50&unanchored=true")
	      .then(res => res.json())
	      .then(
	        (result) => {
	          setLoaded(true)

	          let list = [];
	          console.log('txs', result)
	          result.results.map(tx => {
	          	if(tx.tx_type == 'contract_call' && 
            		tx.contract_call &&
            		tx.contract_call.contract_id == contract_id 
            		) {
	          		console.log('metto transazione')
            		list.push(tx);
            	} 
	          })
	          setTxs(list)
	          setLoading(false)
	        },
	        (error) => {
	        	setLoaded(true)
	        	setLoading(false)
	        }
	      )
	    
	}

  	React.useEffect( () => {
		if(!loaded) {

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
  
  return <Row>
		<Col lg={6} md={12} className="offset-lg-3 offset-md-0">
		<h3 className="subtitle">RECENT TRANSACTIONS</h3>
		<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => load()}>
					{loading ? <Spinner size="sm" /> : "Refresh"}
				</Button>
		{(txs.map(tx => {
  	
		  	return <Card style={{marginBottom: 12, borderRadius: 5, background: '#fff', border: 'none'}} key={"tx_"+tx.tx_id}
			  >
			    <CardBody>
			      <CardTitle tag="h5">
			        {tx.tx_id}
			      </CardTitle>
			      <CardSubtitle
			        className="mb-2 text-muted"
			        tag="h6"
			      >
			        <span className={getSt(tx.tx_status)}>{tx.tx_status} {
			        	(tx.is_unanchored ? ' (unanchored)' : '')
			        }</span><br />{getDate(tx.parent_burn_block_time_iso)}
			      </CardSubtitle>
			      <CardText>
			        <b>{tx.contract_call.function_name}</b>
			      </CardText>
			    </CardBody>
			  </Card>}
		  ))}
		</Col>
	</Row>
};


export default Wrapper({route: 'Transactions', 
  hasHeader: true
}, Transactions)