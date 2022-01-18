import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
List} from 'reactstrap';

import contractCall from '../common/utils/contractCall';
import {
  UserContext
} from '../store/UserContext';

import { useConnect } from "@stacks/connect-react";
import ReadOnly from '../common/utils/readonly';

const addAddress = (address, UserState) => {}

const removeAddress = (address, UserState) => {}



export default function Whitelist (props) {
	const {doContractCall} = useConnect();

	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [address, setAddress] = React.useState('')
	const [_address, _setAddress] = React.useState('')

	const [adding, setAdding] = React.useState(false)
	const [removing, setRemoving] = React.useState(false)


	const [loaded, setLoaded] = React.useState(false)
	const [addresses, setAddresses] = React.useState([])
	React.useEffect(() => {
		if(!loaded) {
			console.log('carico indirizzi')
			setLoaded(true)
			ReadOnly.getWhiteListAddresses([], UserState, (result) => {
				console.log('addresses', result);
				setAddresses(result)

			}, (result) => {
				
			})

		}
	});	
	
	return <>
		<h3>Add address in whitelist</h3>
		<p>Add an address to whitelist for mint events</p>
		<FormGroup floating>
			<Input value={address} id="add_address" onChange={(e)=>setAddress(e.target.value)} />
			<Label for="add_address">
		        STX Address
	      	</Label>
		</FormGroup>
		<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="md" 
		onClick={async () => null}>
			{adding ? <Spinner size="sm" /> : <b>Confirm</b>}
		</Button>
		

		<hr />

		{/*<h3 className="mt-3">Remove address from whitelist</h3>
		<p>Remove an address to whitelist for mint events</p>
		<FormGroup floating>
			<Input value={_address} id="remove_address" onChange={(e)=>_setAddress(e.target.value)} />
			<Label for="remove_address">
		        STX Address
	      	</Label>
		</FormGroup>
		<Button id="confirm_remove" color="danger" style={{color: '#fff'}} onClick={async () => null}>
			{removing ? <Spinner size="sm" /> : <b>Confirm</b>}
		</Button>*/}

		<div style={{marginTop: 48}}>
			<h3>Addresses</h3>
			<List type="unstyled">
				{
					addresses.map((a,i,arr)=>{
						return <li key={"list_a_"+i} style={{color:'#a5a3a3'}}><Button disabled={removing} close onClick={()=>{
							if(removing) return;

							setRemoving(true)
				      		contractCall.removeAddress({principal: a.value}, UserState, doContractCall, (result)=>{
				      			setRemoving(false)
				      			UserDispatch({
				      				type: 'add_transaction',
				      				tx: result
				      			})
				      		}, (result)=>{
				      			setAdding(false)
				      			UserDispatch({
				      				type: 'add_transaction',
				      				tx: result
				      			})
				      		})
						}}/> {a.value}</li>
					})
				}
			</List>
		</div>


		<UncontrolledPopover
		    placement="bottom"
		    target="confirm_add"
		    trigger="focus"
		  >
		    <PopoverBody>
		      Are you sure to add this address?<br />
		      	<Button color="primary" style={{color: '#fff'}} className="mb-3" size="sm" onClick={async () => {
		      		if(adding || address.length == '') return;

		      		setAdding(true)
		      		contractCall.addAddress({principal: address}, UserState, doContractCall, (result)=>{
		      			setAdding(false)
		      			UserDispatch({
		      				type: 'add_transaction',
		      				tx: result
		      			})
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
	  	{/*<UncontrolledPopover
		    placement="bottom"
		    target="confirm_remove"
		    trigger="focus"
		  >
		    <PopoverBody>
		      Are you sure to remove this address?<br />
		      <Button color="primary" style={{color: '#fff'}} className="mb-3" size="sm" onClick={async () => {
		      		setRemoving(true)
		      		contractCall.removeAddress({principal: _address}, UserState, doContractCall, (result)=>{
		      			setRemoving(false)
		      			UserDispatch({
		      				type: 'add_transaction',
		      				tx: result
		      			})
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
	  	</UncontrolledPopover>*/}
	</>
}