import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
List,
Row, Col
} from 'reactstrap';


import {  
	
	cvToJSON
} from '@stacks/transactions';
import NumberFormat from 'react-number-format';
import CurrencyInput from 'react-currency-input-field';

import Stx from '../common/components/Stx';
import contractCall from '../common/utils/contractCall';
import {
  UserContext
} from '../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import ReadOnly from '../common/utils/readonly';
import formatter from '../common/utils/formatter';

import Wrapper from '../common/components/Wrapper';
import globals from '../common/utils/globals'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

const loadMempool = (address, contract_id, setTxs, old_txs) => {

	const function_names = ['set-token-price', 'remove-token-price', 'set-lock-stx-acquire', 'set-stx-price']

	
	
	fetch(globals.STACKS_API_BASE_URL+"/extended/v1/address/"+
    	address
    	+"/mempool?limit=50&unanchored=true")
        .then(res => res.json())
        .then(
          async (result) => {
            console.log('-----------------MEMPOOL TRANSACTIONS------------------', result)
            let txs = []
            
            await result.results.map(tx => {
            	if(tx.tx_type == 'contract_call' && 
            		tx.contract_call &&
            		tx.contract_call.contract_id == contract_id &&
            		function_names.indexOf(tx.contract_call.function_name) !== -1
            		) {
            		txs.push(tx)
            		
            	} 
            })
            setTxs(txs)

          },
          (error) => {
            
          }
        )
  
}


function Tokens (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [current, setCurrent] = React.useState(null)
	
	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [is_open, setIsOpen] = React.useState(false)
	
	const [locked_stx_buy, setLockedStxBuy] = React.useState(false)
	const [locking, setLocking] = React.useState(false)

	const [price, setPrice] = React.useState(0.00)
	const [tkn_contract, setTknContract] = React.useState('')
	const [tkn_name, setTknName] = React.useState('')

	const [stx_price, setStxPrice] = React.useState(0.00)

	const [adding, setAdding] = React.useState(false)
	const [removing, setRemoving] = React.useState(false)

	let {collection} = useParams();
	const location = useLocation();
	const [txs, setTxs] = React.useState([]);

	const [tokens, setTokens] = React.useState([])

	const load_pool = () => loadMempool(
		UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
		globals.COLLECTIONS[collection].address+'.'+globals.COLLECTIONS[collection].ctr_name,
		setTxs,
		txs
	);

	const loadAvaibleTokens = () => {
		if(loading) return;
		
		setLoading(true)
		ReadOnly.getAvaibleTokens({}, UserState, globals.COLLECTIONS[collection], (result) => {
			console.log('-------------TOKENS------------', result)

			if(!loaded) setLoaded(true)

			console.log('tkns', result)
			setTokens(result)
			
	    	setLoading(false)

	    }, (err) => {
	    	if(!loaded) setLoaded(true)
	    	setIsOpen(false)
	    	setLoading(false)
	    })

	    ReadOnly.mintingResume([], UserState, globals.COLLECTIONS[collection], (result) => {
			console.log('-------------EVENT DATA------------', result)

			console.log('Mint event', result)
			if(result['stx-price']) {
				setStxPrice( (result['stx-price'].value / 1000000) || 0.00)
			}
			
			console.log(result['locked-stx-buy'].value)
			setLockedStxBuy(result['locked-stx-buy'].value || false)
	    	
	    }, (err) => {
	    	
	    })
	}

	React.useEffect(() => {
		
		loadAvaibleTokens();
		load_pool();
		let pool = setInterval(()=>load_pool(), 1000*5);
		return ()=>clearInterval(pool);

	}, [collection, location]);	

	
	
	return loaded ? <><Row>
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
				<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => loadAvaibleTokens()}>
					{loading ? <Spinner size="sm" /> : "Refresh"}
				</Button>
				
		  		<div style={{height: 24, width: '100%'}}></div>
		  		<h3 className="subtitle">SET STX PRICE</h3>
		  		<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
					className="mb-3" size="lg" onClick={async () => {
					      	
							if(locking) return;
				      		setLocking(true)

				      		contractCall.setLockStxAcquire(
				      			{
				      				lock: !locked_stx_buy
				      			}, 
				      			UserState, 
				      			globals.COLLECTIONS[collection], 
				      			doContractCall, (result)=>{
				      			
				      			setLocking(false)
				      			load_pool();

				      		}, (result)=>{
				      			setLocking(false)
				      			
				      		})

				      	}}>
					{locking ? <Spinner size="sm" /> : <b>{locked_stx_buy ? 'ENABLE STX BUY' : 'DISABLE STX BUY'}</b>}
				</Button>
		  		<div className="w_box">
					<p>Fill in the form and confirm</p>
					
					<FormGroup floating>
						<CurrencyInput 
						decimalSeparator="." groupSeparator=","
						className="form-control" id="fee" value={stx_price} onValueChange={(value, name) => {
							setStxPrice(value)
						}} />
						<Label for="fee">
					        STX Fee
				      	</Label>
					</FormGroup>
					<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
					className="mb-3" size="lg" onClick={async () => {
					      		
					      		let full_value = ""
					      		let _stx = stx_price || "0";
					      		let value = _stx.split(".");
					      		console.log('splitted', value)

					      		full_value += String(value[0]);
					      		if(value[1]) {
					      			let decimals = String(value[1]);
					      			if(decimals.length == 1) decimals += "0";
					      		
					      			full_value += decimals
					      		} else {
					      			full_value += "00";
					      		}
						      		

						      	let	stx_full_value = parseInt(full_value*10000)
						      	

								if(adding) return;
					      		setAdding(true)

					      		contractCall.setStxPrice(
					      			{
					      				amount: stx_full_value
					      			}, 
					      			UserState, 
					      			globals.COLLECTIONS[collection], 
					      			doContractCall, (result)=>{
					      			
					      			setAdding(false)
					      			load_pool();

					      		}, (result)=>{
					      			setAdding(false)
					      			
					      		})

					      	}}>
						{adding ? <Spinner size="sm" /> : <b>Confirm</b>}
					</Button>
				</div>
				<h3 className="subtitle" style={{marginTop: 42}}>SET TOKEN PRICE</h3>
				<div className="w_box">
					<p>Fill in the form and confirm</p>
					
					<FormGroup floating>
						<Input value={price} type="number" id="price" onChange={(e)=>setPrice(e.target.value)} />
						<Label for="max_mint">
					        UNIT PRICE (set full value with all decimals)
				      	</Label>
					</FormGroup>

					<FormGroup floating>
						<Input value={tkn_contract} type="text" id="ctx" onChange={(e)=>setTknContract(e.target.value)} />
						<Label for="max_mint">
					        Token contract
				      	</Label>
					</FormGroup>
					<FormGroup floating>
						<Input value={tkn_name} type="text" id="name" onChange={(e)=>setTknName(e.target.value)} />
						<Label for="max_mint">
					        Token name
				      	</Label>
					</FormGroup>
					<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
					className="mb-3" size="lg" onClick={async () => {
					      		
								if(adding) return;
					      		setAdding(true)

					      		contractCall.setTokenPrice(
					      			{
					      				tokenContract: tkn_contract, 
					      				amount: price, 
					      				tokenName: tkn_name
					      			}, 
					      			UserState, 
					      			globals.COLLECTIONS[collection], 
					      			doContractCall, (result)=>{
					      			
					      			setAdding(false)
					      			load_pool();

					      		}, (result)=>{
					      			setAdding(false)
					      			
					      		})

					      	}}>
						{adding ? <Spinner size="sm" /> : <b>Confirm</b>}
					</Button>
				</div>
			</Col>
			<Col lg={6} md={12} className="">
				<h3 className="subtitle">AVAIBLE TOKENS</h3>
				<List type="unstyled" className="addresses_list">
				{
					tokens.map((a,i,arr)=>{
						console.log('TOKEN', a)
						return <li key={"list_a_"+i} style={{color:'#a5a3a3'}}>
						<Button disabled={removing} close onClick={()=>{
							console.log(cvToJSON(a))
							if(removing) return;

							let obj = cvToJSON(a)
							setRemoving(true)
				      		contractCall.removeTokenPrice({tokenContract: obj.value.value['token-contract'].value}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
				      			setRemoving(false)
				      			load_pool();

				      		}, (result)=>{
				      			setRemoving(false)
				      		})
						}}/><span>{a.value.data['token-name'].data}: {parseInt(a.value.data['amount'].value)}</span></li>
					})
				}
			</List>
			</Col>
		</Row>
	</> : <Spinner color="primary" />
}



export default Wrapper({route: 'Tokens', 
  hasHeader: true
}, Tokens)