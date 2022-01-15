import React from 'react';

import ReadOnly from '../utils/readonly';
import {
  UserContext
} from '../../store/UserContext';

export default function GetPunk(props) {
	const [loaded, setLoaded] = React.useState(false)
	const [url, setUrl] = React.useState(null)
	const {UserState, UserDispatch} = React.useContext(UserContext);

	React.useEffect( () => {
		if(!loaded && props.id) {
		    ReadOnly.getPunk({token_id: props.id}, UserState, (result) => {
		    	
		    	if(result.value?.metadata_url?.value) {

		    		fetch(result.value?.metadata_url?.value)
				      .then(res => res.json())
				      .then(
				        (result) => {
				          if(result.image) setUrl(result.image)

				          setLoaded(true)
				        },
				        (error) => {
				        	setLoaded(true)
				          console.log('e', error)
				        }
				      )

		    	} else {
		    		setUrl(result.value?.image?.value || null)
		    		setLoaded(true)
		    	}

		    }, (err)=>null)
		}
	});

	return loaded && url ? <img className="punk-image" src={url} /> : null
}