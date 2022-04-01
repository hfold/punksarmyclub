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
import WeaponElement from './WeaponElementNoPad';
import PunkElement from './PunkElementNoPad';
import Wrapper from '../../common/components/Wrapper';
import formatters from '../../common/utils/formatter';
import globals from '../../common/utils/globals'
import upgrade from '../../common/utils/upgrade'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

function UpgradeElement (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	
	const [el,setEl] = React.useState(null)

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			console.log('prendo upgrade info', props)
			setTimeout(()=>{
				upgrade.upgradeInfo(
					{ upgrade_id: props.id },
					UserState,
					async (res)=>{
						console.log('upgrade results', res)
						setEl(res.value)

					},
					(err) => {
						console.log('err', err)
					}
				)
			}, props.n_el * 300)
			
		}

	}, []);	

	return el ? <Row style={{marginBottom: 24}}>
		<Col xl={12} md={12} sm={12}>
			<div style={{width: 200, float: 'left', marginRight: 12}}>
				<PunkElement nft_id={el['punk-id'].value} ctx={{
					address: window.UPGRADE_PUNK_CONTRACT.split(".")[0],
					name: window.UPGRADE_PUNK_CONTRACT.split(".")[1]
				}}
				/>
			</div>
			<div style={{height: 200, float: 'left', marginRight: 12}}>
			<p style={{color: '#fff', lineHeight: '185px', fontSize: 175, overflow: 'hidden', margin: 0, marginLeft: 42}}>+</p>
			</div>
			<div style={{width: 200, float: 'left', marginRight: 12}}>
				<WeaponElement nft_id={el['weapon-id'].value} ctx={{
					address: window.UPGRADE_WEAPONS_CONTRACT.split(".")[0],
					name: window.UPGRADE_WEAPONS_CONTRACT.split(".")[1]
				}}
				/>
			</div>
			<div style={{height: 200, width: 200, float: 'left', marginRight: 12}}>
			<p style={{color: '#fff', lineHeight: '185px', fontSize: 175, overflow: 'hidden', margin: 0, marginLeft: 42}}> = </p>
			</div>
			{
				el['new-nft-id'] && el['new-nft-id'].value && parseInt(el['new-nft-id'].value) != 0 ?
				<div style={{width: 200, float: 'left', marginRight: 12}}><PunkElement includeHands={true} nft_id={el['new-nft-id'].value} ctx={{
					address: window.UPGRADE_PUNK_CONTRACT.split(".")[0],
					name: window.UPGRADE_PUNK_CONTRACT.split(".")[1]
				}}
				/></div>
				: <div style={{width: 200, float: 'left', marginRight: 12}}>
					<p style={{color: '#fff', lineHeight: '185px', fontSize: 175, overflow: 'hidden', margin: 0, marginLeft: 42}}> ? 
					</p>
				</div>
			}
		</Col> 
	</Row>: null
}



export default UpgradeElement