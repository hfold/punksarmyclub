import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
List,
Row, Col} from 'reactstrap';

import contractCall from '../common/utils/contractCall';
import {
  UserContext
} from '../store/UserContext';

import { useConnect } from "@stacks/connect-react";
import ReadOnly from '../common/utils/readonly';

import Wrapper from '../common/components/Wrapper';

import globals from '../common/utils/globals'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

import CodeEditor from '@uiw/react-textarea-code-editor';

const loadMempool = (address, contract_id, setTxs, old_txs, refresh) => {

	const function_names = ['empty_whitelist', 'add_multiple_addresses_to_mint_event','add_address_to_mint_event','remove_address_to_mint_event','has_multiple_whitelist']

	let ids = old_txs.map(t => t.tx_id);
	console.log('ids', ids)
	fetch(globals.STACKS_API_BASE_URL+"/extended/v1/address/"+
    	address
    	+"/mempool?limit=50&unanchored=true")
        .then(res => res.json())
        .then(
          async (result) => {
            console.log('-----------------MEMPOOL TRANSACTIONS------------------', result)
            let txs = []
            let new_ids = []
            await result.results.map(tx => {
            	if(tx.tx_type == 'contract_call' && 
            		tx.contract_call &&
            		tx.contract_call.contract_id == contract_id &&
            		function_names.indexOf(tx.contract_call.function_name) !== -1
            		) {
            		txs.push(tx)
            		console.log('metto transazione', tx)
            		new_ids[tx.tx_id] = true
            	} 
            })
            console.log('imposto nuove txs', txs)
            setTxs(txs)

            let same = true;
            
            await ids.map(i => {
            	if(!new_ids[i]) same = false;
            })
            console.log('is the same', same)
            if(!same) refresh()

          },
          (error) => {
            
          }
        )
  
}

function Whitelist (props) {
	const {doContractCall} = useConnect();

	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [can_add_multiple, setCanAddMultiple] = React.useState(false)
	const [multiple_addresses, setMultipleAddresses] = React.useState(false)
	const [address, setAddress] = React.useState('')
	const [_address, _setAddress] = React.useState('')

	const [adding, setAdding] = React.useState(false)
	const [removing, setRemoving] = React.useState(false)


	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [addresses, setAddresses] = React.useState([])

	let {collection} = useParams();
	const location = useLocation();

	const [txs, setTxs] = React.useState([]);


	const load_pool = () => loadMempool(
					UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
					globals.COLLECTIONS[collection].address+'.'+globals.COLLECTIONS[collection].ctr_name,
					setTxs,
					txs,
					getAddesses
				);

	const getAddesses = () => {
		if(loading) return;

		setLoading(true)
		ReadOnly.getWhiteListAddresses([], UserState, globals.COLLECTIONS[collection], (result) => {
				console.log('addresses', result);
				setAddresses(result)
				setLoaded(true)
				setLoading(false)

			}, (result) => {
				console.log('errore', result)
				setLoaded(true)
				setLoading(false)
			})
	}

	const canAddMultipleWhitelist = () => {
		if(loading) return;

		setLoading(true)
		ReadOnly.getCanAddMultipleWhitelist([], UserState, globals.COLLECTIONS[collection], (result) => {
				console.log('can_add_multiple', result);
				setCanAddMultiple(result)
			}, (result) => {
				console.log('errore can_add_multiple', result)
				setCanAddMultiple(false)
			})
	}


	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			

			getAddesses();
			canAddMultipleWhitelist();
			load_pool();

			let pool = setInterval(()=>load_pool(), 1000*5);
			return ()=>clearInterval(pool);

		}

	}, [collection, location]);	
	
	return <div>
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
		<Row>
		<Col md={12} lg={6}>	
			<div className="w_box">
				<p>Add <b>single</b> address to whitelist for mint events</p>
				<FormGroup floating>
					<Input value={address} id="add_address" onChange={(e)=>setAddress(e.target.value)} />
					<Label for="add_address">
				        STX Address
			      	</Label>
				</FormGroup>
				<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="lg" block 
				onClick={async () => {
			      		if(adding || address.length == '') return;

			      		setAdding(true)
			      		contractCall.addAddress({principal: address}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
			      			setAdding(false)
			      			setAddress('')
			      			load_pool();
			      		}, (result)=>{
			      			setAdding(false)
			      		})
			      	}}>
					{adding ? <Spinner size="sm" /> : <b>CONFIRM</b>}
				</Button>
			</div>
			{can_add_multiple ?
			<div className="w_box" style={{marginTop: 36}}>
				<p>Add <b>multiple</b> addresses to whitelist for mint events</p>
				<CodeEditor
			      value={multiple_addresses}
			      language="js"
			      placeholder={"Please enter a json list of principals (es. \n\t[\n\t\t\"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM\",\n\t\t\"ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5\"\n\t]\n)"}
			      onChange={(evn) => setMultipleAddresses(evn.target.value)}
			      padding={15}
			      minHeight={350}
			      style={{
			        backgroundColor: "#f5f5f5"
			      }}
			    />
				<Button id="confirm_add_multiple" color="primary" style={{color: '#fff', marginTop: 12}} className="mb-3" size="lg" block 
				onClick={async () => {

						let addresses = [];
						try {
							addresses = JSON.parse(multiple_addresses)
						} catch(e) {
							alert("Invalid addresses list");
							return;
						}

			      		if(adding || addresses.length == 0) return;

			      		setAdding(true)
			      		contractCall.addMultipleAddresses({list: addresses}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
			      			setAdding(false)
			      			setMultipleAddresses('')
			      			load_pool();
			      		}, (result)=>{
			      			setAdding(false)
			      		})
			      	}}>
					{adding ? <Spinner size="sm" /> : <b>CONFIRM</b>}
				</Button>
			</div> : null}
		</Col>
		<Col md={12} lg={6}>
			
			<h3 className="subtitle">Addresses</h3>
			<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => getAddesses()}>
					{loading ? <Spinner size="sm" /> : "Refresh"}
				</Button>
			{
				can_add_multiple ?
			<Button id="remove_all" color="danger" style={{color: '#fff', marginLeft: 12}} className="mb-3" size="xs" 
				onClick={async () => {
					contractCall.emptyAddresses({}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
			      			setRemoving(false)
			      			setMultipleAddresses('')
			      			load_pool();
			      		}, (result)=>{
			      			setRemoving(false)
			      		})
				}}>
					{removing ? <Spinner size="sm" /> : "Remove all"}
				</Button> : null}
			<List type="unstyled" className="addresses_list">
				{
					addresses.map((a,i,arr)=>{
						return <li key={"list_a_"+i} style={{color:'#a5a3a3'}}>
						<Button disabled={removing} close onClick={()=>{
							if(removing) return;

							setRemoving(true)
				      		contractCall.removeAddress({principal: a.value}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
				      			setRemoving(false)
				      			load_pool();

				      		}, (result)=>{
				      			setAdding(false)
				      		})
						}}/><span>{a.value}</span></li>
					})
				}
			</List>
		</Col>
	</Row>
	</div>
}


export default Wrapper({route: 'Whitelist', 
  hasHeader: true
}, Whitelist)