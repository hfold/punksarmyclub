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

	const loadNftData = async () => {
		let data = cvToHex( uintCV(props.stacking_id) )

		let url_data_map = globals.STACKS_API_BASE_URL + '/v2/map_entry/' + window.STACKING_CONTRACT.split(".")[0] + '/' + window.STACKING_CONTRACT.split(".")[1] + '/stacking-map'
		let response = await fetch(url_data_map, {
		    method: 'POST', // *GET, POST, PUT, DELETE, etc.
		    mode: 'cors', // no-cors, *cors, same-origin
		    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		    credentials: 'same-origin', // include, *same-origin, omit
		    headers: {
		      'Content-Type': 'application/json'
		      // 'Content-Type': 'application/x-www-form-urlencoded',
		    },
		    redirect: 'follow', // manual, *follow, error
		    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		    body: JSON.stringify(data) // body data type must match "Content-Type" header
		  });
	  	return response.json();
	}



	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			console.log('prendo nft', props)

			setTimeout(()=>{
				loadNftData().then(data => {
					let json_val = cvToJSON(hexToCV(data.data));
				    console.log('SINGLE NFT DATA', json_val)

				    stacking.getNft(
						{ token_id: json_val.value.value['nft-id'].value },
						UserState,
						{
							address: json_val.value.value['nft-collection'].value.split(".")[0],
							ctr_name: json_val.value.value['nft-collection'].value.split(".")[1]
						},
						(res)=>{
							setNft(res)
						},
						(err) => {
							console.log('err', err)
						}
					)
			  	})

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
			}, props.n_el * 2500)
			

			
		}

	}, []);	

	return nft ? <Row>
		<Col lg={4} md={6} sm={6}>
			<GetPunkByMetadata metadata_url={nft.value} />
		</Col>
		<Col lg={8} md={6} sm={6}>
			{minted ?
			<div className="stacking_container white_content">
				<p><b>EXPECTED DAILY GAIN:</b> {getValue(minted['nft-daily-value'].value)} $ROMA</p>
				<p><b>CURRENT GAIN:</b> {getValue(minted.minted.value)} $ROMA</p>
				<p><b>TIME BONUS*:</b> {getValue(minted['bonus'].value)} $ROMA</p>
				<p>*Each 720 Blocks (about 5 days) you gain a 5% bonus on your total Reward</p>	
				<p><b>OG BONUS**:</b> {getValue(minted['address-bonus'].value)} $ROMA</p>
				<p>**If you are an OG, each 144 Blocks (about 1 day) you gain a 2% bonus on your total Reward</p>
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
					{loading ? <Spinner size="sm" /> : "UNSTAKE PUNK AND CLAIM $ROMA"}
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