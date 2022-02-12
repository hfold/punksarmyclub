import React from 'react';

import ReadOnly from '../utils/readonly';
import {
  UserContext
} from '../../store/UserContext';
import GetPunkByMetadata from './GetPunkByMetadata';
import globals from '../utils/globals';

export default function GetPunk(props) {
	const [loaded, setLoaded] = React.useState(false)
	const [url, setUrl] = React.useState(null)
	const {UserState, UserDispatch} = React.useContext(UserContext);

	React.useEffect( () => {
		if(!loaded && props.id) {
		    ReadOnly.getPunk({token_id: props.id}, UserState, globals.COLLECTIONS[props.collection], (result) => {
		    	console.log('response get punk', result)
		    	setUrl(result.value?.metadata_url?.value || null)
		    	setLoaded(true);

		    }, (err)=>null)
		}
	});

	return loaded && url ? <GetPunkByMetadata metadata_url={url} collection={globals.COLLECTIONS[props.collection]} /> : null
}