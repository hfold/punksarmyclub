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


import Wrapper from '../common/components/Wrapper';

import formatter from '../common/utils/formatter';
import Stx from '../common/components/Stx';
import contractCall from '../common/utils/contractCall';
import {
  UserContext
} from '../store/UserContext';

import globals from '../common/utils/globals'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

import ReadOnly from '../common/utils/readonly';
import { useConnect } from "@stacks/connect-react";
import GetPunk from '../common/components/GetPunk';
import GetPunkByMetadata from '../common/components/GetPunkByMetadata';
import ReactSlidy from 'react-slidy'


const is_open = (curr) => {
	let v = curr.mint_event?.value?.is_open?.value || false	
	return v
}

const has_stx = (curr) => {
	return (parseInt(curr.balance?.value || 0) > parseInt(curr.mint_event?.value?.mint_price?.value || 0) ) || false
}

const can_mint_address = (curr) => {
	return curr.can_mint_address?.value || false
}

const are_enough_to_mint = (curr) => {
	return parseInt(curr.last_nft_id?.value) < parseInt(curr.last_punk_id?.value) || false
}

const can_mint = (curr) => {
	return (has_stx(curr) && can_mint_address(curr) && is_open(curr)) || false
}





const getGalleryElements = (collection) => {
	return (globals.COLLECTIONS[collection]?.gallery || [])
}



const loadMempool = (address, contract_id, setTxs, old_txs) => {

	const function_names = ['claim_punk', 'claim_multiple']

	
	
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

	const load_pool = () => loadMempool(
		UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
		globals.COLLECTIONS[collection].address+'.'+globals.COLLECTIONS[collection].ctr_name,
		setTxs,
		txs
	);

	const loadMintingResume = () => {
		if(loading) return;
		setLoading(true)
		ReadOnly.mintingResume([], UserState, globals.COLLECTIONS[collection],  (result) => {
	    	console.log('mint resume result', result)
	    	setCurrent(result)
	    	setLoaded(true)
	    	setLoading(false)
	    	
	    }, (err)=>{
	    	setLoaded(true)
	    	setLoading(false)
	    })
	}

	const loadAvaibleMultipleMint = () => {
		if(loading) return;
		setLoading(true)
		ReadOnly.hasAvaibleMultipleMint([], UserState, globals.COLLECTIONS[collection],  (result) => {
	    	console.log('multi result', result)
	    	setHasAvaibleMultiple(result)
	    	
	    }, (err)=>{
	    	console.log('err multi', err)
	    	setHasAvaibleMultiple(false)
	    })
	}

	React.useEffect(() => {
		setLoaded(false)
		
		loadMintingResume();
		loadAvaibleMultipleMint();

		load_pool();

		let pool = setInterval(()=>load_pool(), 1000*5);
		return ()=>clearInterval(pool);

	}, [collection, location]);

	const getStxMultiplier = (price) => {
		return multiple_mint ? price * multiple_mint : price
	}

	const max_to_mint = () => {
		let avaible_punks = parseInt(current.last_punk_id.value) - parseInt(current.last_nft_id.value);
		let minted_punks = parseInt(current.minted_tokens?.value || 0)
		let addr_mint = parseInt(current.mint_event?.value.address_mint?.value) == 0 ? 100 : parseInt(current.mint_event?.value.address_mint?.value)

		let val = addr_mint - minted_punks;
		if(avaible_punks < val) val = avaible_punks;
		return val <= 100 ? val : 100
	}

	const collection_name = globals.COLLECTIONS[collection].ctr_name 

	const returnMessageMintElement = () => {
		
		if(collection_name == 'Punks-Army-Friends-NFTs' && !are_enough_to_mint(current) && current.last_nft_id?.value && current.last_nft_id?.value > 0) return <p className="text-danger">{globals.COLLECTIONS[collection].name} <br></br> ARE SOLD OUT </p>
		if(!are_enough_to_mint(current) && current.last_nft_id?.value && current.last_nft_id?.value > 0) return <p className="text-danger">{globals.COLLECTIONS[collection].name} ARE SOLD OUT {parseInt(current.last_nft_id?.value || 0)}/{parseInt(current.last_nft_id?.value || 0)}</p>

		if(!is_open(current)) return <p className="text-danger">MINT IS CLOSED</p>

		if(!has_stx(current)) return <p className="text-danger">YOU DO NOT HAVE ENOUGH STX TO MINT</p>

		if(!can_mint_address(current)) return <p className="text-danger">SORRY YOU CANNOT MINT</p>

		if(!are_enough_to_mint(current)) return <p className="text-danger">THERE ARE NO MORE NFT TO MINT</p>		

		return can_mint(current) 
			? <React.Fragment>
				<p className="mint_price"> UNIT PRICE: <b>{
					formatter.format_stx_integers2(current.mint_event?.value?.mint_price?.value || 0) 
					} STX</b></p>
				<p className="mint_price"> MAX NFTs ALLOWED FOR WALLET:<b> {
					parseInt(current.mint_event?.value.address_mint?.value) > 0
					? current.mint_event?.value.address_mint?.value
					: '∞'
					}</b></p>
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
								let max = max_to_mint();
								if(parseInt(multiple_mint) < 1 || isNaN(multiple_mint)) {
									setMultipleMint(1);
								} else
									if(parseInt(multiple_mint) > max) {
										setMultipleMint(max)
								}
							}}
							onChange={(e)=>{
								setMultipleMint(parseInt(e.target.value))
							}} />
							<Label for="max_mint" style={{color: '#000'}}>
						        Select how much NFTs to mint
					      	</Label>
						</FormGroup>
					</div>
					: null
				}
				{
					formatter.format_stx_integers(current.mint_event?.value?.mint_price?.value || 0) > 0 ?
					<p className="big_text">TOTAL PRICE: {
						getStxMultiplier( 
							formatter.format_stx_integers(current.mint_event?.value?.mint_price?.value || 0)
						)
					} STX</p>
					: <p className="big_text">FREE MINTING</p>
				}
				<Button color="danger" style={{color: '#fff'}} size="lg" className="mt-3" onClick={async () => {
					if(claiming) {
						console.log('claiming')
						return;
					}
		      		setClaiming(true)
		      		if(multiple_mint && multiple_mint > 1) {
			      		
			      		let max = max_to_mint();
			      		let to_add_value = multiple_mint;
			      		if(to_add_value > max) {
			      			to_add_value = max; 
			      		} else 
			      			if(isNaN(to_add_value) || to_add_value < 1) {
			      				to_add_value = 1;
			      			}

			      		contractCall.mintMultiple({amount: to_add_value}, UserState, globals.COLLECTIONS[collection], (current.mint_event?.value?.mint_price?.value || 0), doContractCall, (result)=>{
			      			
			      			console.log('res mint', result)
			      			setClaiming(false)
			      			setClaimed(true)
			      			setMultipleMint(1);
			      			load_pool();

			      		}, (result)=>{
			      			console.log('error', result)
			      			setClaiming(false)
			      			
			      		})
			      	} else {
			      		contractCall.mint({}, UserState, globals.COLLECTIONS[collection], (current.mint_event?.value?.mint_price?.value || 0), doContractCall, (result)=>{
			      			
			      			console.log('res mint', result)
			      			setClaiming(false)
			      			setClaimed(true)
			      			load_pool();

			      		}, (result)=>{
			      			console.log('error', result)
			      			setClaiming(false)
			      			
			      		})
			      	}
		      	}}>
					{claiming ? <Spinner color="#000" size="lg" /> : <b>CLAIM YOUR NFT</b>}
				</Button>
			</React.Fragment>
			: <p className="text-danger">SORRY YOU CANNOT MINT</p>
	}
	
	return loaded ? <>
		<div className="bg_black_el" style={{minHeight: 100}}>
			<Row>
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
					<div className="event_container">
						{/*<Button id="confirm_add" color="primary" style={{color: '#fff', margin: '12px auto', display: 'block'}} className="mb-3" size="xs" 
						onClick={async () => {
							contractCall.gift({}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
		      			
				      			console.log('res gift', result)
				      			
				      		}, (result)=>{
				      			console.log('error', result)
				      		})
						}}>
							{loading ? <Spinner size="sm" /> : "GIFT"}
						</Button>*/}
						<Button id="confirm_add" color="primary" style={{color: '#fff', margin: '12px auto', display: 'block'}} className="mb-3" size="xs" 
						onClick={async () => loadMintingResume()}>
							{loading ? <Spinner size="sm" /> : "Refresh"}
						</Button>
						<p>NFTs REMAINING: <b>{parseInt(current.last_punk_id?.value || 0) - parseInt(current.last_nft_id?.value || 0)} </b> </p>
						<p className="big_text"><Stx dim={36} style={{marginRight: 6}} /> BALANCE: <span className="currency">{formatter.format_stx_integers(current.balance?.value || 0)}</span></p>
						<div className="block_element" >
						{
							returnMessageMintElement(current)
						}
						</div>
					</div>
					<div style={{marginTop: 24}}>
						<Carousel 
						getChildContext={null}
						next={()=>{
							active_index == (getGalleryElements(collection).length - 1) ? 0 : active_index+1
						}}
	        			previous={()=>{
	        				active_index > 0 ? (active_index-1) : (getGalleryElements(collection).length-1)
	        			}}
						activeIndex={active_index}>
						{
							getGalleryElements(collection).map((gallery_element, i, a)=>{
								return <CarouselItem key={"car_"+i}>
									<GetPunkByMetadata  metadata_url={gallery_element} />
								</CarouselItem>
							})
						}
						<CarouselIndicators 
							items={getGalleryElements(collection)} 
							activeIndex={active_index} 
							onClickHandler={(i)=>setActiveIndex(i)} />
						</Carousel>
					</div>
				</Col>
			</Row>
		</div>
	</> : <div style={{minHeight: 100, textAlign: 'center'}}><Spinner color="white" /></div>
}


export default Wrapper({route: 'Mint', 
  hasHeader: true
}, Mint)