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

import GetPunkByMetadata from '../../common/components/GetPunkByMetadata';

import {  
	standardPrincipalCV,
	cvToHex,
	hexToCV,
	cvToJSON,
	cvToString,
	stringToCV,
} from '@stacks/transactions';

import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import stacking from '../../common/utils/stackingv2'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

import StackingNft from './StackingNft';

function StackingData (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [current_staking, setCurrentStacking] = React.useState([]);
	const [contract_assets, setContractAssets] = React.useState({})

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)

			
			//https://stacks-node-api.mainnet.stacks.co/v2/map_entry/{contract_address}/{contract_name}/{map_name}
			
			stacking.currentStakingIds(
					{ address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] },
					UserState,
					(res)=>{
						setCurrentStacking(res)
					},
					(err) => {
						console.log('err', err)
					}
				)

			let balance_url = globals.STACKS_API_BASE_URL+"/extended/v1/address/"+window.STACKING_CONTRACT_V2+"/balances"
			fetch(balance_url)
		      .then(res => res.json())
		      .then(
		        (result) => {
		        	console.log('balance', result)
		          	setContractAssets(result.non_fungible_tokens)

		        },
		        (error) => {
		        	console.log('err', error)
		        }
		      )
		}

	}, []);	

	return <div>
	<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
	onClick={async () => {
		if(loading) return;
		setLoading(true)

		stacking.currentStakingIds(
			{ address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] },
			UserState,
			(res)=>{
				console.log('stacking results', res)
				setCurrentStacking(res)
				setLoading(false)
			},
			(err) => {
				console.log('err', err)
				setLoading(false)
			}
		)

	}}>
		{loading ? <Spinner size="sm" /> : "Refresh"}
	</Button>
	<h3 style={{color: '#fff'}}>You're staking {current_staking.length} Nfts</h3>
	{current_staking.map((el,i,a) => {
		return <StackingNft key={"stacking_"+i} 
		stacking_id={el} 
		n_el={i}
		contract_assets={contract_assets}
		/>
	})}</div>
}



export default StackingData