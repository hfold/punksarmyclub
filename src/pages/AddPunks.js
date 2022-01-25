import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
Row,
Col,
List
} from 'reactstrap';

import CodeEditor from '@uiw/react-textarea-code-editor';

import contractCall from '../common/utils/contractCall';
import {
  UserContext
} from '../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import ReadOnly from '../common/utils/readonly';



import Wrapper from '../common/components/Wrapper';
import globals from '../common/utils/globals'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

const loadMempool = (address, contract_id, setTxs, old_txs) => {

	const function_names = ['create-multiple-punk']

	
	
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

function AddPunks (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [json_val, setJsonVal] = React.useState('')


	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	
	const [adding, setAdding] = React.useState(false)

	const [total_to_add, setTotalToAdd] = React.useState(0)
	const [added, setAdded] = React.useState(0)

	let {collection} = useParams();
	const location = useLocation();
	const [txs, setTxs] = React.useState([]);

	const mintPunks = (current_i, chunk, full_array) => {

		let last_index = (current_i + chunk);
		let list = full_array.slice(current_i, last_index);

		if(list.length > 0) {
	   
			contractCall.addPunk({list: list}, UserState, globals.COLLECTIONS[collection], doContractCall, (result)=>{
	  			
	  			setAdded(last_index)
	  			
	  			if(full_array.length > ( last_index - 1 )) {
	  				setTimeout(()=>mintPunks(last_index, chunk, full_array), 500)
	  			} else {
	  				setAdding(false)
	  			}

	  			load_pool();

	  		}, (result)=>{
	  			setAdding(false)

	  			load_pool();
	  		})
		} else {
			setAdding(false)
		}
	}

	const load_pool = () => loadMempool(
		UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
		globals.COLLECTIONS[collection].address+'.'+globals.COLLECTIONS[collection].ctr_name,
		setTxs,
		txs
	);

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			

			load_pool();

			let pool = setInterval(()=>load_pool(), 1000*5);
			return ()=>clearInterval(pool);

		}

	}, [collection, location]);	

	return <div>
		
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
		<h3 className="subtitle">Add nft to collection</h3>
		<p style={{color: '#fff'}}>Copy and paste a json array in the editor and then call the function</p>
		{adding ? <>
			<p>Process: {added}/{total_to_add}</p>
			</> : <CodeEditor
			      value={json_val}
			      language="js"
			      placeholder={`Please enter a json list of metadata_url (es. 
	[
		{"metadata_url":"ipfs://QmXm6d2hYVFWSZZiLLhbDKcWRpkGfwoTYMiaotScpXPYDk/0"},
		{"metadata_url":"ipfs://QmXm6d2hYVFWSZZiLLhbDKcWRpkGfwoTYMiaotScpXPYDk/1"},
		{"metadata_url":"ipfs://QmXm6d2hYVFWSZZiLLhbDKcWRpkGfwoTYMiaotScpXPYDk/2"},
		{"metadata_url":"ipfs://QmXm6d2hYVFWSZZiLLhbDKcWRpkGfwoTYMiaotScpXPYDk/3"}
	]
)
			      	`}
			      onChange={(evn) => setJsonVal(evn.target.value)}
			      padding={15}
			      minHeight={350}
			      style={{
			        backgroundColor: "#f5f5f5"
			      }}
			    />}
		<Button color="primary" block style={{color: '#fff'}} className="mt-3" size="lg" onClick={async () => {
			if(adding) return;

			let values = JSON.parse(json_val)
			setTotalToAdd(values.length)
			setAdding(true)
			mintPunks(0, window.MAX_PUNK, values);
      		
      	}}>
			{adding ? <Spinner size="sm" /> : <b>CONFIRM AND ADD LIST</b>}
		</Button>
		
		
	  </Col>
	</Row> 
	</div>
}



export default Wrapper({route: 'AddPunks', 
  hasHeader: true
}, AddPunks)