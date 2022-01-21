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
  CarouselCaption
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
	return ((curr.balance?.value || 0) > (curr.mint_event?.value?.mint_price?.value || 0) ) || false
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

	const function_names = ['claim_punk']

	
	
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
	    	console.log('result', result)
	    	setCurrent(result)
	    	setLoaded(true)
	    	setLoading(false)
	    	//callRandomPunk(result)

	    }, (err)=>{
	    	setLoaded(true)
	    	setLoading(false)
	    })
	}

	React.useEffect(() => {
		setLoaded(false)
		
		loadMintingResume();

		load_pool();

		let pool = setInterval(()=>load_pool(), 1000*5);
		return ()=>clearInterval(pool);

	}, [collection, location]);


	const returnMessageMintElement = () => {
		if(!is_open(current)) return <p className="text-danger">MINT IS CLOSED</p>

		if(!has_stx(current)) return <p className="text-danger">YOU DO NOT HAVE ENOUGH STX TO MINT</p>

		if(!can_mint_address(current)) return <p className="text-danger">SORRY YOU CANNOT MINT</p>

		if(!are_enough_to_mint(current)) return <p className="text-danger">SORRY THERE ARE NO MORE NFTS TO MINT</p>

		return can_mint(current) 
			? <React.Fragment>
				<p>{parseInt(current.last_punk_id?.value || 0) - parseInt(current.last_nft_id?.value || 0)} LEFT</p>
				{
					formatter.format_stx_integers(current.mint_event?.value?.mint_price?.value || 0) > 0 ?
					<p className="mint_price">STX PRICE: {formatter.format_stx_integers(current.mint_event?.value?.mint_price?.value || 0)}</p>
					: <p className="mint_price">FREE MINTING</p>
				}
				<Button color="danger" style={{color: '#fff'}} size="lg" className="mt-3" onClick={async () => {
					if(claiming) {
						console.log('claiming')
						return;
					}
		      		setClaiming(true)
		      		contractCall.mint({}, UserState, globals.COLLECTIONS[collection], (current.mint_event?.value?.mint_price?.value || 0), doContractCall, (result)=>{
		      			
		      			console.log('res mint', result)
		      			setClaiming(false)
		      			setClaimed(true)
		      			load_pool();

		      		}, (result)=>{
		      			console.log('error', result)
		      			setClaiming(false)
		      			
		      		})
		      	}}>
					{claiming ? <Spinner color="#000" size="lg" /> : <b>CLAIM YOUR PUNK</b>}
				</Button>
			</React.Fragment>
			: <p className="text-danger">SORRY YOU CANNOT MINT</p>
	}
	
	return loaded ? <>
		<div className="bg_black_el">
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
						<p className="big_text"><Stx dim={36} style={{marginRight: 6}} /> <b>BALANCE: <span className="currency">{formatter.format_stx_integers(current.balance?.value || 0)}</span></b></p>
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
	</> : <Spinner color="primary" />
}


export default Wrapper({route: 'Mint', 
  hasHeader: true
}, Mint)