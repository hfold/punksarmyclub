import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { FormGroup, Input, Label, Button, Spinner, Row, Col, 
	Navbar, Nav, NavItem, NavLink
} from 'reactstrap';
import formatters from '../../common/utils/formatter';
import {  
	intCV,
	uintCV,
	trueCV,
	falseCV,
	noneCV,
	someCV,
	stringAsciiCV,
	stringUtf8CV,
	standardPrincipalCV,
	contractPrincipalCV,
	responseErrorCV,
	responseOkCV,
	tupleCV,
	listCV,
	hexToCV,
	cvToHex,

	cvToString,
	cvToJSON
} from '@stacks/transactions';

import globals from '../../common/utils/globals';
import {
  UserContext
} from '../../store/UserContext';
import GetPunk from '../../common/components/GetPunk';
import PunkList from './PunkList';
import WeaponList from './WeaponList';

import moment from 'moment';
import {
  	useParams, useHistory
} from "react-router-dom";
import Wrapper from '../../common/components/Wrapper';

import UpgradeElement from './UpgradeElement';
import upgradeServices from '../../common/utils/upgrade';
import MempoolTxs from '../../common/components/MempoolTxs';

const UpgradeMain = (props) => {
 	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [error, setError] = React.useState(false)

	const [current_upgrade_punk, setCurrentUpgradePunk] = React.useState(null)
	const [current_upgrade_weapon, setCurrentUpgradeWeapon] = React.useState(null)

	const {doContractCall} = useConnect();
	const [upgrading_list, setUpgradingList] = React.useState([])

  	const {UserState, UserDispatch} = React.useContext(UserContext);
	let {collection} = useParams();
	const history = useHistory();

	const [is_admin, setIsAdmin] = React.useState(false)

	React.useEffect(() => {
		if(!loaded) {
			setLoaded(true)
			upgradeServices.isAdmin(
				{address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]},
				UserState,
				(is_admin) => {
					setIsAdmin(is_admin)
				}
			)

			upgradeServices.upgradeList(
				{address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]},
				UserState,
				(ids) => {
					console.log('UPGRADE IDS', ids)
					if(ids.value && ids.value.length > 0) {
						setUpgradingList(ids.value.map(el => parseInt(el.value)).reverse())
					}
				}
			)
		}
		return ()=>setLoaded(false);

	}, []);
  	
  return (<div style={{marginTop: 40}}>
  	<Row style={{overflow: 'visible'}}>
  		<Col sm={12}>
			<MempoolTxs functions={['upgrade', 'do-upgrade']} contract={window.UPGRADE_CONTRACT} />
		</Col>
  		<Col lg={12} md={12} sm={12} xs={12} className="bar-left-custom">
  			<h3 className="subtitle">PUNKS UPGRADE</h3>
		  	<Button id="back_to_home" color="primary" style={{color: '#fff', margin: '12px 0', display: 'block'}} className="mb-3" size="xs" 
				onClick={async () => history.push("/")}>
					BACK TO HOME
			</Button>
			
			{current_upgrade_punk || current_upgrade_weapon ? <Row style={{overflow: 'visible', marginTop: 24, marginBottom: 24}}>
				<h3 style={{color: '#fff', textTransform: 'uppercase', fontSize: '18px !important', fontWeight: 'bold', textAlign: 'center'}}>Currently selected</h3>
				<div style={{display: 'block', textAlign: 'center', margin: 'auto'}}>
					{current_upgrade_punk ? <img style={{width: 200, marginRight: 12, height: 'auto'}} src={formatters.ipfs_gateway(current_upgrade_punk.image)} />: null}
					{current_upgrade_weapon ? <img style={{width: 200, height: 'auto'}} src={formatters.ipfs_gateway(current_upgrade_weapon.image)} /> : null}
				</div>	
				<div style={{display: 'block', textAlign: 'center', margin: 'auto'}}>
				{current_upgrade_punk && current_upgrade_weapon ? <Button color="danger" 
					style={{color: '#fff', margin: '12px auto'}} className="mb-3" size="lg" 
						onClick={async () => {
							if(loading) return;

							setLoading(true)
							upgradeServices.upgrade(
							{punk_id: current_upgrade_punk.nft_id, weapon_id: current_upgrade_weapon.nft_id},
							UserState,
							doContractCall,
							(res) => {
								setError(false)
								setLoading(false)
								setCurrentUpgradePunk(null)
								setCurrentUpgradeWeapon(null)

							}, (err) => {
								console.log(err)
								setLoading(false)
								setError(true)
								
							}
						)
							

						}}>
							CONFIRM AND UPGRADE!
					</Button> : null }
					{
						error ? <p style={{color: '#fff'}}>THERE WAS AN ERROR, RETRY UPGRADE</p> : null
					}
					</div>
			</Row> : null}
			<Row style={{overflow: 'visible'}}>
		  		<Col lg={6} md={6} sm={12} xs={12}>
		  			<h3 style={{color: '#fff', textTransform: 'uppercase', fontSize: '18px !important', fontWeight: 'bold'}}>Select punk to upgrade</h3>
		  			<PunkList onSelect={(el) => setCurrentUpgradePunk(el)} selected={current_upgrade_punk} />
		  		</Col>
		  		<Col lg={6} md={6} sm={12} xs={12}>
		  			<h3 style={{color: '#fff', textTransform: 'uppercase', fontSize: '18px !important', fontWeight: 'bold'}}>Select a weapon</h3>
		  			<WeaponList  onSelect={(el) => setCurrentUpgradeWeapon(el)} selected={current_upgrade_weapon} />
		  		</Col>
		  	</Row>

		  	<div style={{marginTop: 24, marginBottom: 24}}>
			{upgrading_list.length > 0 ? <h3 className="subtitle">UPGRADE REQUESTS</h3> : null}
			{
				upgrading_list.map((id, i,a) => {
					return <UpgradeElement id={id} />
				})
			}
			</div>
  		</Col>
  	</Row>

  	</div>);
};


export default Wrapper({route: 'UpgradeMain', 
  hasHeader: false,
  hide_nav: true,
  hasSecondaryHeader: true
}, UpgradeMain)