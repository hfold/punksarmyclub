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

import { BsDiscord, BsTwitter, BsMedium } from "react-icons/bs";
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
			<Col lg={collection ? 5 : 12} md={12}>
				<div className={collection ? "text-right" : "text-center"}>
					<h1 className="title" style={{textAlign: collection ? 'right' : 'center'}}>Punks Army<br />NFTs Club</h1>	
					<a className="social_url" href={window.TWITTER_URL} target="_blank"><BsTwitter /></a> 
					<a className="social_url" href={window.DISCORD_URL} target="_blank"><BsDiscord /></a>
					<a className="social_url" href={window.MEDIUM_URL} target="_blank"><BsMedium /></a> 
				</div>
			</Col>
			{
				collection 
				?
				<Col lg={7} md={12}>
					<h3 className="subtitle" style={{marginTop: 28, marginBottom: -30}}>Current collection</h3>
					<Row style={{padding: '40px 20px 0', overflow: 'visible'}}>
						{
							Object.keys(globals.COLLECTIONS).filter(el => el === collection).map((collection_key, i, list) => {
								
								let _collection = globals.COLLECTIONS[collection_key]
								let cls = 'collection_info'
								if(!_collection.enabled) cls += ' disabled';
								if(collection && collection == collection_key) cls += ' current';
								if(collection && _collection.enabled && collection != collection_key) cls += ' not_current';
								
								return <React.Fragment key={"collection_"+i}>
								<Col md={6} sm={6} xs={12}>
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
						        </Col>
						        <Col md={6} sm={6} xs={12}>
									{
						            	has_full_gallery(collection_key)
						            	?
						            	<Button id="open_full_gallery" color="default" style={{
						            		color: '#fff', display: 'block'}} className="mb-3" size="xs" 
										onClick={async () => history.push("/"+collection_key+"/gallery")}>
											GALLERY
										</Button>
						            	: null
						            }
						            {
						            	has_rarity(collection_key)
						            	?
						            	<Button id="open_full_gallery" color="primary" style={{
						            		color: '#fff'
						            	}} className="mb-3" size="xs" 
										onClick={async () => history.push("/"+collection_key+"/rarity")}>
											RARITY CHECK
										</Button>
						            	: null
						            }
						            <Button id="open_full_gallery" color="primary" style={{
					            		color: '#fff'
					            	}} className="mb-3" size="xs" 
									onClick={async () => history.push("/")}>
										CHOOSE ANOTHER COLLECTION
									</Button>
								</Col>
						        </React.Fragment>
							})
						}
			        </Row>
				</Col>
				: null
			}
				
		</Row>
		
		{/* <Row>
			<Col lg={8} md={12} className="offset-lg-2 offset-md-0">
				<p style={{textAlign: 'center'}}>
				{window.STAKING_TOKEN_CONTRACT && UserState.logged ?
				<Button id="" color="danger" style={{color: '#fff', margin: '12px', fontSize: 28, borderWidth: 4}} className="mb-3" size="lg" 
				onClick={async () => history.push("/tokenstaking")}>
					<b>STAKE ROMA TO GET STX</b>
				</Button> : null}
				{window.UPGRADE_CONTRACT && UserState.logged ?
					<Button id="back_to_home" color="danger" style={{color: '#fff', margin: '12px', fontSize: 28}} className="mb-3 main-btn" size="lg" 
					onClick={async () => history.push("/upgrade")}>
						<b>UPGRADE YOUR PUNK</b>
					</Button>
					: null
				}
				</p>
			</Col>
		</Row> */}

		
			{/* window.UPGRADE_CONTRACT && UserState.logged ? <Row>
			<Col lg={8} md={12} className="offset-lg-2 offset-md-0">
				<p style={{color: '#fff', fontSize: 44, textAlign: 'center', fontWeight: 'bold', marginTop: 50, marginBottom: 40}}>
					Roma Staking is live!!
				</p> */}
				{/* <p style={{textAlign: 'center'}}>
				<Button id="back_to_home" color="danger" style={{color: '#fff', margin: '12px', fontSize: 28}} className="mb-3 main-btn" size="lg" 
				onClick={async () => history.push("/upgrade")}>
					<b>UPGRADE YOUR PUNK</b>
				</Button>
				</p> */}
			{/* </Col>
		</Row>: null */}
		
		{/* {window.STACKING || window.STACKING_V2 ? <Row>
			<Col lg={6} md={6} className="offset-lg-3 offset-md-0">
				<p style={{textAlign: 'center'}}>
				{UserState.logged && window.STACKING ? <Button id="back_to_home" color="primary" style={{color: '#fff', margin: '12px'}} className="mb-3" size="lg" 
				onClick={async () => history.push("/staking")}>
					<b>GO TO STAKING V1</b>
				</Button> : null }
				{UserState.logged && window.STACKING_V2 ? <Button id="back_to_home" color="danger" style={{color: '#fff', margin: '12px'}} className="mb-3" size="lg" 
				onClick={async () => history.push("/stakingv2")}>
					<b>GO TO STAKING V2</b>
				</Button> : null }
				</p>
			</Col>
		</Row>: null} */}

		
		
		
		{
			!collection
			?
			<React.Fragment>
				{/* <p style={{color: '#fff', fontSize: 44, textAlign: 'center', fontWeight: 'bold', marginTop: 50, marginBottom: 40}}>
					PA Monkeys: Mint start at 11AM GMT+0 🔥
				</p> */}
				{UserState.logged ?
				<h2 className="call_to_action_choose_collection" style={{padding: 20}}>
			        <TweenOne
			          animation={{ 
			            y: -5, 
			            yoyo: true, 
			            repeat: -1, 
			            duration: 500
			          }}
			          paused={false}
			          className="code-box-shape">
						 30/05 at 12:30PM GMT+0 <br/>
						 🔥 Punks Army Monkeys Public Mint 🔥 <br/>
					<BsArrowDownCircle /></TweenOne>
		        </h2>
		        : <SignIn />
		    	}
				
				<Row>
					{
						Object.keys(globals.COLLECTIONS2).map((collection_key, i, list) => {
							
							let _collection = globals.COLLECTIONS2[collection_key]
							let cls = 'collection_info'
							if(!_collection.enabled) cls += ' disabled';
							if(collection && collection == collection_key) cls += ' current';
							if(collection && _collection.enabled && collection != collection_key) cls += ' not_current';
							
							return <Col md={4} sm={12} className="offset-lg-4" style={{overflow: 'visible'}} key={"collection_"+i}>
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
				            {
				            	has_rarity(collection_key)
				            	?
				            	<Button id="open_full_gallery" color="primary" style={{
				            		color: '#fff', margin: '-24px auto', display: 'block', 
				            		marginTop: 12
				            	}} className="mb-3" size="xs" 
								onClick={async () => history.push("/"+collection_key+"/rarity")}>
									RARITY CHECK
								</Button>
				            	: null
				            }
				          </Col>
						})
					}
				</Row>



				{UserState.logged ?
				<h3 className="call_to_action_choose_collection" style={{padding: 20}}>
			        
			        <TweenOne
			          animation={{ 
			            y: -5, 
			            yoyo: true, 
			            repeat: -1, 
			            duration: 500
			          }}
			          paused={false}
			          
			          className="code-box-shape"
			        >
			        Choose a DApp
			        </TweenOne>
			        <TweenOne
			          animation={{ 
			            y: -5, 
			            yoyo: true, 
			            repeat: -1, 
			            duration: 500
			          }}
			          paused={false}
			          
			          className="code-box-shape"
			        ><BsArrowDownCircle /></TweenOne>
		        </h3>
		        : <SignIn />
		    	}


				<Row>
					{
						Object.keys(globals.DAPPS).map((dapps_key, i, list) => {
							
							let _dapps = globals.DAPPS[dapps_key]
							let cls = 'collection_info'
							if(!_dapps.enabled) cls += ' disabled';
							
							return <Col md={3} sm={12} style={{overflow: 'visible'}} key={"dapps_"+i}>
				            <div className={cls} onClick={()=>{
				            	if(!_dapps.enabled) return;

				            	history.push("/"+globals.DAPPS[dapps_key].url);
				            }}>
				              <div className="img_container">
				              	<img src={"images/"+_dapps.main_image} />
				              </div>
				              {/* <div className="logo_image_container" 
				              ><img src={"images/"+_dapps.logo_image} /></div> */}
				              <h3>{_dapps.name}</h3>
				              <p>{_dapps.description}</p>
				            </div>				       
				          </Col>
						})
					}
				</Row>

				<h3 className="call_to_action_choose_collection" style={{padding: 20}}>
			        
			        <TweenOne
			          animation={{ 
			            y: -5, 
			            yoyo: true, 
			            repeat: -1, 
			            duration: 500
			          }}
			          paused={false}
			          
			          className="code-box-shape"
			        >
			        Choose a collection
			        </TweenOne>
			        <TweenOne
			          animation={{ 
			            y: -5, 
			            yoyo: true, 
			            repeat: -1, 
			            duration: 500
			          }}
			          paused={false}
			          
			          className="code-box-shape"
			        ><BsArrowDownCircle /></TweenOne>
		        </h3>

				<Row>
					{
						Object.keys(globals.COLLECTIONS).map((collection_key, i, list) => {
							
							let _collection = globals.COLLECTIONS[collection_key]
							let cls = 'collection_info'
							if(!_collection.enabled) cls += ' disabled';
							if(collection && collection == collection_key) cls += ' current';
							if(collection && _collection.enabled && collection != collection_key) cls += ' not_current';
							
							return <Col md={3} sm={12} style={{overflow: 'visible'}} key={"collection_"+i}>
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
				            {
				            	has_rarity(collection_key)
				            	?
				            	<Button id="open_full_gallery" color="primary" style={{
				            		color: '#fff', margin: '-24px auto', display: 'block', 
				            		marginTop: 12
				            	}} className="mb-3" size="xs" 
								onClick={async () => history.push("/"+collection_key+"/rarity")}>
									RARITY CHECK
								</Button>
				            	: null
				            }
				          </Col>
						})
					}
				</Row>
			</React.Fragment>
			: null
		}
		{
			!props.hide_nav
			?
				<Navbar />
			: null
		}
	</Container>
}