import React from 'react';

import ReadOnly from '../utils/readonly';
import {
  UserContext
} from '../../store/UserContext';
import formatters from '../utils/formatter';


const getImg = async (url, setUrl, setEl, setImageType) => {
	
	let u = await formatters.ipfs_gateway( url );
	console.log('-------------------------------------------ipfs url', u)

	fetch( u )
	      .then(res => res.json())
	      .then(
	        (result) => {
	          if(result.image) {
	          	setUrl(result.image)
	          	setImageType(result.image_type || 'image')
	          }
	          setEl(result)
	        },
	        (error) => {
	          console.log('e', error)
	        }
	      )
}



export default function GetPunkByMetadata(props) {
	const [loaded, setLoaded] = React.useState(false)
	const [url, setUrl] = React.useState(null)
	const [el, setEl] = React.useState({})
	const [image_type, setImageType] = React.useState(null)
	const {UserState, UserDispatch} = React.useContext(UserContext);

	React.useEffect( () => {
		if(!loaded && props.metadata_url) {
			setLoaded(true)
			getImg(props.metadata_url, setUrl, setEl, setImageType)
		}
	});


	return loaded && url ? <div className="collection_info no_shadow nft_container" onClick={()=>{
					            	UserDispatch({
					            		type: 'open_modal',
					            		punk: el
					            	})
					            }}>
				              <div className="img_container">
				              	{
				              		formatters.video_mime_type.indexOf(image_type) !== -1
				              		?
				              		<video className="video" autoPlay loop muted>
						              	<source src={formatters.ipfs_gateway( el.image )} type="video/mp4"/>
						            </video>
				              		: <img src={formatters.ipfs_gateway( el.image )} />
				              	}
				              </div>
				              {props.collection ? <div className="logo_image_container" 
				              ><img src={"images/"+props.collection.logo_image} /></div> : null}
				              <h3>{el.name}</h3>
				              <p>{el.description}</p>
				            </div> : null
}


