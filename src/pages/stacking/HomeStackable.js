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


import NftElement from './NftElement';
import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import stacking from '../../common/utils/stacking'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

function HomeStackable (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [nfts,setNfts] = React.useState([])

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			
			let balance_url = globals.STACKS_API_BASE_URL+"/extended/v1/tokens/nft/holdings?principal="+UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]+"&asset_identifiers="+props.collection.fullName
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
			nfts.map(nft => {
				
				return <Col xl={4} md={6} sm={12}>
					<NftElement nft_id={parseInt(cvToJSON(hexToCV(nft.value.hex)).value)} ctx={{address: props.collection.collection.split(".")[0], name: props.collection.collection.split(".")[1], token: props.collection.tokenName}} />
				</Col>
			})
		}
		</Row>
	</div>
}



export default HomeStackable