import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
List,
Row, Col} from 'reactstrap';

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

import CodeEditor from '@uiw/react-textarea-code-editor';
import MempoolTxs from '../../common/components/MempoolTxs';

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



	const getAddesses = () => {
		if(loading) return;

		setLoading(true)
		tokenBuy.getWhiteListAddresses([], UserState, (result) => {
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
		setCanAddMultiple(true)
	}


	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)

			getAddesses();
			canAddMultipleWhitelist();

		}

	}, [collection, location]);	
	
	return <div>
		<Col sm={12}>
			<MempoolTxs functions={['empty_whitelist', 'add_multiple_addresses_to_mint_event','add_address_to_mint_event','remove_address_to_mint_event','has_multiple_whitelist']} contract={window.BUY_TOKEN_CTX} />
		</Col>
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
			      		tokenBuy.addAddress({principal: address}, UserState, doContractCall, (result)=>{
			      			setAdding(false)
			      			setAddress('')
			      			
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
			      		tokenBuy.addMultipleAddresses({list: addresses}, UserState, doContractCall, (result)=>{
			      			setAdding(false)
			      			setMultipleAddresses('')
			      			
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
					tokenBuy.emptyAddresses({}, UserState, doContractCall, (result)=>{
			      			setRemoving(false)
			      			setMultipleAddresses('')
			      			
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
				      		tokenBuy.removeAddress({principal: a.value}, UserState, doContractCall, (result)=>{
				      			setRemoving(false)
				      			

				      		}, (result)=>{
				      			setRemoving(false)
				      		})
						}}/><span>{a.value}</span></li>
					})
				}
			</List>
		</Col>
	</Row>
	</div>
}


export default Whitelist