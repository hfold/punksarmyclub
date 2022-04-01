import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Button, Spinner, Row, Col, List } from 'reactstrap';

import {  
	intCV,
	uintCV,
	trueCV,
	falseCV,
	noneCV,
	someCV,
	stringAsciiCV,
	stringUtf8CV,
	standardPrincipalCV,
	contractPrincipalCV,
	responseErrorCV,
	responseOkCV,
	tupleCV,
	listCV,
	hexToCV,
	cvToHex,

	cvToString,
	cvToJSON
} from '@stacks/transactions';

import globals from '../common/utils/globals';
import readonly from '../common/utils/readonly';
import contractCall from '../common/utils/contractCall';
import {
  UserContext
} from '../store/UserContext';
import GetPunk from '../common/components/GetPunk';

import moment from 'moment';
import {
  	useParams
} from "react-router-dom";
import Wrapper from '../common/components/Wrapper';


const loadMempool = (address, contract_id, setTxs, old_txs) => {

	const function_names = ['burn-token']

	
	
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

const YourPunks = (props) => {
 	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const {doContractCall} = useConnect();
  	const [punks, setPunks] = React.useState([])
  
  	const {UserState, UserDispatch} = React.useContext(UserContext);
	let {collection} = useParams();

	const [is_owner, setIsOwner] = React.useState(false);
	const [txs, setTxs] = React.useState([]);
	const [burning, setBurning] = React.useState(false);

	const load_pool = () => loadMempool(
		UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
		globals.COLLECTIONS[collection].address+'.'+globals.COLLECTIONS[collection].ctr_name,
		setTxs,
		txs
	);

	const [total_pages, setTotalPages] = React.useState(1);
	const loadNfts = (ids, page) => {
		console.log('_______________CARICO PAGINA', page)
		let u = moment().unix();
		let str = globals.STACKS_API_BASE_URL+"/extended/v1/address/"+
	    	UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]+
	    	"/nft_events?t="+u+"&limit=50";

	    if(page > 1) {
	    	str += "&offset="+((page*50) -50)
	    }

		fetch(str)
	      .then(res => res.json())
	      .then(
	        (result) => {
	          setLoaded(true)
	          let new_ids = [...ids]
	          //console.log('res', result)
	          result.nft_events.map(e => {
	          	try {

	          		
		          	if(e.asset_identifier == globals.COLLECTIONS[collection].address+
		          		"."+
		          		globals.COLLECTIONS[collection].ctr_name+
		          		"::"+
		          		globals.COLLECTIONS[collection].tkn){
		          		
		          		let value = hexToCV(e.value.hex)
		          		try {
		          			let id = cvToJSON( value ).value
		          			
		          			if(new_ids.indexOf(id) === -1) new_ids.push(id)
		          		} catch(e) {
		          			console.log('e', e)
		          		}
		          	}
		        } catch(e) {
		        	console.log('e', e)
		        } 
	          })

	          if(result.total > 50) {
	          	let t = parseInt(result.total / 50);
	          	let rest = result.total % 50;
	          	if(rest > 0) t += 1;

	          	console.log('total pages', rest, result.total, t)
	          	
	          	if(page+1 <= t) {
	          		console.log('imposto ids', ids)
	          		loadNfts(new_ids, page+1)
	          	} else {
	          		console.log('imposto ids finali', ids)
	          		setPunks(new_ids)
	          		setLoaded(true);
	          	}

	          } else {
	          	setPunks(new_ids)
          		setLoaded(true);
	          }
	          
	        },
	        (error) => {
	        	
	        }
	    )
	}

  	React.useEffect( () => {
		if(!loaded) {
			

			let u = moment().unix();
			

			const load = async () => loadNfts(punks, 1)

			readonly.isCtxOwner([], UserState, globals.COLLECTIONS[collection], (res) => {
	          console.log('res', res)
	          setIsOwner(res)
	        }, (err) => null)

			load();
			
			load_pool();
			
			let pool = setInterval(()=>load_pool(), 1000*5);
			return ()=>clearInterval(pool);
		    
		}
	});


  return (<div>
  	<h3 className="subtitle">YOUR NFTS</h3>
  	<Row>
	  	<Col className="">
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
		</Col>
	</Row>
	<Row style={{overflow: 'visible'}}>
  		{punks.map(id => 
  			<Col style={{padding: 20, overflow: 'visible', textAlign: 'center'}} sm={6} xs={12} md={4}>
  				<GetPunk id={id} key={"punk_id_"+id} collection={collection} />
  				{
  					is_owner ? <Button id="load_more_punks" color="primary" 
  					style={{color: '#fff', margin: '12px auto', display: 'block', marginTop: -20}} 
  					className="mb-3" size="xs" 
					onClick={async () => {
						console.log('burn')
						if(burning) return;
						setBurning(true);

						contractCall.burn({token_id: id}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
			      			
			      			console.log('res burn', result)
			      			setBurning(false);
			      			load_pool();

			      		}, (result)=>{
			      			console.log('error', result)
			      			setBurning(false);
			      			
			      		})
					}}>
						BURN
					</Button> : null
  				}
  			</Col>)}
  	</Row>
  	</div>);
};


export default Wrapper({route: 'YourPunks', 
  hasHeader: true
}, YourPunks)