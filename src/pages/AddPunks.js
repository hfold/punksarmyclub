import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert
} from 'reactstrap';

import AceEditor from "react-ace";

import contractCall from '../common/utils/contractCall';
import {
  UserContext
} from '../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import ReadOnly from '../common/utils/readonly';

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";





export default function AddPunks (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [json_val, setJsonVal] = React.useState('')


	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	
	const [adding, setAdding] = React.useState(false)

	const [total_to_add, setTotalToAdd] = React.useState(0)
	const [added, setAdded] = React.useState(0)

	const mintPunks = (current_i, chunk, full_array) => {

		let last_index = (current_i + chunk);
		let list = full_array.slice(current_i, last_index);

		if(list.length > 0) {
	   
			contractCall.addPunk({list: list}, UserState, doContractCall, (result)=>{
	  			
	  			UserDispatch({
	  				type: 'add_transaction',
	  				tx: result
	  			})
	  			setAdded(last_index)
	  			
	  			if(full_array.length > ( last_index - 1 )) {
	  				setTimeout(()=>mintPunks(last_index, chunk, full_array), 500)
	  			} else {
	  				setAdding(false)
	  			}

	  		}, (result)=>{
	  			setAdding(false)
	  			UserDispatch({
	  				type: 'add_transaction',
	  				tx: result
	  			})
	  		})
		} else {
			setAdding(false)
		}
	}

	return <>
		<h3>Add punks to collection</h3>
		<p>Copy and paste a json array in the editor and then call the function</p>
		{adding ? <>
			<p>Process: {added}/{total_to_add}</p>
			</> : <AceEditor
		    mode="json"
		    onChange={(newValue)=>setJsonVal(newValue)}
		    style={{width: '100%'}}
		    name="editor_json"
		    editorProps={{ $blockScrolling: true }}
		  />}
		<Button color="primary" style={{color: '#fff'}} className="mt-3" onClick={async () => {
			if(adding) return;

			let values = JSON.parse(json_val)
			setTotalToAdd(values.length)
			setAdding(true)
			mintPunks(0, window.MAX_PUNK, values);
      		
      	}}>
			{adding ? <Spinner size="sm" /> : 'Add list'}
		</Button>
		
		
	  </> 
}


