import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Button, Spinner } from 'reactstrap';

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

import globals from '../common/utils/globals';
import {
  UserContext
} from '../store/UserContext';
import GetPunk from '../common/components/GetPunk';
const YourPunks = (props) => {
 	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

  	const [punks, setPunks] = React.useState([])
  
  	const {UserState, UserDispatch} = React.useContext(UserContext);
	
  	React.useEffect( () => {
		if(!loaded) {

			const load = async () => {
				
			    fetch(globals.STACKS_API_BASE_URL+"/extended/v1/address/"+UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK]+"/nft_events?limit=50")
			      .then(res => res.json())
			      .then(
			        (result) => {
			          setLoaded(true)
			          console.log('res', result)
			          let ids = [];
			          result.nft_events.map(e => {
			          	if(!e.sender && e.asset_identifier == globals.CONTRACT_ADDRESS+"."+globals.CONTRACT_NAME+"::"+globals.TOKEN_STR){
			          		let value = hexToCV(e.value.hex)
			          		try {
			          			let id = cvToJSON( value ).value
			          			if(ids.indexOf(id) === -1) ids.push(id)
			          		} catch(e) {
			          			console.log('e', e)
			          		}
			          	}
			          })

			          setPunks(ids)
			          
			        },
			        (error) => {
			        	setLoaded(true)
			          console.log('e', error)
			        }
			      )
			    
			}

			load()
		    
		}
	});


  return (<div style={{padding: 80}}>{punks.map(id => <GetPunk id={id} key={"punk_id_"+id}/>)}</div>);
};

export default YourPunks;