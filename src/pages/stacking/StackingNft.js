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
import stacking from '../../common/utils/stacking'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

const getValue = (v) => {
	return parseFloat(v/1000000).toFixed(6)
}

function StackingNft (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [nft,setNft] = React.useState(null)
	const [minted,setMinted] = React.useState(null)
	const [claimed,setClaimed] = React.useState(false)

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			console.log('prendo nft', props)
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

			stacking.getTokenMinted(
					{ stacking_id: props.stacking_id },
					UserState,
					(res)=>{
						console.log('minted results NFT ID: '+props.nft_id, res)
						setMinted(res)
					},
					(err) => {
						console.log('err', err)
					}
				)
		}

	}, []);	

	return nft ? <Row>
		<Col lg={4} md={6} sm={6}>
			<GetPunkByMetadata metadata_url={nft.value} />
		</Col>
		<Col lg={8} md={6} sm={6}>
			{minted ?
			<div className="stacking_container white_content">
				<p><b>CURRENTLY MINTED:</b> {getValue(minted.minted.value)}</p>
				<p><b>ADDRESS BONUS:</b> {getValue(minted['address-bonus'].value)}</p>
				<p><b>COLLECTION BONUS:</b> {getValue(minted['bonus'].value)}</p>
				<p><b>DAILY VALUE:</b> {getValue(minted['nft-daily-value'].value)}</p>
				{!claimed ? <Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => {
					if(loading) return;
					setLoading(true)

					let token_name = '';
					Object.keys(props.contract_assets).map(k=>{
						if(k.split("::")[0] === props.ctx.address+"."+props.ctx.name) token_name = k.split("::")[1]
					})


					stacking.claim(
						{ 
							stacking_id: props.stacking_id,
							nft_id: props.nft_id,
							collection: props.ctx.address+"."+props.ctx.name,
							token_name: token_name
						},
						UserState,
						doContractCall,
						(res)=>{
							console.log('claim results', res)
							setLoading(false)
							setClaimed(true)
						},
						(err) => {
							console.log('err', err)
							setLoading(false)
						}
					)

				}}>
					{loading ? <Spinner size="sm" /> : "Claim"}
				</Button> : null}
				{
					claimed ? <p>CLAIMED</p> : null
				}
			</div>
			: null}
		</Col>
	</Row> : null
}



export default StackingNft