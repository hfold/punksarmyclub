import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
Row,
Col,
List
} from 'reactstrap';

import CodeEditor from '@uiw/react-textarea-code-editor';

import {
  UserContext
} from '../../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import tokenBuy from '../../common/utils/tokenBuy';



import globals from '../../common/utils/globals'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

import MempoolTxs from '../../common/components/MempoolTxs';


function AddCommissionCtx (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [json_val, setJsonVal] = React.useState('')


	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	
	const [adding, setAdding] = React.useState(false)

	const [total_to_add, setTotalToAdd] = React.useState(0)
	const [added, setAdded] = React.useState(0)

	let {collection} = useParams();
	const location = useLocation();
	const [txs, setTxs] = React.useState([]);
	const [raddress, setRAddress] = React.useState('')
	const [removing, setRemoving] = React.useState(false)

	const [commission_percentage, setCommissionPercentage] = React.useState(0)
	const [commission_addresses_list, setCommissionAddressesList] = React.useState([])

	const addCommissionCtx = (current_i, chunk, full_array, percentage) => {

		let last_index = (current_i + chunk);
		let list = full_array.slice(current_i, last_index);

		if(list.length > 0) {
	   
			tokenBuy.addCommissionCtx({list: list, amount: percentage}, UserState, doContractCall, (result)=>{
	  			
	  			setAdded(last_index)
	  			
	  			if(full_array.length > ( last_index - 1 )) {
	  				setTimeout(()=>addCommissionCtx(last_index, chunk, full_array, percentage), 500)
	  			} else {
	  				setAdding(false)
	  			}

	  			

	  		}, (result)=>{
	  			setAdding(false)

	  			
	  		})
		} else {
			setAdding(false)
		}
	}

	const loadCommissionAddresses = ()=>{
		tokenBuy.getCommissionAddresses([], UserState, (result)=>{
			setCommissionAddressesList(result)
		})
	}
	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			loadCommissionAddresses()
			
		}

	}, [collection, location]);	

	return <div>
		
		<Row>
		<Col sm={12}>
			<MempoolTxs functions={['add-address-to-commission']} contract={window.BUY_TOKEN_CTX} />
		</Col>
		<Col lg={6} md={12} className="">
		{
			txs.length > 0 && <div className="pending">
				<h3 className="subtitle">Pending transactions</h3>
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
			</div>
		}
		<h3 className="subtitle">Add commission contracts</h3>
		<p style={{color: '#fff'}}>Copy and paste a json array in the editor and then call the function</p>
		{adding ? <>
			<p>Process: {added}/{total_to_add}</p>
			</> : <CodeEditor
			      value={json_val}
			      language="js"
			      placeholder={`Please enter a json list of metadata_url (es. 
	[
		"address1", "address2"
	]
)
			      	`}
			      onChange={(evn) => setJsonVal(evn.target.value)}
			      padding={15}
			      minHeight={350}
			      style={{
			        backgroundColor: "#f5f5f5"
			      }}
			    />}
		<div style={{marginTop: 24}}>
			<FormGroup floating>
				<Input value={commission_percentage} type="number" id="max_mint" onChange={(e)=>setCommissionPercentage(e.target.value)} />
				<Label for="max_mint">
			        Commission percentage
		      	</Label>
			</FormGroup>
		</div>
		<Button color="primary" block style={{color: '#fff'}} className="mt-3" size="lg" onClick={async () => {
			if(adding) return;

			let values = JSON.parse(json_val)
			setTotalToAdd(values.length)
			setAdding(true)
			addCommissionCtx(0, 200, values, commission_percentage);
      		
      	}}>
			{adding ? <Spinner size="sm" /> : <b>CONFIRM AND ADD LIST</b>}
		</Button>
		
		
	  </Col>
	  <Col lg={6} md={6} sm={12}>
			<h3 className="subtitle no-border">Remove commission addresses</h3>
			<FormGroup floating style={{marginTop: 24}}>
				<Input value={raddress} id="add_address" onChange={(e)=>setRAddress(e.target.value)} />
				<Label for="add_address">
			        Address
		      	</Label>
			</FormGroup>
			<Button color="primary" block style={{color: '#fff'}} className="mt-3" size="lg" onClick={async () => {
				if(removing) return;

				
				setRemoving(true)
				
				tokenBuy.removeCommissionAddress(
					{ address: raddress },
					UserState,
					doContractCall,
					(res)=>{
						setRemoving(false)
						setRAddress("")
					},
					(err) => {
						setRemoving(false)
					}
				)
	      		
	      	}}>
				{removing ? <Spinner size="sm" /> : <b>CONFIRM AND REMOVE</b>}
			</Button>
			<div style={{marginTop: 56}}>
				<List type="unstyled" className="">
					{
						commission_addresses_list.map((a,i,arr)=>{
							return <li key={"list_a_"+i} style={{color:'#a5a3a3'}}>
							<span>{a.value}</span></li>
						})
					}
				</List>
			</div>
	  	</Col>
	</Row> 
	</div>
}



export default AddCommissionCtx