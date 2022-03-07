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

import contractCall from '../../common/utils/contractCall';
import {
  UserContext
} from '../../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import ReadOnly from '../../common/utils/readonly';



import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import rarity from '../../common/utils/rarity'
import {
  	useParams,
  	useLocation
} from "react-router-dom";


function AddPoints (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [json_val, setJsonVal] = React.useState('')


	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	
	const [adding, setAdding] = React.useState(false)

	const [total_to_add, setTotalToAdd] = React.useState(0)
	const [added, setAdded] = React.useState(0)
	const [address, setAddress] = React.useState('')

	let {collection} = useParams();
	const location = useLocation();
	const [txs, setTxs] = React.useState([]);

	

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			

		}

	}, []);	

	return <div>
		
		<Row>
		<Col>
		<MempoolTxs functions={['set-multiple-rarity']} contract={window.RARITY_CONTRACT} />
		<h3 className="subtitle no-border">Add rarity points for collection (MAX 1000)</h3>
		<p style={{color: '#fff'}}>Copy and paste a json array in the editor and then call the function</p>
		<CodeEditor
			      value={json_val}
			      language="js"
			      placeholder={`Please enter a json list of metadata_url (es. 
	[
		{"id":"1", "rarity": "999", "rank": "1"},
		{"id":"2", "rarity": "998", "rank": "2"},
		{"id":"3", "rarity": "997", "rank": "3"}
	]
)
			      	`}
			      onChange={(evn) => setJsonVal(evn.target.value)}
			      padding={15}
			      minHeight={350}
			      style={{
			        backgroundColor: "#f5f5f5"
			      }}
			    />
		<FormGroup floating style={{marginTop: 24}}>
			<Input value={address} id="add_address" onChange={(e)=>setAddress(e.target.value)} />
			<Label for="add_address">
		        STX Collection Address
	      	</Label>
		</FormGroup>
		<Button color="primary" block style={{color: '#fff'}} className="mt-3" size="lg" onClick={async () => {
			if(adding) return;

			let values = JSON.parse(json_val)
			
			setAdding(true)
			
			rarity.setMultipleRarity(
				{ values: values.splice(0,1000), collection: address },
				UserState,
				doContractCall,
				(res)=>{
					setAdding(false)
					setJsonVal("")
					setAddress("")
					console.log('add res', res)
				},
				(err) => {
					console.log('error', err)
					setAdding(false)
				}
			)
      		
      	}}>
			{adding ? <Spinner size="sm" /> : <b>CONFIRM AND ADD LIST</b>}
		</Button>
		
		
	  </Col>
	</Row> 
	</div>
}



export default AddPoints