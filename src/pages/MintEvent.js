import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
List
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


export default function MintEvent (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [current, setCurrent] = React.useState(null)


	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [is_open, setIsOpen] = React.useState(false)
	
	const [stx, setStx] = React.useState(0.00)
	const [_private, setPrivate] = React.useState(0)
	const [addrm, setAddrm] = React.useState(0)

	const [adding, setAdding] = React.useState(false)
	const [removing, setRemoving] = React.useState(false)

	React.useEffect(() => {
		if(!loaded) {

			// Update the document title using the browser API
		     ReadOnly.isOpenMinting([], UserState, (result) => {
		    	
		    	
		    	setIsOpen(result)
		    	if(result) {
		    		ReadOnly.currentMintEvent([], UserState, (result) => {
		    			//console.log('event', result);
		    			setLoaded(true)
		    			setCurrent(result)

		    		}, (result) => {
		    			setLoaded(true)
		    		})
		    		
		    	} else {
		    		setLoaded(true)
		    	}
		    })

		}
	});
	
	return loaded ? <>{!is_open ? <>
		<h3>Open mint event</h3>
		<p>Fill in the form and confirm opening</p>
		<FormGroup floating>
			<CurrencyInput className="form-control" id="fee" value={stx} onValueChange={(value, name) => {
				//console.log('value', value); 
				setStx(value)
			}} />
			{/*<Input value={stx} type="number" id="fee" onChange={(e)=>setStx(e.target.value)} />*/}
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
		<Button id="confirm_open" color="primary" style={{color: '#fff'}} className="mb-3" size="md" onClick={async () => null}>
			{adding ? <Spinner size="sm" /> : <b>Confirm</b>}
		</Button>

		<UncontrolledPopover
		    placement="bottom"
		    target="confirm_open"
		    trigger="focus"
		  >
		    <PopoverBody>
		      Are you sure to add this address?<br />
		      	<Button color="primary" style={{color: '#fff'}} className="mb-3" size="sm" onClick={async () => {
		      		

		      		let full_value = ""
		      		let value = stx.split(",");
		      		//console.log('splitted', value)

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
		      		contractCall.openMintEvent({mint_price: stx_full_value, public_value: _private, address_mint: addrm}, UserState, doContractCall, (result)=>{
		      			
		      			setAdding(false)
		      			UserDispatch({
		      				type: 'add_transaction',
		      				tx: result
		      			})
		      			setIsOpen(true)
		      		}, (result)=>{
		      			setAdding(false)
		      			UserDispatch({
		      				type: 'add_transaction',
		      				tx: result
		      			})
		      		})
		      	}}>
					{adding ? <Spinner size="sm" /> : 'Yes'}
				</Button>
		    </PopoverBody>
	  	</UncontrolledPopover>
	  	</> : <>
	  		{
	  			current ? <>
	  				<h3>#{current.id?.value}</h3>
	  				<p><span style={{fontSize: 46}}>
	  				<Stx dim={40} style={{marginRight: 6}} />
	  				<b>STX:</b> <i style={{color: '#f82a5c', fontWeight: 'bold', fontStyle: 'normal'}}>{formatter.format_stx_integers(current.mint_price.value)}</i></span><br />
	  					<b>Public:</b> {parseInt(current.public_value.value) === 0 ? 'NO' : 'YES'}
	  				</p>
	  				<Button color="danger" style={{color: '#fff'}} className="mt-3" onClick={async () => {
	  					if(removing) return;
			      		setRemoving(true)
			      		contractCall.closeMintEvent({}, UserState, doContractCall, (result)=>{
			      			setRemoving(false)
			      			UserDispatch({
			      				type: 'add_transaction',
			      				tx: result
			      			})
			      			setIsOpen(false)
			      		}, (result)=>{
			      			setRemoving(false)
			      			UserDispatch({
			      				type: 'add_transaction',
			      				tx: result
			      			})
			      		})
			      	}}>
						{removing ? <Spinner size="sm" /> : 'Close event'}
					</Button>
	  			</>
	  			: <>
	  			<Alert
				    color="primary"
				  >
				    Maybe a mint event is coming
				  </Alert>
	  			</>
	  		}
	  	</>}
	</> : <Spinner color="primary" />
}