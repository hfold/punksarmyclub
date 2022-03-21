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

import formatter from '../../common/utils/formatter';

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
	uintCV
} from '@stacks/transactions';

import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import stacking from '../../common/utils/stackingv2'
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
	const [loading_claim, setLoadingClaim] = React.useState(false)

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [nft,setNft] = React.useState(null)
	const [minted,setMinted] = React.useState(null)
	const [claimed,setClaimed] = React.useState(false)

	const [collection, setCollection] = React.useState(null)
	const [nft_id, setNftId] = React.useState(null)

	
	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			console.log('prendo nft', props)

			setTimeout(()=>{
			
				console.log('props.stacking_id.value', props.stacking_id.value)
				stacking.getTokenMinted(
					{ stacking_id: props.stacking_id.value },
					UserState,
					(res)=>{
						console.log('minted results NFT ID: '+props.nft_id, res)
						setMinted(res)

						setNftId(res['nft-id'].value)
						setCollection(res['nft-collection'].value)

						setTimeout(()=>{
							stacking.getNft(
								{ token_id: res['nft-id'].value },
								UserState,
								{
									address: res['nft-collection'].value.split(".")[0],
									ctr_name: res['nft-collection'].value.split(".")[1]
								},
								(res)=>{
									setNft(res)
								},
								(err) => {
									console.log('err', err)
								}
							)
						}, props.n_el * 1000 )
							

					},
					(err) => {
						console.log('err', err)
					}
				)
			}, props.n_el * 1000)
			
		}

	}, []);	

	return <Row>
		<Col lg={4} md={6} sm={6}>
			{nft ? <GetPunkByMetadata metadata_url={nft.value} /> : null}
		</Col>
		<Col lg={8} md={6} sm={6}>
			{minted ?
			<div className="stacking_container white_content">
				<p><b>EXPECTED DAILY GAIN:</b> {getValue(minted['nft-daily-value'].value)} $ROMA</p>
				<p><b>CURRENT GAIN:</b> {getValue(minted.minted.value)} $ROMA</p>
				<p><b>TIME BONUS*:</b> {getValue(minted['bonus'].value)} $ROMA <br></br>
				   *Each 720 Blocks (about 5 days) you gain a 5% bonus on your total Reward <br></br>
				<b>*Bonus is 15% in the first 2 weeks of Staking v2</b></p>	
				<p><b>OG BONUS**:</b> {getValue(minted['address-bonus'].value)} $ROMA <br></br>
				   **If you are an OG, each 144 Blocks (about 1 day) you gain a 2% bonus on your total Reward</p>
				<p><b>ALREADY CLAIMED:</b> {getValue(minted.claimed.value)} $ROMA</p>
				{!claimed ? <React.Fragment>
					<Button id="confirm_add" color="primary" style={{color: '#fff', marginRight: 12}} className="mb-3" size="xs" 
					onClick={async () => {
						if(loading_claim) return;
						setLoadingClaim(true)

						let token_name = '';
						Object.keys(props.contract_assets).map(k=>{
							if(k.split("::")[0] === collection) token_name = k.split("::")[1]
						})


						stacking.claim(
							{ 
								stacking_id: props.stacking_id.value,
								nft_id: nft_id,
								collection: collection,
								token_name: token_name
							},
							UserState,
							doContractCall,
							(res)=>{
								console.log('claim results', res)
								setLoadingClaim(false)
								setClaimed(true)
							},
							(err) => {
								console.log('err', err)
								setLoadingClaim(false)
							}
						)

					}}>
						{loading_claim ? <Spinner size="sm" /> : "CLAIM $ROMA"}
					</Button>
					<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => {
					if(loading) return;
					setLoading(true)

					let token_name = '';
					Object.keys(props.contract_assets).map(k=>{
						if(k.split("::")[0] === collection) token_name = k.split("::")[1]
					})


					stacking.unstake(
						{ 
							stacking_id: props.stacking_id.value,
							nft_id: nft_id,
							collection: collection,
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
					{loading ? <Spinner size="sm" /> : "UNSTAKE PUNK AND CLAIM $ROMA"}
				</Button></React.Fragment> : null}
				{
					claimed ? <p>CLAIMED</p> : null
				}
			</div>
			: null}
		</Col>
	</Row>
}



export default StackingNft