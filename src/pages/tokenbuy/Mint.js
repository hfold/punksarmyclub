import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
List,
Row, Col,
Carousel,
CarouselItem,
CarouselControl,
CarouselIndicators,
CarouselCaption,
} from 'reactstrap';

import { 
	cvToJSON
} from '@stacks/transactions';


import formatter from '../../common/utils/formatter';
import Stx from '../../common/components/Stx';
import tokenBuy from '../../common/utils/tokenBuy';
import {
  UserContext
} from '../../store/UserContext';

import globals from '../../common/utils/globals'
import {
  	useParams,
  	useLocation
} from "react-router-dom";
import MempoolTxs from '../../common/components/MempoolTxs';
import { useConnect } from "@stacks/connect-react";

import CurrencyInput from 'react-currency-input-field';
const getMintRealValue = (n) => parseInt(n*1000000)


const getCurrentUnitPrice = (current) => {
	return formatter.format_stx_integers(parseInt(current.mint_event?.value?.mint_price?.value) || 0) + " STX"
}

const getCurrentUnitPriceNumber = ( current ) => {
	return (parseInt(current.mint_event?.value?.mint_price?.value) || 0)
}

const max_to_mint = (current) => {
	if(current.mint_event?.value['max-token']?.value == 0) return 99999999999999;
	
	return parseInt(current.mint_event?.value['max-token']?.value || 0) - parseInt(current.minted_tokens?.value || 0)
}


const getBalance = (current) => {
	try {
		return formatter.format_stx_integers2_with_pow(current.balance?.value, 6) + " STX"
	} catch(e) {
		return "-"
	}
}

const is_open = (curr) => {
	let v = curr.mint_event?.value?.is_open?.value || false	
	return v
}

const has_stx = (curr, qty = 1) => {
	return (parseInt(curr.balance?.value || 0) > (parseInt(curr.mint_event?.value?.mint_price?.value || 0) * qty) ) || false
}

const can_mint_address = (curr) => {
	return curr.can_mint_address?.value || false
}

const are_enough_to_mint = (curr) => {
	return max_to_mint(curr) > 0
}

const can_mint = (curr) => {
	return (has_stx(curr) && can_mint_address(curr) && is_open(curr)) || false
}


const can_select_buy_option = (tokens, locked_stx) => {
	try {
		return tokens.length > 1 || (tokens.length > 0 && !locked_stx)
	} catch(e) {
		return false
	}
}



function Mint (props) {

	
	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [loaded_full, setLoadedFull] = React.useState(false)
	const [current, setCurrent] = React.useState({})


	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [has_avaible_multiple, setHasAvaibleMultiple] = React.useState(false);
	const [multiple_mint, setMultipleMint] = React.useState(1);
	const [random_punk, setRandomPunk] = React.useState(null);
	const [claiming, setClaiming] = React.useState(false);
	const [claimed, setClaimed] = React.useState(false);

	let {collection} = useParams();
	const location = useLocation();

	const [active_index, setActiveIndex] = React.useState(0);
	const [txs, setTxs] = React.useState([]);


	const [loading_minting_resume, setLoadingMintingResume] = React.useState(false)
	const loadMintingResume = () => {
		
		if(loading_minting_resume) return;
		setLoadingMintingResume(true)
		tokenBuy.mintingResume([], UserState, (result) => {
	    	console.log('mint resume result', result)
	    	setCurrent(result)
	    	setLoaded(true)
	    	setLoadingMintingResume(false)
	    	
	    }, (err)=>{
	    	setLoaded(true)
	    	setLoadingMintingResume(false)
	    })
	}

	const loadAvaibleMultipleMint = () => {
		if(loading) return;
		setHasAvaibleMultiple(true);
		setLoading(true)
	}
	
	React.useEffect(() => {
		setLoaded(false)
		
		loadMintingResume();
		loadAvaibleMultipleMint();
		
	}, [collection, location]);


	
	
	const returnMessageMintElement = () => {
		
		if(!are_enough_to_mint(current)) return <p className="text-danger">TOKENS ARE SOLD OUT</p>

		if(!is_open(current)) return <p className="text-danger">MINT IS CLOSED</p>

		if(!has_stx(current, 1)) return <p className="text-danger">YOU DO NOT HAVE ENOUGH STX</p>

		if(!can_mint_address(current)) return <p className="text-danger">SORRY YOU CANNOT MINT</p>

		return can_mint(current) 
			? <React.Fragment>
				{
					current.mint_event?.value['max-token']?.value
					?
					<p className="mint_price"> TOKEN ON SALE:<b> {
						parseInt(current.mint_event?.value['max-token']?.value) > 0
						? formatter.format_stx_integers2(current.mint_event?.value['max-token']?.value)
						: '∞'
						}</b>
					</p>
					: null
				}	
					<p>TOKENS STILL AVAILABLES: <b>{
							current.mint_event?.value['max-token']?.value > 0 ?
							formatter.format_stx_integers2( parseInt(current.mint_event?.value['max-token']?.value || 0) - parseInt(current.minted_tokens?.value || 0) )
							: '∞'
						} </b> </p>

					<p className="mint_price"> <h2> 1 STX = 143 ROMA </h2>
				{/* <b>{
					getCurrentUnitPrice(
						current
						) 
					}</b> */}
					</p>
				{
					has_avaible_multiple
					?
					<div className="w_box" style={{margin: '10px auto'}}>
						<FormGroup floating>
							<Input className="to-mint-input" 
							value={multiple_mint} 
							type="number" 
							id="max_mint" 
							min={1}
							style={{color: '#000'}}
							onBlur={(e)=>{
								let max = max_to_mint(current);
								if(parseInt(multiple_mint) < 1 || isNaN(multiple_mint)) {
									setMultipleMint(1);
								} else
									if((parseInt(multiple_mint) * 1000000) > max) {
										setMultipleMint(max/1000000)
								}
							}}
							onChange={(e)=>{
								setMultipleMint(parseInt(e.target.value))
							}} />
							<Label for="max_mint" style={{color: '#000'}}>
						        Select how much TOKEN to buy
					      	</Label>
						</FormGroup>
					</div>
					: null
				}
				{
					getCurrentUnitPriceNumber(
						current) > 0 ?
					<p className="big_text">TOTAL PRICE: {
						formatter.format_stx_integers ( getCurrentUnitPriceNumber(
							current
						) * multiple_mint )
					}</p>
					: <p className="big_text">FREE MINTING</p>
				}
				<Button color="danger" style={{color: '#fff'}} size="lg" className="mt-3" onClick={async () => {
					if(claiming) {
						console.log('claiming')
						return;
					}
		      		setClaiming(true)

			      	let to_add_value = getMintRealValue( multiple_mint );
			      	if(current.mint_event?.value['max-token']?.value > 0) {
			      		let max = max_to_mint(current);
			      		if(to_add_value > max) {
			      			to_add_value = max; 
			      		} else if(isNaN(to_add_value) || to_add_value < 1) {
		      				to_add_value = 1;
		      			}
		      		}

		      		tokenBuy.buy({amount: to_add_value}, 
		      			UserState, 
		      			getCurrentUnitPriceNumber(
							current
						) * multiple_mint, doContractCall, (result)=>{
		      			
		      			console.log('res mint', result)
		      			setClaiming(false)
		      			setClaimed(true)
		      			setMultipleMint(1);
		      			

		      		}, (result)=>{
		      			console.log('error', result)
		      			setClaiming(false)
		      			
		      		})
			      	
		      	}}>
					{claiming ? <Spinner color="#000" size="lg" /> : <b>BUY TOKEN</b>}
				</Button>
			</React.Fragment>
			: <p className="text-danger">SORRY YOU CANNOT MINT</p>
	}
	
	return loaded ? <>
		<div className="bg_black_el" style={{minHeight: 100}}>
			<Row>
				<Col lg={10} md={12} className="offset-lg-1 offset-md-0">
					<MempoolTxs functions={['buy']} contract={window.BUY_TOKEN_CTX} />
					<div className="event_container">
						<Button id="confirm_add" color="primary" style={{color: '#fff', margin: '12px auto', display: 'block'}} className="mb-3" size="xs" 
						onClick={async () => loadMintingResume()}>
							{loading_minting_resume ? <Spinner size="sm" /> : "Refresh"}
						</Button>
						{/* <p> STILL AVAILABLE TOKENS: <b>{
							current.mint_event?.value['max-token']?.value > 0 ?
							formatter.format_stx_integers2( parseInt(current.mint_event?.value['max-token']?.value || 0) - parseInt(current.minted_tokens?.value || 0) )
							: '∞'
						} </b> </p> */}
						{/* <p className="big_text"><Stx dim={36} style={{marginRight: 6}} /> BALANCE: <span className="currency">{getBalance(
						current) }</span></p> */}
						<div className="block_element" >
						{
							returnMessageMintElement(current)
						}
						</div>
					</div>
					
				</Col>
			</Row>
		</div>
	</> : <div style={{minHeight: 100, textAlign: 'center'}}><Spinner color="white" /></div>
}


export default Mint