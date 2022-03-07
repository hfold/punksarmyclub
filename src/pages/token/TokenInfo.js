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
import token from '../../common/utils/token'
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

	const [total_supply, setTotalSupply] = React.useState(0);
	const [current_divisor, setCurrentDivisor] = React.useState(1);

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			
			token.getTotalSupply(
				{address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]},
				UserState,
				(n) => {
					setTotalSupply(parseFloat(n/1000000).toFixed(6))
				}
			)

			token.getCurrentDivisor(
				{address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]},
				UserState,
				(n) => {
					setCurrentDivisor(n)
				}
			)
		}

	}, []);	

	return <div>
		
		<Row>
		<Col>
		<h3 className="subtitle no-border">TOKEN INFO</h3>
		<div  className="w_box">
			<p><b>TOTAL SUPPLY:</b> {total_supply}</p>
			<p><b>MAX SUPPLY:</b> 21M</p>
			<p><b>CURRENT DIVISOR:</b> {current_divisor}</p>
		</div>
		
	  </Col>
	</Row> 
	</div>
}



export default AddPoints