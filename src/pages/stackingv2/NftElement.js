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



import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import stacking from '../../common/utils/stackingv2'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

function NftElement (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [nft,setNft] = React.useState(null)
	const [_stacking,set_Stacking] = React.useState(false)
	const [stacked,setStacked] = React.useState(false)

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			console.log('prendo nft', props)
			setTimeout(()=>{
				stacking.getNft(
					{ token_id: props.nft_id },
					UserState,
					{
						address: props.ctx.address,
						ctr_name: props.ctx.name
					},
					(res)=>{
						console.log('nft results', res)
						setNft(res)
					},
					(err) => {
						console.log('err', err)
					}
				)
			}, props.n_el * 300)
			
		}

	}, []);	

	return nft ? <div className="stacking_avaible">
		<GetPunkByMetadata metadata_url={nft.value} />
		<div className="button_container">
			{
				!stacked
				?
				<Button color="primary" className="main-btn" size="lg" 
			    onClick={() => {
			    	if(_stacking) return;

			    	set_Stacking(true);
					
					stacking.stake({
						nft_id: props.nft_id,
						contract: props.ctx.address+"."+props.ctx.name
					},
					{
						address: props.ctx.address,
						ctr_name: props.ctx.name,
						tkn: props.ctx.token
					},
					UserState,
					doContractCall,
					(res) => {
						console.log('res', res)
						setStacked(true)
						set_Stacking(false)
						
					},
					(err) => {
						console.log('err', err)
						set_Stacking(false)
					}
					)
			    }}>{_stacking ? <Spinner /> : <b>STAKE</b>}</Button>
				: <Button color="primary" disabled className="main-btn" size="lg" 
				    onClick={() => {
				    	null
				    }}>STAKED</Button>
			}
		</div>
	</div> : null
}



export default NftElement