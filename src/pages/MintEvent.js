import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
List,
Row, Col
} from 'reactstrap';


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

	const function_names = ['open_mint_event', 'close_mint_event','edit_mint_event']

	
	
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


function MintEvent (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [current, setCurrent] = React.useState(null)
	
	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [is_open, setIsOpen] = React.useState(false)
	
	const [stx, setStx] = React.useState(0.00)
	const [_private, setPrivate] = React.useState(0)
	const [addrm, setAddrm] = React.useState(0)

	const [adding, setAdding] = React.useState(false)
	const [removing, setRemoving] = React.useState(false)

	let {collection} = useParams();
	const location = useLocation();
	const [txs, setTxs] = React.useState([]);

	const load_pool = () => loadMempool(
		UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
		globals.COLLECTIONS[collection].address+'.'+globals.COLLECTIONS[collection].ctr_name,
		setTxs,
		txs
	);

	const loadCurrentEvent = () => {
		if(loading) return;
		
		setLoading(true)
		ReadOnly.currentMintEvent([], UserState, globals.COLLECTIONS[collection], (result) => {
			console.log('-------------EVENT------------', result)

			if(!loaded) setLoaded(true)

			console.log('current', result)
			setCurrent(result)
			setIsOpen(result.is_open.value)
			console.log('open')
			setStx( parseFloat(result.mint_price.value/1000000).toFixed(2) )
			console.log('stx')
			setPrivate(parseInt(result.public_value.value))
			console.log('private')
			setAddrm(parseInt(result.address_mint.value) )
			console.log('addrm')
	    	
	    	setLoading(false)

	    }, (err) => {
	    	if(!loaded) setLoaded(true)
	    	setIsOpen(false)
	    	setLoading(false)
	    })
	}

	React.useEffect(() => {
		
		loadCurrentEvent();
		load_pool();
		let pool = setInterval(()=>load_pool(), 1000*5);
		return ()=>clearInterval(pool);

	}, [collection, location]);	

	
	
	return loaded ? <><Row>
			<Col lg={6} md={12} className="offset-lg-3 offset-md-0">
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
				onClick={async () => loadCurrentEvent()}>
					{loading ? <Spinner size="sm" /> : "Refresh"}
				</Button>
				{
		  			current && current.is_open.value ? <div className="bg_black_el">
		  				<h3>#{current.id?.value}</h3>
		  				<p><span style={{fontSize: 46}}>
		  				<Stx dim={40} style={{marginRight: 6}} />
		  				<b>STX:</b> <span className="currency">{formatter.format_stx_integers(current.mint_price.value)}</span></span><br />
		  					<b>Public:</b> {parseInt(current.public_value.value) === 0 ? 'NO' : 'YES'}<br />
		  					<b>Max per address:</b> {parseInt(current.address_mint.value)}
		  				</p>
		  				<Button color="danger" style={{color: '#fff'}} className="mt-3" size="lg" onClick={async () => {
		  					if(removing) return;
				      		setRemoving(true)
				      		contractCall.closeMintEvent({}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
				      			setRemoving(false)
				      			
				      			load_pool();
				      		}, (result)=>{
				      			setRemoving(false)
				      		})
				      	}}>
							{removing ? <Spinner size="sm" /> : <b>CLOSE EVENT</b>}
						</Button>
		  			</div>
		  			: null
		  		}
		  		<div style={{height: 24, width: '100%'}}></div>
				<h3 className="subtitle">{!is_open ? "Open mint event" : "Edit mint event"}</h3>
				<div className="w_box">
					<p>Fill in the form and confirm</p>
					<FormGroup floating>
						<CurrencyInput 
						decimalSeparator="." groupSeparator=","
						className="form-control" id="fee" value={stx} onValueChange={(value, name) => {
							setStx(value)
						}} />
						<Label for="fee">
					        STX Fee
				      	</Label>
					</FormGroup>
					
					<FormGroup floating>
						<Input type="select" value={_private} id="import" onChange={(e)=>setPrivate(e.target.value)}>
							<option value="1">
					        	Public
					      	</option>
					      	<option value="0">
					        	Private
					      	</option>
				      	</Input>
						<Label for="import">
					        Public/Private
				      	</Label>
					</FormGroup>

					<FormGroup floating>
						<Input value={addrm} type="number" id="max_mint" onChange={(e)=>setAddrm(e.target.value)} />
						<Label for="max_mint">
					        MAX mint per address
				      	</Label>
					</FormGroup>
					<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
					className="mb-3" size="lg" onClick={async () => {
					      		

					      		let full_value = ""
					      		let _stx = stx || "0";
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
					      		

					      		let stx_full_value = parseInt(full_value*10000)
					      		
					      		if(adding) return;
					      		setAdding(true)

					      		let fn = 'openMintEvent';
					      		if(is_open) fn = 'editMintEvent'
					      		
					      		contractCall[fn](
					      			{mint_price: stx_full_value, public_value: _private, address_mint: addrm}, 
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
		</Row>
	</> : <Spinner color="primary" />
}



export default Wrapper({route: 'MintEvent', 
  hasHeader: true
}, MintEvent)