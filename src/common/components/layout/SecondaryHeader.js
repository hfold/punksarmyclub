import React from 'react'

import {
  	useParams,
  	useHistory,
  	useLocation
} from "react-router-dom";
import {Col, Row, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button} from 'reactstrap'
import {
	UserContext
} from '../../../store/UserContext';
import Navbar from './Navbar'
import globals from '../../utils/globals'

import { BsDiscord, BsTwitter, BsMedium} from "react-icons/bs";
import { userSession, authOptions } from '../../utils/auth';

import galleries from '../../utils/collections_gallery';
import TweenOne from 'rc-tween-one';
import SignIn from '../../../pages/SignIn';
import {BsArrowDownCircle} from "react-icons/bs";

const has_full_gallery = (collection) => {
	try {
		return galleries[globals.COLLECTIONS[collection].full_gallery_name].length > 0
	} catch(e) {
		return false;
	}
}
const has_rarity = (collection) => {
	try {
		return globals.COLLECTIONS[collection].has_rarity
	} catch(e) {
		return false;
	}
}

export default function Header(props) {
	const {UserState, UserDispatch} = React.useContext(UserContext);
	
	const [is_open, setIsOpen] = React.useState(false)
	let {collection} = useParams();
	const history = useHistory();
	let location = useLocation();
	React.useEffect(()=>{
		console.log('changed collection', collection)
		if(collection) {
			// collezione non presente o non abilitata
			let _pathname = collection ? "/" + collection + "/gallery" : "/"
			if( (!globals.COLLECTIONS[collection] || !globals.COLLECTIONS[collection].enabled) &&
				location.pathname !== '/' && location.pathname != _pathname
				) {
				history.push("/")
				return;
			}
			
			
		}
	}, [collection])
	
	const logout = () => {
		userSession.signUserOut();
		UserDispatch({
			type: 'logout'
		})
		history.push("/")
	}
	
	return <Container>
		<Row style={{overflow: 'visible'}}>
			{UserState.logged ? 
				<Dropdown toggle={()=>setIsOpen(!is_open)} isOpen={is_open} style={{overflow: 'visible', height: 'auto'}}>
				    <DropdownToggle caret tag="span">
				      {UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]}
				    </DropdownToggle>
				    <DropdownMenu end className="menu_child"
				    >
				    	<DropdownItem onClick={()=>logout()}>
					        Sign Out
					    </DropdownItem>
					</DropdownMenu>
				</Dropdown>
			: null}
		</Row>
		<Row>
			<Col lg={12} md={12}>
				<div className="text-center">
					<h1 className="title" style={{textAlign: collection ? 'right' : 'center'}}>Punks Army<br />NFTs Club</h1>	
					<a className="social_url" href={window.TWITTER_URL} target="_blank"><BsTwitter /></a> 
					<a className="social_url" href={window.DISCORD_URL} target="_blank"><BsDiscord /></a>
					<a className="social_url" href={window.MEDIUM_URL} target="_blank"><BsMedium /></a>
				</div>
			</Col>
		</Row>
	</Container>
}