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

	const function_names = ['add-package', 'edit-package', 'remove-package']

	
	
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

	const [packages, setPackages] = React.useState([])
	const [adding, setAdding] = React.useState(false)
	const [removing, setRemoving] = React.useState(false)

	const [nftget, setNftGet] = React.useState(1);
	const [nftpaid, setNftPaid] = React.useState(1);
	const [order, setOrder] = React.useState(1);
	const [qty, setQty] = React.useState(1);

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

	const loadPackages = () => {
		if(loading) return;
		
		setLoading(true)
		ReadOnly.getPackages({}, UserState, globals.COLLECTIONS[collection], (result) => {
			console.log('-------------PACKAGES------------', result)

			if(!loaded) setLoaded(true)

			console.log('packages', result)
			setPackages(result.value)
			
	    	setLoading(false)

	    }, (err) => {
	    	if(!loaded) setLoaded(true)
	    	setIsOpen(false)
	    	setLoading(false)
	    })

	}

	React.useEffect(() => {
		
		loadPackages();
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
				onClick={async () => loadPackages()}>
					{loading ? <Spinner size="sm" /> : "Refresh"}
				</Button>
				
		  		<div style={{height: 24, width: '100%'}}></div>
		  		
				<h3 className="subtitle" style={{marginTop: 42}}>ADD PACKAGE</h3>
				<div className="w_box">
					<p>Fill in the form and confirm</p>
					
					<FormGroup floating>
						<Input value={nftget} type="number" id="price" onChange={(e)=>setNftGet(e.target.value)} />
						<Label for="max_mint">
					        NUMBER OF NFT GET
				      	</Label>
					</FormGroup>
					<FormGroup floating>
						<Input value={nftpaid} type="number" id="price" onChange={(e)=>setNftPaid(e.target.value)} />
						<Label for="max_mint">
					        NUMBER OF NFT PAID
				      	</Label>
					</FormGroup>
					<FormGroup floating>
						<Input value={qty} type="number" id="price" onChange={(e)=>setQty(e.target.value)} />
						<Label for="max_mint">
					        Quantity
				      	</Label>
					</FormGroup>
					<FormGroup floating>
						<Input value={order} type="number" id="price" onChange={(e)=>setOrder(e.target.value)} />
						<Label for="max_mint">
					        ORDER TO SHOW
				      	</Label>
					</FormGroup>

					<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
					className="mb-3" size="lg" onClick={async () => {
					      		
								if(adding) return;
					      		setAdding(true)

					      		contractCall.addPackage(
					      			{
					      				nftget: nftget, 
					      				nftpaid: nftpaid, 
					      				order: order,
					      				qty: qty
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
				<h3 className="subtitle">PACKAGES</h3>
				<List type="unstyled" className="">
				{
					packages.map((a,i,arr)=>{
						
						return <li key={"list_a_"+i} style={{color:'#a5a3a3', marginTop: 24}}>
							<div className="w_box">
								<p>DELETE PACKAGE</p>
								<Button disabled={removing} close onClick={()=>{
									console.log(cvToJSON(a))
									if(removing) return;

									let obj = cvToJSON(a)
									setRemoving(true)
						      		contractCall.removePackage({id: a.value.id.value}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
						      			setRemoving(false)
						      			load_pool();

						      		}, (result)=>{
						      			setRemoving(false)
						      		})
								}} />
								<h3>EDIT PACKAGE #{a.value.id.value}</h3>
								<FormGroup floating>
									<Input value={a.value.nftget.value} type="number" id="price" onChange={(e)=>{
										let packs = packages.map(p=>{
											if(p.value.id.value === a.value.id.value) {
												return {
													...p,
													value: {
														...p.value,
														nftget: {
															...p.value.nftget,
															value: e.target.value
														}
													}
												}
											} else {
												return p
											}
										})
										setPackages(packs)
									}} />
									<Label for="max_mint">
								        NUMBER OF NFT GET
							      	</Label>
								</FormGroup>
								<FormGroup floating>
									<Input value={a.value.nftpaid.value} type="number" id="price" onChange={(e)=>{
										let packs = packages.map(p=>{
											if(p.value.id.value === a.value.id.value) {
												return {
													...p,
													value: {
														...p.value,
														nftpaid: {
															...p.value.nftpaid,
															value: e.target.value
														}
													}
												}
											} else {
												return p
											}
										})
										setPackages(packs)
									}}/>
									<Label for="max_mint">
								        NUMBER OF NFT PAID
							      	</Label>
								</FormGroup>
								<FormGroup floating>
									<Input value={a.value.qty.value} type="number" id="price" onChange={(e)=>{
										let packs = packages.map(p=>{
											if(p.value.id.value === a.value.id.value) {
												return {
													...p,
													value: {
														...p.value,
														qty: {
															...p.value.qty,
															value: e.target.value
														}
													}
												}
											} else {
												return p
											}
										})
										setPackages(packs)
									}} />
									<Label for="max_mint">
								        Quantity
							      	</Label>
								</FormGroup>
								<FormGroup floating>
									<Input value={a.value.order.value} type="number" id="price" onChange={(e)=>{
										let packs = packages.map(p=>{
											if(p.value.id.value === a.value.id.value) {
												return {
													...p,
													value: {
														...p.value,
														order: {
															...p.value.order,
															value: e.target.value
														}
													}
												}
											} else {
												return p
											}
										})
										setPackages(packs)
									}} />
									<Label for="max_mint">
								        ORDER TO SHOW
							      	</Label>
								</FormGroup>
								<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
									className="mb-3" size="lg" onClick={async () => {
									      		
												if(adding) return;
									      		setAdding(true)

									      		contractCall.editPackage(
									      			{
									      				id: a.value.id.value,
									      				nftget: a.value.nftget.value, 
									      				nftpaid: a.value.nftpaid.value, 
									      				order: a.value.order.value,
									      				qty: a.value.qty.value
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
						</li>
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