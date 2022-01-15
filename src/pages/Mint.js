import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
List
} from 'reactstrap';



import formatter from '../common/utils/formatter';
import Stx from '../common/components/Stx';
import contractCall from '../common/utils/contractCall';
import {
  UserContext
} from '../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import ReadOnly from '../common/utils/readonly';
import GetPunk from '../common/components/GetPunk';
const is_open = (curr) => {
	
	let v = curr.mint_event?.value?.is_open?.value || false
	
	return v
}

const can_mint = (curr) => {
	let founds = (curr.balance?.value > (curr.mint_event?.value?.mint_price?.value || 0) ) || false
	return (founds && curr.can_mint_address?.value) || false
}

export default function Mint (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [loaded_full, setLoadedFull] = React.useState(false)
	const [current, setCurrent] = React.useState({})


	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [random_punk, setRandomPunk] = React.useState(null);
	const [claiming, setClaiming] = React.useState(false);
	const [claimed, setClaimed] = React.useState(false);

	React.useEffect(() => {
		if(!loaded) {
			setLoaded(true)
			// Update the document title using the browser API
		     ReadOnly.mintingResume([], UserState, (result) => {
		    	//console.log('result', result)
		    	setCurrent(result)
		    	setLoadedFull(true)
		    	callRandomPunk(result)

		    }, (err)=>setLoadedFull(true))

		}
	});
	
	const callRandomPunk = (el) => {

		if(parseInt(el.last_punk_id.value) > parseInt(el.last_nft_id.value) ){
			let first_i = parseInt(el.last_nft_id.value) +1;
			let last_i = parseInt(el.last_punk_id.value)
			let diff = parseInt(el.last_punk_id.value) - parseInt(el.last_nft_id.value);
			let rand = Math.floor(Math.random() * diff)
			
			setRandomPunk(parseInt(el.last_nft_id.value)+rand)
		}
		
	}
	return loaded_full ? <>
		<p style={{width: 400, margin: '10px auto', textAlign: 'center'}}><span>
		<Stx dim={18} style={{marginRight: 6}} /><b style={{fontSize: 12}}>(Balance)</b> <i style={{color: '#f82a5c', fontWeight: 'bold', fontStyle: 'normal'}}>{formatter.format_stx_integers(current.balance?.value || 0)}</i><br />
		{
			(!is_open(current))
			?
			<React.Fragment>
				<b>MINT CLOSED</b><br /> 
			</React.Fragment>
			: <React.Fragment>
				<Stx dim={18} style={{marginRight: 6}} />
				<b style={{fontSize: 12}}>Current MINT PRICE: </b> 
				<i style={{color: '#f82a5c', fontWeight: 'bold', fontStyle: 'normal'}}>
					{formatter.format_stx_integers(current.mint_event?.value?.mint_price?.value || 0)}</i>
				<br />
				<b>MAX MINT PER ADDRESS:</b> {current.mint_event?.value?.address_mint?.value}<br />
				<b>MINTED IN COLLECTION:</b> {current.last_nft_id?.value}/{current.last_punk_id?.value}<br />
			</React.Fragment>
		}
		</span>
		</p>
		{
			can_mint(current)
			?
			<div style={{marginTop: 12, textAlign: 'center'}}>
				{
					!claimed 
					?
					<Button color="danger" style={{color: '#fff'}} size="lg" className="mt-3" onClick={async () => {
	  					if(claiming) return;
			      		setClaiming(true)
			      		contractCall.mint({}, UserState, doContractCall, (result)=>{
			      			setClaiming(false)
			      			setClaimed(true)
			      			UserDispatch({
			      				type: 'add_transaction',
			      				tx: result
			      			})
			      		}, (result)=>{
			      			setClaiming(false)
			      			
			      			UserDispatch({
			      				type: 'add_transaction',
			      				tx: result
			      			})
			      		})
			      	}}>
						{claiming ? <Spinner color="#fff" size="sm" /> : <b>CLAIM YOUR PUNK</b>}
					</Button>
					:
					<><p style={{textAlign:'center'}}><b>PUNK CLAIMED</b></p>
					<Button color="primary" style={{color: '#fff'}} size="lg" className="mt-3" onClick={async () => {
	  					setClaimed(false)
			      	}}>
						<b>CLAIM ANOTHER PUNK</b>
					</Button>
					</>
				}
				
				{
					random_punk
					&& <div className="next-container">
						<p>This could be your next punk!</p>
						<GetPunk id={random_punk} />
					</div>
				}
			</div>
			: <Alert color="danger" style={{textAlign:'center'}}
			><b>Sorry</b> You cannot mint other punks :(</Alert>
		}
	</> : <Spinner color="primary" />
}