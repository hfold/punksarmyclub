import React from 'react'

import {
  	NavLink,
  	useLocation,
	useRouteMatch,
	useParams,
	useHistory,
} from "react-router-dom";

import {
	Nav, NavItem 
} from 'reactstrap';
import readonly from '../../utils/readonly'
import {
	UserContext
} from '../../../store/UserContext';
import globals from '../../utils/globals'


const isExtended = (collection) => globals.COLLECTIONS[collection].is_extended

export default function Navbar(props) {
	const {UserState, UserDispatch} = React.useContext(UserContext)
  
  let {collection} = useParams();
  const history = useHistory();
  const routeMatch = useRouteMatch();

  const [is_owner, setIsOwner] = React.useState(false)
  
  React.useEffect(()=>{
    console.log('changed collection', collection)
    if(collection) {
      setIsOwner(false)
      // collezione non presente o non abilitata
      if(!globals.COLLECTIONS[collection] || !globals.COLLECTIONS[collection].enabled) {
        
      } else {
      // la collezione è cambiata, resettiamo lo stato dell'utente e vediamo se è owner
        readonly.isCtxOwner([], UserState, globals.COLLECTIONS[collection], (res) => {
          console.log('res', res)
          setIsOwner(res)
        }, (err) => null)
      }
    }
  }, [collection])

  

	return  UserState.logged && collection ? <Nav
                pills
              >
                <NavItem>
                  <NavLink
                  	className={useRouteMatch("/:collection/mint") ? 'active' : ''}
                    to={"/"+collection+"/mint"}
                  >
                    MINT
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                  	className={location.pathname == 'nft' ? 'active' : ''}
                    to={"/"+collection+"/nft"}
                  >
                    NFTS
                  </NavLink>
                </NavItem>
                {is_owner ? <NavItem>
                  <NavLink 
                  className={useRouteMatch("/:collection/whitelist") ? 'active' : ''}
                  to={"/"+collection+"/whitelist"}>
                    Whitelist
                  </NavLink>
                </NavItem> : null}
                {is_owner ? <NavItem>
                  <NavLink 
                  className={useRouteMatch("/:collection/event") ? 'active' : ''}
                  to={"/"+collection+"/event"}>
                    Mint event
                  </NavLink>
                </NavItem> : null}
                {
                  isExtended(collection) && is_owner
                  ?
                  <NavItem>
                    <NavLink 
                    className={useRouteMatch("/:collection/packages") ? 'active' : ''}
                    to={"/"+collection+"/packages"}>
                      Packages
                    </NavLink>
                  </NavItem>
                  : null
                }
                {
                  isExtended(collection) && is_owner
                  ?
                  <NavItem>
                    <NavLink 
                    className={useRouteMatch("/:collection/commission") ? 'active' : ''}
                    to={"/"+collection+"/commission"}>
                      Commissions
                    </NavLink>
                  </NavItem>
                  : null
                }
                {
                  isExtended(collection) && is_owner
                  ?
                  <NavItem>
                    <NavLink 
                    className={useRouteMatch("/:collection/tokens") ? 'active' : ''}
                    to={"/"+collection+"/tokens"}>
                      Tokens and prices
                    </NavLink>
                  </NavItem>
                  : null
                }
                {is_owner ? <NavItem>
                  <NavLink 
                  className={useRouteMatch("/:collection/add") ? 'active' : ''}
                  to={"/"+collection+"/add"}>
                    Add nfts
                  </NavLink>
                  </NavItem> : null}
                {is_owner ? <NavItem><NavLink 
                  className={useRouteMatch("/:collection/meta") ? 'active' : ''}
                  to={"/"+collection+"/meta"}>CH meta
                  </NavLink>
                </NavItem> : null}
                <NavItem>
                  <NavLink 
                  className={useRouteMatch("/:collection/txs") ? 'active' : ''}
                  to={"/"+collection+"/txs"}>
                    Transactions
                  </NavLink>
                </NavItem>
            </Nav> : null
}
