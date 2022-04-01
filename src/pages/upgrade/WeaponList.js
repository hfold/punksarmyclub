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

import {  
	hexToCV, cvToJSON
} from '@stacks/transactions';

import CodeEditor from '@uiw/react-textarea-code-editor';

import contractCall from '../../common/utils/contractCall';
import {
  UserContext
} from '../../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import ReadOnly from '../../common/utils/readonly';


import WeaponElement from './WeaponElement';
import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import upgrade from '../../common/utils/upgrade'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

function WeaponList (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	
	const collection_name = window.UPGRADE_WEAPONS_CONTRACT + "::" + window.UPGRADE_WEAPONS_CONTRACT_TOKEN
	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [nfts,setNfts] = React.useState([])

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			
			let balance_url = globals.STACKS_API_BASE_URL+"/extended/v1/tokens/nft/holdings?principal="+UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]+"&asset_identifiers="+collection_name
			fetch(balance_url)
		      .then(res => res.json())
		      .then(
		        (result) => {
		        	console.log('nfts', result)
		          	setNfts(result.results)

		        },
		        (error) => {
		        	console.log('err', error)
		        }
		      )
		}

	}, []);	

	return <div>
		<Row>
		{
			nfts.map((nft,i,n) => {
				return <WeaponElement key={"el_p_"+i}
					onSelect={props.onSelect}
					selected={props.selected}
					n_el={i} 
					nft_id={parseInt(cvToJSON(hexToCV(nft.value.hex)).value)} 
					ctx={{
						address: window.UPGRADE_WEAPONS_CONTRACT.split(".")[0], 
						name: window.UPGRADE_WEAPONS_CONTRACT.split(".")[1], 
						token: window.UPGRADE_WEAPONS_CONTRACT_TOKEN
					}} />
			})
		}
		</Row>
	</div>
}



export default WeaponList