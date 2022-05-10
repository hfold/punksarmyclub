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
  	useLocation,
  	useHistory
} from "react-router-dom";

import ReadOnly from '../common/utils/readonly';
import { useConnect } from "@stacks/connect-react";
import GetPunk from '../common/components/GetPunk';
import GetPunkByMetadata from '../common/components/GetPunkByMetadata';
import ReactSlidy from 'react-slidy'

const getCurrentUnitPrice = (collection, current, tokens = [], token_decimals = {}, current_selected_buy_option = null, multiplier = 1) => {
	//console.log('tokens units', tokens, token_decimals, current_selected_buy_option)
	try {
		if(globals.COLLECTIONS[collection].is_extended) {
			if(current_selected_buy_option == 'STACKS'){
				// get stx price from mint_event
				return formatter.format_stx_integers2((parseInt(current['stx-price'].value) || 0) * multiplier ) + " STX"
			} else {
				//console.log('PARSO TOKEN', current_selected_buy_option)
				let selected_token = tokens.find(t => t.tokenContract === current_selected_buy_option)
				if(!selected_token){
					//console.log('NOT FOUND TOKEN', tokens, current_selected_buy_option)
					return 0
				} else {
					//console.log('DECIMALS', selected_token.tokenContract, token_decimals, token_decimals[selected_token.tokenContract])
					return formatter.format_stx_integers2_with_pow(
						(parseInt(selected_token.amount || 0) * multiplier), 
						token_decimals[selected_token.tokenContract] || 0) + " " + selected_token.tokenName
				}
			}
		} else {
			return formatter.format_stx_integers2(parseInt(current.mint_event?.value?.mint_price?.value || 0) * multiplier) + " STX"
		}
	} catch(e) {
		return "-"
	}
}

const getCurrentUnitPriceNumber = (collection, current, tokens = [], token_decimals = {}, current_selected_buy_option = null, multiplier = 1) => {
	try {
		if(globals.COLLECTIONS[collection].is_extended) {
			if(current_selected_buy_option == 'STACKS'){
				// get stx price from mint_event
				return (parseInt(current['stx-price'].value) || 0) * multiplier
			} else {
				let selected_token = tokens.find(t => t.tokenContract === current_selected_buy_option)
				if(!selected_token){
					return 0
				} else {
					return (parseInt(selected_token.amount || 0) * multiplier)
				}
			}
		} else {
			return parseInt(current.mint_event?.value?.mint_price?.value || 0) * multiplier
		}
	} catch(e) {
		console.log('e', e)
		return "-"
	}
}



const getBalance = (collection, current, tokens = [], token_decimals = {}, current_selected_buy_option = null, token_balance = 1) => {
	console.log('tokens units', tokens, current_selected_buy_option)
	try {
		if(globals.COLLECTIONS[collection].is_extended) {
			if(current_selected_buy_option == 'STACKS'){
				// get stx price from mint_event
				return formatter.format_stx_integers2_with_pow(current.balance?.value, 6) + " STX"
			} else {
				let selected_token = tokens.find(t => t.tokenContract === current_selected_buy_option)
				if(!selected_token){
					return 0
				} else {
					return formatter.format_stx_integers2_with_pow(
						parseInt(token_balance[selected_token.tokenContract] || 0), 
						token_decimals[selected_token.tokenContract] || 0) + " " + selected_token.tokenName
				}
			}
		} else {
			return formatter.format_stx_integers2_with_pow(current.balance?.value, 6) + " STX"
		}
	} catch(e) {
		return "-"
	}
}

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


const can_select_buy_option = (tokens, locked_stx) => {
	try {
		return tokens.length > 1 || (tokens.length > 0 && !locked_stx)
	} catch(e) {
		return false
	}
}


const getGalleryElements = (collection) => {
	return (globals.COLLECTIONS[collection]?.gallery || [])
}



const loadMempool = (address, contract_id, setTxs, old_txs) => {

	const function_names = ['claim_punk', 'claim_multiple', 'buy_package', 'buy_package_with_token', 'claim_multiple_with_token', 'claim_punk_with_token']

	
	
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

const getMax = (v) => {
	return v > 1000 ? 1000 : v
}


function Mint (props) {

	const history = useHistory();
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

	// only for extended
	const [avaible_stacks_buy, setAvaibleStacksBuy] = React.useState(false)
	const [current_selected_buy_option, setCurrentSelectedBuyOption] = React.useState(null);
	const [loading_minting_resume, setLoadingMintingResume] = React.useState(false)
	const loadMintingResume = () => {
		if(loading_minting_resume) return;
		setLoadingMintingResume(true)
		ReadOnly.mintingResume([], UserState, globals.COLLECTIONS[collection],  (result) => {
	    	console.log('mint resume result', result)
	    	setCurrent(result)
	    	setLoaded(true)
	    	setLoadingMintingResume(false)

	    	if(globals.COLLECTIONS[collection].is_extended){
	    		// load tokens and set if avaible stx buy
	    		console.log('IS LOCKED STX', result['locked-stx-buy'], result['locked-stx-buy'].value)
	    		if(!result['locked-stx-buy'].value) {
	    			setCurrentSelectedBuyOption('STACKS');
	    			setAvaibleStacksBuy(true)
	    			loadTokens();
	    		} else {
	    			loadTokens(true);
	    		}
	    	}
	    	
	    }, (err)=>{
	    	setLoaded(true)
	    	setLoadingMintingResume(false)
	    })
	}

	const loadAvaibleMultipleMint = () => {
		if(loading) return;
		setLoading(true)
		ReadOnly.hasAvaibleMultipleMint([], UserState, globals.COLLECTIONS[collection],  (result) => {
	    	console.log('multi result', result)
	    	if(!loaded) setLoaded(true)

	    	setLoading(false)
	    	setHasAvaibleMultiple(result && !globals.COLLECTIONS[collection].hide_multiple)
	    	
	    }, (err)=>{
	    	console.log('err multi', err)
	    	setLoading(false)
	    	setHasAvaibleMultiple(false)
	    })
	}

	
	const [packages, setPackages] = React.useState([]);
	const [loading_packages, setLoadingPackages] = React.useState(false)
	const loadPackages = () => {

		if(!globals.COLLECTIONS[collection].is_extended) return;

		if(loading_packages) return;
		setLoadingPackages(true)
		ReadOnly.getPackages({}, UserState, globals.COLLECTIONS[collection], (result) => {
			setPackages(result.value)
			setLoadingPackages(false)
	    }, (err) => {
	    	setLoadingPackages(false)
	    })
	}

	const [tokens, setTokens] = React.useState([])
	const [token_decimals, setTokenDecimals] = React.useState({})
	const [token_balance, setTokenBalance] = React.useState({})
	const [loading_tokens, setLoadingTokens] = React.useState()


	const getTokenData = async (a) => {
		return new Promise(async (resolve, reject)=>{
			console.log('TOKEN', cvToJSON(a))
			let t = cvToJSON(a);

			// get token decimals
			console.log('prendo valore decimali', t.value.value['token-contract'].value)
			
			let decimals = await ReadOnly.getTokenDecimals({ctx: t.value.value['token-contract'].value}, UserState, globals.COLLECTIONS[collection])
			let balance = await ReadOnly.getTokenBalance({ctx: t.value.value['token-contract'].value}, UserState, globals.COLLECTIONS[collection])

			resolve({
				tokenContract: t.value.value['token-contract'].value,
				decimals: decimals.value.value,
				balance: balance.value.value,
				tokenName: t.value.value['token-name'].value,
				amount: t.value.value['amount'].value
			})
		})
	}

	const loadTokens = (select_first = false) => {
		if(loading_tokens) return;
		
		setLoadingTokens(true)
		ReadOnly.getAvaibleTokens({}, UserState, globals.COLLECTIONS[collection], async (result) => {
			

			let tkn_decimals_list = {}
			let tkn_balance_list = {}

			let vals = []
			for(let i = 0; i < result.length; i++) {

				let dt = await getTokenData(result[i])
				vals.push(dt)

				tkn_balance_list[cvToJSON(result[i]).value.value['token-contract'].value] = parseInt(dt.balance)
				tkn_decimals_list[cvToJSON(result[i]).value.value['token-contract'].value] = parseInt(dt.decimals)
				
			}
			

			console.log('tkns', vals)
			
			setTokens( vals )
			setTokenBalance(tkn_balance_list)
			setTokenDecimals(tkn_decimals_list)

			if(select_first) setCurrentSelectedBuyOption(vals[0].tokenContract)
			
	    	setLoadingTokens(false)

	    }, (err) => {
	    	
	    	setLoadingTokens(false)
	    })
	}

	React.useEffect(() => {
		setLoaded(false)
		
		loadMintingResume();
		loadAvaibleMultipleMint();
		loadPackages();
		

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
		
		if(collection_name == 'Punks-Army-Friends-NFTs' && !are_enough_to_mint(current) && current.last_nft_id?.value && current.last_nft_id?.value > 0) return <p className="text-danger big-text">{globals.COLLECTIONS[collection].name} <br></br> ARE SOLD OUT </p>
		if(!are_enough_to_mint(current) && current.last_nft_id?.value && current.last_nft_id?.value > 0) return <p className="text-danger big-text">{globals.COLLECTIONS[collection].name} ARE SOLD OUT {getMax( parseInt(current.last_nft_id?.value || 0 ) )}/{ getMax( parseInt(current.last_nft_id?.value || 0 ) )}</p>

		if(!is_open(current)) return <p className="text-danger big-text">MINT IS CLOSED</p>

		if(!has_stx(current)) return <p className="text-danger big-text">YOU DO NOT HAVE ENOUGH STX TO MINT</p>

		if(!can_mint_address(current)) return <p className="text-danger big-text">SORRY YOU CANNOT MINT</p>

		if(!are_enough_to_mint(current)) return <p className="text-danger big-text">THERE ARE NO MORE NFT TO MINT</p>		

		return can_mint(current) 
			? <React.Fragment>
				
				{
					has_avaible_multiple
					?
					<div className="w_box multiple_mint_select" style={{margin: '10px auto'}}>
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

				<div className="mint_block">
					<Row>
						<Col xs={4}>
							<span className="number">{
								getCurrentUnitPrice(
									collection, 
									current, 
									tokens,
									token_decimals,
									current_selected_buy_option) 
								}</span>
							<span className="txt">UNIT PRICE</span>
						</Col>
						<Col xs={4}>
							<span className="number">{
								parseInt(current.mint_event?.value.address_mint?.value) > 0
								? current.mint_event?.value.address_mint?.value
								: '∞'
								}</span>
							<span className="txt">MAX ALLOWED</span>
						</Col>
						<Col xs={4}>
							<span className="number">{parseInt(current.last_punk_id?.value || 0) - parseInt(current.last_nft_id?.value || 0)}</span>
							<span className="txt">REMAINING Nfts</span>
						</Col>
					</Row>
					<Row>
						<Col sm={12}>
						{!globals.COLLECTIONS[collection].hide_single_mint ? <Button color="danger" style={{color: '#fff'}} size="lg" className="mt-3" onClick={async () => {
							if(claiming) {
								console.log('claiming')
								return;
							}
				      		setClaiming(true)

				      		let tkn = null;
				      		if(current_selected_buy_option != 'STX'){
				      			let selected_token = tokens.find(t => t.tokenContract === current_selected_buy_option)
				      			tkn = selected_token
				      		}


				      		if(multiple_mint && multiple_mint > 1) {
					      		
					      		let max = max_to_mint();
					      		let to_add_value = multiple_mint;
					      		if(to_add_value > max) {
					      			to_add_value = max; 
					      		} else 
					      			if(isNaN(to_add_value) || to_add_value < 1) {
					      				to_add_value = 1;
					      			}

					      		contractCall.mintMultiple({amount: to_add_value, token: tkn}, 
					      			UserState, 
					      			globals.COLLECTIONS[collection], 
					      			getCurrentUnitPriceNumber(
										collection, 
										current, 
										tokens,
										token_decimals,
										current_selected_buy_option,
										1
									), doContractCall, (result)=>{
					      			
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
					      		contractCall.mint({token: tkn}, UserState, globals.COLLECTIONS[collection], 
					      			getCurrentUnitPriceNumber(
										collection, 
										current, 
										tokens,
										token_decimals,
										current_selected_buy_option,
										1
									), doContractCall, (result)=>{
					      			
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
							{claiming ? <Spinner color="#000" size="lg" /> : <b>MINT {
							getCurrentUnitPriceNumber(
								collection, 
								current, 
								tokens,
								token_decimals,
								current_selected_buy_option) > 0 ?
								getCurrentUnitPrice(
									collection, 
									current, 
									tokens,
									token_decimals,
									current_selected_buy_option,
									multiple_mint || 1
								)
							: 'FREE'
						}</b>}
						</Button>: null
						}
						</Col>
					</Row>
				</div>
				
				
				<div className="package_list">
				<Row>
				{
					packages.sort((a,b) => a.value.order > b.value.order ? -1 : 1).map((a,i,arr)=>{
						return <Col sm={12} md={6} key={"pack_"+i} style={{marginTop: 12}}>
							<div className="w_box">
								<h3 style={{color: '#000'}}>#{a.value.id.value}</h3>
								<p>NFT YOU GET: {a.value.nftget.value}<br />
								NFT YOU PAY: {a.value.nftpaid.value}<br />
								QTY LEFT: {a.value.qty.value - a.value.bought.value}</p>
								<p><b style={{color: '#000'}}>PRICE:</b> {getCurrentUnitPrice(
																collection, 
																current, 
																tokens,
																token_decimals,
																current_selected_buy_option,
																a.value.nftpaid.value
															)}</p>
								{
									(parseInt(a.value.qty.value) - parseInt(a.value.bought.value)) <= 0
									? <p className="text-danger" style={{fontSize: 12, lineHeight: '45px'}}>NOT AVAIBLE</p>
									: (
										(parseInt(current.last_punk_id.value) - parseInt(current.last_nft_id.value) < a.value.nftget.value)
										? <p className="text-danger" style={{fontSize: 12, lineHeight: '45px'}}>NOT ENOUGH NFTs</p>
										: (<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
											className="mb-3" size="lg" onClick={async () => {
											      		
														if(claiming) return;
											      		setClaiming(true)

											      		let tkn = null;
											      		if(current_selected_buy_option != 'STX'){
											      			let selected_token = tokens.find(t => t.tokenContract === current_selected_buy_option)
											      			tkn = selected_token
											      		}

											      		contractCall.buyPackage(
											      			{
											      				id: a.value.id.value,
											      				token: tkn,
											      				amount: a.value.nftget.value
											      			}, 
											      			UserState, 
											      			globals.COLLECTIONS[collection],
											      			getCurrentUnitPriceNumber(
																collection, 
																current, 
																tokens,
																token_decimals,
																current_selected_buy_option,
																a.value.nftpaid.value
															), 
											      			doContractCall, (result)=>{
											      			
											      			setClaiming(false);

											      		}, (result)=>{
											      			setClaiming(false);
											      			
											      		})

											      	}}>
												{claiming ? <Spinner size="sm" /> : <b>SELECT</b>}
											</Button>)
									)
								}
								
							</div>
						</Col>
					})
				}
				</Row>
				</div>
			</React.Fragment>
			: <p className="text-danger">SORRY YOU CANNOT MINT</p>
	}
	
	return loaded ? <>
		<div className="bg_black_el" style={{minHeight: 100}}>
			<Row>
				<Col lg={10} md={12} className="offset-lg-1 offset-md-0">
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
						<Col sm={12}>
							<Button id="confirm_add" color="primary" style={{color: '#fff', margin: '12px auto', display: 'block'}} className="mb-3" size="xs" 
							onClick={async () => loadMintingResume()}>
								{loading ? <Spinner size="sm" /> : "Refresh"}
							</Button>
							{
								current && current['locked-stx-buy'] && can_mint(current) && can_select_buy_option(tokens, current['locked-stx-buy'].value)
								?
								<div className="buy_options" style={{textAlign: 'center'}}>
									<b className="tit">SELECT BUY OPTIONS</b><br />
									{
										!current['locked-stx-buy'].value
										? <span className={current_selected_buy_option == 'STACKS' ? "selectable selected" : "selectable"} onClick={()=>setCurrentSelectedBuyOption("STACKS")}>STX</span> : null
									}
									{
										tokens.map((t,i,a) => {
											return <span key={"tkn_"+i} className={current_selected_buy_option == t.tokenContract ? "selectable selected" : "selectable"}
											onClick={()=>{
												console.log('CURRENT DECIMALS', token_decimals, token_balance)
												setCurrentSelectedBuyOption(t.tokenContract)
											}}>{t.tokenName}</span>
										})
									}
									{
										window.BUY_TOKEN_MAIN_TOKEN_CTX && window.BUY_TOKEN_MAIN_TOKEN_CTX === current_selected_buy_option
										?
										<div style={{textAlign: 'center'}}>
										<Button color="primary" className="main-btn" size="lg" 
									    onClick={() => {
									      history.push("/buytoken");
									    }}><b>BUY {tokens.find(t => t.tokenContract === current_selected_buy_option)?.tokenName}</b></Button>
									    </div>
										: null
									}
								</div>
								: null
							}
						</Col>
					</Row>
					<Row>
						<Col lg={4}>
							<Carousel 
							getChildContext={null}
							next={()=>{
								active_index == (getGalleryElements(collection).length - 1) ? 0 : active_index+1
							}}
		        			previous={()=>{
		        				active_index > 0 ? (active_index-1) : (getGalleryElements(collection).length-1)
		        			}}
							activeIndex={active_index}>
							
							<CarouselIndicators 
								items={getGalleryElements(collection)} 
								activeIndex={active_index} 
								onClickHandler={(i)=>setActiveIndex(i)} />
							{
								getGalleryElements(collection).map((gallery_element, i, a)=>{
									return <CarouselItem key={"car_"+i}>
										<GetPunkByMetadata  metadata_url={gallery_element} />
									</CarouselItem>
								})
							}
							<CarouselControl direction="prev" directionText="Previous" onClickHandler={()=>{
								let items = getGalleryElements(collection);
								let nextIndex = active_index === 0 ? items.length - 1 : active_index - 1; 
								setActiveIndex(nextIndex)
							}} />
        					<CarouselControl direction="next" directionText="Next" onClickHandler={()=>{
        						let items = getGalleryElements(collection);
								let  nextIndex = active_index === (items.length - 1) ? 0 : active_index + 1;
								setActiveIndex(nextIndex)
							}} />
							</Carousel>
							
						</Col>
						<Col lg={8}>
							<div className="event_container">
							{
								returnMessageMintElement(current)
							}
							</div>
						</Col>
					</Row>
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
						</Button>
						
						<p>NFTs REMAINING: <b>{parseInt(current.last_punk_id?.value || 0) - parseInt(current.last_nft_id?.value || 0)} </b> </p>
						<p className="big_text"><Stx dim={36} style={{marginRight: 6}} /> BALANCE: <span className="currency">{getBalance(
						collection, 
						current, 
						tokens,
						token_decimals,
						current_selected_buy_option,
						token_balance) }</span></p>
						<div className="block_element" >
						{
							returnMessageMintElement(current)
						}
						</div>*/}
					</div>
					
				</Col>
			</Row>
		</div>
	</> : <div style={{minHeight: 100, textAlign: 'center'}}><Spinner color="white" /></div>
}


export default Wrapper({route: 'Mint', 
  hasHeader: true
}, Mint)