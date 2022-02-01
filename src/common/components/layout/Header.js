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

import { BsDiscord, BsTwitter } from "react-icons/bs";
import { userSession, authOptions } from '../../utils/auth';

import galleries from '../../utils/collections_gallery';
const has_full_gallery = (collection) => {
	try {
		return galleries[globals.COLLECTIONS[collection].full_gallery_name].length > 0
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
		<Row>
			<Col lg={5} md={12}>
				<div className="text-right">
					<h1 className="title">Punks Army<br />NFTs Club</h1>	
					<a className="social_url" href={window.TWITTER_URL} target="_blank"><BsTwitter /></a> 
					<a className="social_url" href={window.DISCORD_URL} target="_blank"><BsDiscord /></a>

					{UserState.logged ? 
						<Dropdown toggle={()=>setIsOpen(!is_open)} isOpen={is_open}>
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
				</div>
			</Col>
			<Col lg={7} md={12}>
				<h3 className="subtitle" style={{marginTop: 28, marginBottom: -30}}>Collections</h3>
				<Row style={{padding: '40px 20px 0', overflow: 'visible'}}>
					{
						Object.keys(globals.COLLECTIONS).map((collection_key, i, list) => {
							
							let _collection = globals.COLLECTIONS[collection_key]
							let cls = 'collection_info'
							if(!_collection.enabled) cls += ' disabled';
							if(collection && collection == collection_key) cls += ' current';
							if(collection && _collection.enabled && collection != collection_key) cls += ' not_current';
							
							return <Col md={4} sm={12} style={{overflow: 'visible'}} key={"collection_"+i}>
				            <div className={cls} onClick={()=>{
				            	if(!_collection.enabled || collection == collection_key) return;

				            	history.push("/"+collection_key+"/mint");
				            }}>
				              <div className="img_container">
				              	<img src={"images/"+_collection.main_image} />
				              </div>
				              <div className="logo_image_container" 
				              ><img src={"images/"+_collection.logo_image} /></div>
				              <h3>{_collection.name}</h3>
				              <p>{_collection.description}</p>
				            </div>
				            {
				            	has_full_gallery(collection_key)
				            	?
				            	<Button id="open_full_gallery" color="primary" style={{
				            		color: '#fff', margin: '-24px auto', display: 'block'}} className="mb-3" size="xs" 
								onClick={async () => history.push("/"+collection_key+"/gallery")}>
									GALLERY
								</Button>
				            	: null
				            }
				          </Col>
						})
					}
		        </Row>
			</Col>
		</Row>
		{
			!props.hide_nav
			?
				<Navbar />
			: null
		}
	</Container>
}