import React from 'react';
import { userSession, authOptions } from '../common/utils/auth';
import { Connect } from '@stacks/connect-react';
import {
  UserContext
} from '../store/UserContext';

import Home from './Home';
import Mint from './Mint';
import Whitelist from './Whitelist';
import YourPunks from './YourPunks';
import Transactions from './Transactions';
import AddPunks from './AddPunks';
import MintEvent from './MintEvent';
import SignIn from './SignIn';
import Gallery from './Gallery';
import ChangeMetadataUrl from './ChangeMetadataUrl';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  useRouteMatch,
  useParams,
  useHistory,
  Link,
  useMatch,
  useResolvedPath
} from "react-router-dom";

import {Container, Row, Col,
Nav, NavItem,
Modal,
ModalHeader,
ModalBody,
ModalFooter,
List
} from 'reactstrap';

import { io } from "socket.io-client";
import * as stacks from '@stacks/blockchain-api-client';

import globals from '../common/utils/globals';
import formatter from '../common/utils/formatter';

const subscribe = async (address, UserDispatch, UserState) => {

  if(UserState.subscriptions) return;

  const socket = io(globals.STACKS_SOCKET_URL, {
    transports: [ "websocket" ]
  });
  const client = new stacks.StacksApiSocketClient(socket);
  
  let mem = await client.subscribeMempool( event => {
      console.log("-------------------NEW MEMPOOL EVENT-----------------------------")
      console.log(event)
      UserDispatch({
        type: 'add_transaction',
        tx: event
      })
    }
  );

  let micro = await client.subscribeMicroblocks( event => {
      console.log("-------------------NEW MICRO EVENT-----------------------------")
      console.log(event)
      if(event.txs) {
        event.txs.map(tx => {
          UserDispatch({
            type: 'update_transaction',
            tx_id: tx,
            tx: {
              tx_status: 'microblock'
            }
          })
        })
      }
    }
  );

  fetch(globals.STACKS_API_BASE_URL+"/extended/v1/address/"+address+"/transactions?limit=50&unanchored=true")
        .then(res => res.json())
        .then(
          (result) => {
            console.log('-----------------NEW TRANSACTIONS------------------', result)
            result.results.map(tx => UserDispatch({
              type: 'add_transaction',
              tx: tx
            }))
          },
          (error) => {
            
          }
        )


  let pool = setInterval(()=>{
    fetch(globals.STACKS_API_BASE_URL+"/extended/v1/address/"+address+"/transactions?limit=50&unanchored=true")
        .then(res => res.json())
        .then(
          (result) => {
            console.log('-----------------NEW TRANSACTIONS------------------', result)
            result.results.map(tx => UserDispatch({
              type: 'add_transaction',
              tx: tx
            }))
          },
          (error) => {
            
          }
        )
  }, 60*1000)
  
  console.log('subscribed', mem, micro)
  return {pool: pool, micro: micro, mem: mem}
  
}


export default function Main (props) {
  
  const {UserState, UserDispatch} = React.useContext(UserContext)
  const [loaded, setLoaded] = React.useState(false)
  const [subscription, setSubscription] = React.useState(null)

  
  React.useEffect(() => {
    if(!loaded) {

      setLoaded(true);

      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then(userData => {
          window.history.replaceState({}, document.title, '/');
          UserDispatch({
            type: 'update',
            obj: {
              logged: true,
              userData: userData
            }
          });

          //setSubscription(subscribe(userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],UserDispatch,UserState));

        });

      } else if (userSession.isUserSignedIn()) {
        
        let userData = userSession.loadUserData()
        UserDispatch({
          type: 'update',
          obj: {
            logged: true,
            userData: userData
          }
        });
        //setSubscription(subscribe(userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],UserDispatch,UserState));
      }

    }
  });

  return (<Connect authOptions={authOptions}>
        <Router>
          <RoutesList />
        </Router>
        <Modal
          size="xl"
          className="bd-example-modal-lg"
          isOpen={UserState.openModal}
        >
          <ModalHeader toggle={()=>UserDispatch({type:'close_modal'})} >
            {UserState.modalContent.name}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md={6}sm={12}>{UserState.modalContent.image ?
                <>
                {
                  formatter.video_mime_type.indexOf(UserState.modalContent.image_type || 'image') !== -1
                  ?
                  <video style={{width:'100%'}} className="video" autoPlay loop muted>
                    <source src={formatter.ipfs_gateway( UserState.modalContent.image )} type="video/mp4"/>
                  </video>
                  : <img style={{width:'100%'}} src={formatter.ipfs_gateway( UserState.modalContent.image )} />
                }
                </>
                : null 
              }</Col>
              <Col md={6}sm={12}>
                <h3 className="subtitle" style={{marginTop: 24}}>DESCRIPTION</h3>
                {UserState.modalContent.description}
                {UserState.modalContent.rarity_points ? <span style={{display: 'block'}}><b>Rarity:</b> {UserState.modalContent.rarity_points}</span> : null }
                {UserState.modalContent.rank ? <span style={{display: 'block'}}><b>Rank:</b> {UserState.modalContent.rank}</span> : null }
                {UserState.modalContent.attributes && <><h3 className="subtitle no-border" style={{marginTop: 24}}>TRAITS</h3><List type="unstyled" style={{marginTop: 12}}>
                  {
                    UserState.modalContent.attributes.map((a,i,arr)=>{
                      return <li key={"list_a_"+i} style={{color:'#fff'}}>
                        <b>{a.trait_type}</b>: {a.value}
                      </li>
                    })
                  }
                </List></>}
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </Connect>
  );
  
};


function RoutesList() {
  let ok_redirect = useRedirectNotLogged();

  return ok_redirect ? <React.Fragment>
      <Route exact path="/" component={Home} />
      <Route exact path="/:collection/gallery" component={Gallery} />
      <Route exact path="/:collection/mint" component={Mint} />{/* mettiamo qui la lista */}
      <Route exact path="/:collection/nft" component={YourPunks} />
      <Route exact path="/:collection/whitelist" component={Whitelist} />
      <Route exact path="/:collection/event" component={MintEvent} />
      <Route exact path="/:collection/txs" component={Transactions} />
      <Route exact path="/:collection/add" component={AddPunks} />
      <Route exact path="/:collection/meta" component={ChangeMetadataUrl} />
    </React.Fragment> : null
}


function useRedirectNotLogged() {
  const {UserState, UserDispatch} = React.useContext(UserContext)
  const [ok, setOk] = React.useState(false)
  let location = useLocation();
  let {collection} = useParams();
  
  React.useEffect(() => {
    console.log('loc', location)

    
    if(!UserState.logged && location.pathname !== '/' && !location.pathname.match(/gallery/) ) {
      
      setOk(false)
      window.location = '/'
    } else {
      setOk(true)
    }
  }, [location]);

  return ok;
}
