import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Card,
CardBody,
CardTitle,
CardSubtitle,
CardText,
List,
Button, Spinner, Row, Col } from 'reactstrap';

import globals from '../utils/globals';
import {
  UserContext
} from '../../store/UserContext';

import moment from 'moment';

const getDate = (str) => {
	return moment(str).format('YYYY.MM.DD HH:mm:ss')
}

const MempoolTxs = (props) => {
	const {UserState, UserDispatch} = React.useContext(UserContext);
	const [loaded, setLoaded] = React.useState(false)
  	const [loading, setLoading] = React.useState(false)
  	
  	const [txs, setTxs] = React.useState([])
  	const pagination = 50;
  	
  	
  	const load = async (cb = null) => {
		
		if(loading) {
			return;
		}

		setLoading(true)

		let url = globals.STACKS_API_BASE_URL+"/extended/v1/address/"+UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]+"/mempool?limit="+pagination;
		
	    fetch(url)
	      .then(res => res.json())
	      .then(
	        async (result) => {
	          
	          setLoaded(true)
	          console.log('mem', result)
	          let _txs = []
	          await result.results.map(tx => {
	            	if(tx.tx_type == 'contract_call' && 
	            		tx.contract_call &&
	            		tx.contract_call.contract_id == props.contract &&
	            		props.functions.indexOf(tx.contract_call.function_name) !== -1
	            		) {
	            		_txs.push(tx)	
	            	} 
	            	return tx
            	}) 

	          cb(_txs)
	          
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

			load((res)=>setTxs([...txs, ...res]))
		    
		}
	}, []);

	const getSt = (str) => {
		switch(str) {
			case 'success': return 'text-success';
			case 'error': case 'abort_by_response': return 'text-danger';
			default: return ''
		}
	}
  
  return <Row>
		<Col lg={12} md={12}>
		<h3 className="subtitle no-border">MEMPOOL TRANSACTIONS</h3>
		<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => {
					
					load((res)=>setTxs(res))
				}}>
					{loading ? <Spinner size="sm" /> : "Refresh"}
				</Button>
		{
			<List type="unstyled">
				{
					txs.map((a,i,arr)=>{
						return <li key={"list_a_"+i} style={{color:'#a5a3a3'}}>
							{a.tx_id}<br />
							<b>{a.contract_call.function_name}</b>
						</li>
					})
				}
			</List>
		}
		</Col>
	</Row>
};


export default MempoolTxs