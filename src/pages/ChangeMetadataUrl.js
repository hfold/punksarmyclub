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

import GetPunk from '../common/components/GetPunk';
import GetPunkByMetadata from '../common/components/GetPunkByMetadata';

import Wrapper from '../common/components/Wrapper';
import globals from '../common/utils/globals'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

const loadMempool = (address, contract_id, setTxs, old_txs) => {

	const function_names = ['set_punk_metadata_url']

	
	
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


function ChangePunkMetadataUrl (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [changing, setChanging] = React.useState(false)
	
	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [preview, setPreview] = React.useState(false)
	
	const [url, setUrl] = React.useState('')
	const [id, setId] = React.useState(0)
	
	
	let {collection} = useParams();
	const location = useLocation();
	const [txs, setTxs] = React.useState([]);

	const load_pool = () => loadMempool(
		UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
		globals.COLLECTIONS[collection].address+'.'+globals.COLLECTIONS[collection].ctr_name,
		setTxs,
		txs
	);

	React.useEffect(() => {
		setLoaded(true);
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
				onClick={async () => load_pool()}>
					{loading ? <Spinner size="sm" /> : "Refresh"}
				</Button>
				
		  		<div style={{height: 24, width: '100%'}}></div>
				<h3 className="subtitle">CHANGE METADATA URL</h3>
				<div className="w_box">
					<p>Fill in the form and confirm</p>
					<FormGroup floating>
						<Input value={id} type="number" id="max_mint" onChange={(e)=>setId(e.target.value)} />
						<Label for="max_mint">
					        NFT ID
				      	</Label>
					</FormGroup>
					

					<FormGroup floating>
						<Input value={url} type="text" id="max_mint" onChange={(e)=>setUrl(e.target.value)} />
						<Label for="max_mint">
					        IPFS URL
				      	</Label>
					</FormGroup>
					<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
					className="mb-3" size="lg" onClick={async () => {
					      							      		
					      		if(changing) return;
					      		setChanging(true)

					      		
					      		contractCall.chMetadata(
					      			{id: id, metadata_url: url}, 
					      			UserState, 
					      			globals.COLLECTIONS[collection], 
					      			doContractCall, (result)=>{
					      			
					      			setChanging(false)
					      			setPreview(false)
					      			load_pool();

					      		}, (result)=>{
					      			setChanging(false)
					      			
					      		})

					      	}}>
						{changing ? <Spinner size="sm" /> : <b>Confirm</b>}
					</Button>
				</div>
			</Col>
			<div style={{marginTop: 24}}>
				<Row>
					<Button id="confirm_open" color="primary" style={{color: '#fff'}} 
						className="mb-3" size="lg" onClick={()=>setPreview(!preview)}>{preview ? 'HIDE PREVIEW' : 'SHOW PREVIEW'}</Button>
					<Col lg={6} sm={12}>
						<h3 className="subtitle">PREVIEW NFT</h3>
						{
							preview
							?
							<GetPunk id={id} collection={collection} />
							: null
						}
					</Col>
					<Col lg={6} sm={12}>
						<h3 className="subtitle">PREVIEW NEW METADATA URL</h3>
						{
							preview
							?
							<GetPunkByMetadata metadata_url={url} collection={collection} />
							: null
						}
					</Col>
				</Row>
			</div>
		</Row>
	</> : <Spinner color="primary" />
}



export default Wrapper({route: 'ChangePunkMetadataUrl', 
  hasHeader: true
}, ChangePunkMetadataUrl)