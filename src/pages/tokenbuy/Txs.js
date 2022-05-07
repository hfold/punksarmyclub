import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Card,
CardBody,
CardTitle,
CardSubtitle,
CardText,
Button, Spinner, Row, Col } from 'reactstrap';



import globals from '../../common/utils/globals';
import {
  UserContext
} from '../../store/UserContext';

import {
  	useParams,
  	useLocation
} from "react-router-dom";

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
  	const contract_id = window.BUY_TOKEN_CTX;
  	
  	const pagination = 50;
  	const [has_new_page, setHasNewPage] = React.useState(true)
  	const [current_page, setCurrentPage] = React.useState(0)
  	const load = async (page = 1, cb = null) => {
		
		if(loading) {
			return;
		}

		setLoading(true)

		let limit = pagination * page;
		let offset = pagination * (page-1);
		let url = globals.STACKS_API_BASE_URL+"/extended/v1/address/"+window.BUY_TOKEN_CTX+"/transactions?limit="+pagination+"&unanchored=true";
		if(offset > 0) url += "&offset="+offset;

	    fetch(url)
	      .then(res => res.json())
	      .then(
	        (result) => {
	          setCurrentPage(page)
	          setLoaded(true)

	          let list = [];
	          console.log('txs', result)
	          if(result.results.length !== pagination) {
	          	setHasNewPage(false)
	          } else {
	          	setHasNewPage(true)
	          }

	          cb(result.results)
	          
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

			load(current_page+1, (res)=>setTxs([...txs, ...res]))
		    
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
		<h3 className="subtitle no-border">TRANSACTIONS</h3>
		<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => {
					
					await setTxs([])

					setTimeout(()=>load(1, (res)=>setTxs([...res]) ), 100)
				}}>
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
			        <b>{tx.tx_type}</b><br />
			        <b>{tx.contract_call?.function_name}</b>
			        {
			        	tx.contract_call
			        	?
			        	<>
			        		<h4 className="args_title">ARGS</h4>
			        		{tx.contract_call.function_args.map(f=>{
			        			return <p className="overflowed"><b>{f.name}:</b> {f.repr}</p>
			        		})}
			        	</>
			        	: null
			        }
			      </CardText>
			    </CardBody>
			  </Card>}
		  ))}
			{
				has_new_page && !loading
				?
				<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => load(current_page+1, (res)=>setTxs([...txs, ...res]))}>
					{loading ? <Spinner size="sm" /> : "LOAD MORE"}
				</Button>
				: null
			}
		</Col>
	</Row>
};


export default Transactions