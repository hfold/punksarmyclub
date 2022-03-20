import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { FormGroup, Input, Label, Button, Spinner, Row, Col, 
	Navbar, Nav, NavItem, NavLink
} from 'reactstrap';

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
import galleries from '../../common/utils/collections_gallery';

import moment from 'moment';
import {
  	useParams, useHistory
} from "react-router-dom";
import Wrapper from '../../common/components/Wrapper';

import stackingServices from '../../common/utils/stackingv2';
import Home from './Home'
import AdminAddresses from './AdminAddresses'
import BonusAddresses from './BonusAddresses'
import Collections from './Collections'
import Txs from './Txs'

const StackingMain = (props) => {
 	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

  	const {UserState, UserDispatch} = React.useContext(UserContext);
	let {collection} = useParams();
	const history = useHistory();

	const [tab, setTab] = React.useState(1)

	const [is_admin, setIsAdmin] = React.useState(false)

	React.useEffect(() => {
		if(!loaded) {
			setLoaded(true)
			stackingServices.isAdmin(
				{address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]},
				UserState,
				(is_admin) => {
					setIsAdmin(is_admin)
				}
			)
		}
		return ()=>setLoaded(false);

	}, []);
  	
  return (<div style={{marginTop: 40}}>
  	<Row style={{overflow: 'visible'}}>
  		<Col lg={3} md={4} sm={6} xs={12} className="bar-left-custom">
  			<h3 className="subtitle">STACKING</h3>
		  	<Button id="back_to_home" color="primary" style={{color: '#fff', margin: '12px 0', display: 'block'}} className="mb-3" size="xs" 
				onClick={async () => history.push("/")}>
					BACK TO HOME
			</Button>
			{
				is_admin
				?
				<div className="vertical_nav">
					<Navbar color="faded" light>
			          <Nav navbar>
			            <NavItem>
			              <NavLink onClick={()=>setTab(1)} className={tab === 1 ? 'current' : ''}>Stake</NavLink>
			            </NavItem>
			            <NavItem>
			              <NavLink onClick={()=>setTab(2)} className={tab === 2 ? 'current' : ''}>ADMIN ADDRESSES</NavLink>
			            </NavItem>
			            <NavItem>
			              <NavLink onClick={()=>setTab(3)} className={tab === 3 ? 'current' : ''}>BONUS ADDRESSES</NavLink>
			            </NavItem>
			            <NavItem>
			              <NavLink onClick={()=>setTab(4)} className={tab === 4 ? 'current' : ''}>COLLECTIONS</NavLink>
			            </NavItem>
			            <NavItem>
			              <NavLink onClick={()=>setTab(5)} className={tab === 5 ? 'current' : ''}>TXS</NavLink>
			            </NavItem>
			          </Nav>
			        </Navbar>
				</div>
				: <div className="vertical_nav">
					<Navbar color="faded" light toggleable={false}>
			          <Nav navbar>
			            <NavItem>
			              <NavLink onClick={()=>setTab(1)} className={tab === 1 ? 'current' : ''}>Stake</NavLink>
			            </NavItem>
			          </Nav>
			        </Navbar>
				</div>
			}

  		</Col>
  		<Col>
  			{
				is_admin
				?
				<div>
					{tab == 1 ? <Home /> : null}
					{tab == 2 ? <AdminAddresses /> : null}
					{tab == 3 ? <BonusAddresses /> : null}
					{tab == 4 ? <Collections /> : null}
					{tab == 5 ? <Txs /> : null}
				</div>
				: <Home />
			}
  		</Col>
  	</Row>
  	
  	</div>);
};


export default Wrapper({route: 'StackingMain', 
  hasHeader: false,
  hide_nav: true,
  hasSecondaryHeader: true
}, StackingMain)