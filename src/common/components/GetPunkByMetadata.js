import React from 'react';

import ReadOnly from '../utils/readonly';
import {
  UserContext
} from '../../store/UserContext';
import {
  CacheContext
} from '../../store/CacheContext';
import formatters from '../utils/formatter';


const fetchImagePromise = async (url) => {
	return new Promise((resolve, reject)=>{

		var xhr = new XMLHttpRequest();
	    xhr.onload = function() {
	        var reader = new FileReader();
	        reader.onloadend = function() {
	            resolve(reader.result);
	        }
	        reader.readAsDataURL(xhr.response);
	    };
	    xhr.open('GET', formatters.ipfs_gateway(url));
	    xhr.responseType = 'blob';
	    xhr.send();

		//fetch(formatters.ipfs_gateway( url ))
		  //.then(response => response.blob())
		  //.then(async (imageBlob) => {
		      //var reader = new FileReader();
		      //const imageObjectURL = await reader.readAsDataURL(imageBlob);
		      //await localStorage.setItem(url, imageObjectURL)
		      //resolve(imageObjectURL)
//
		  //})
		  //.catch((e)=>reject(e));
	})
}

const fetchImage = async (url, setImageUrl, CacheState, CacheDispatch) => {
	console.log('CacheState', CacheState.cachedImgs)
	let cached = CacheState.cachedImgs[url];
	if(cached) {
		
		console.log('ritorno cached', cached)
		//UserDispatch({action: 'cache_image', url: url, response: cached});
		setImageUrl(cached)
	
	} else {

		let img_data = await fetchImagePromise(url);
		CacheDispatch({action: 'cache_image', url: url, response: img_data})
		setImageUrl(img_data);
		  
	}
	console.log('non ritorno nulla')
} 

const getImg = async (url, setUrl, setEl, setImageType, CacheState, CacheDispatch, setImageUrl, setRarityObj) => {
	
	let cached = localStorage.getItem(url);
	if(cached) {
		
		let result = JSON.parse(cached);
		if(result.image) {
	      	setUrl(result.image)
	      	setImageType(result.image_type || 'image');
	      	getRarity(result.image, setRarityObj);
	    }
	    setEl(result)
	    //fetchImage(result.image, setImageUrl, CacheState, CacheDispatch)

	} else {

		let u = await formatters.ipfs_gateway( url );
		console.log('-------------------------------------------ipfs url', u)

		fetch( u )
		      .then(res => res.json())
		      .then(
		        (result) => {
		          if(result.image) {
		          	setUrl(result.image)
		          	//fetchImage(result.image, setImageUrl, CacheState, CacheDispatch)
		          	setImageType(result.image_type || 'image')
		          	getRarity(result.image, setRarityObj);
		          }
		          localStorage.setItem(url, JSON.stringify(result) )
		          setEl(result)
		        },
		        (error) => {
		          console.log('e', error)
		        }
		      )
	}
}

const getRarity = (image_url, setRarityObj) => {
	if(window.rarity && Array.isArray(window.rarity)) {
		let obj = window.rarity.find(el => el.image === image_url)
		if(obj) setRarityObj(obj)
	}
}

export default function GetPunkByMetadata(props) {
	const [loaded, setLoaded] = React.useState(false)
	const [url, setUrl] = React.useState(null)
	const [el, setEl] = React.useState({})
	const [image_type, setImageType] = React.useState(null)
	const [image_url, setImageUrl] = React.useState(null)
	const {UserState, UserDispatch} = React.useContext(UserContext);
	const {CacheState, CacheDispatch} = React.useContext(CacheContext);
	const [rarity_obj, setRarityObj] = React.useState(null);

	React.useEffect( () => {
		if(!loaded && props.metadata_url) {
			setLoaded(true)
			getImg(props.metadata_url, setUrl, setEl, setImageType, CacheState, CacheDispatch, setImageUrl, setRarityObj)

		}
	});


	return loaded && url ? <div className="collection_info no_shadow nft_container" onClick={()=>{
					            	UserDispatch({
					            		type: 'open_modal',
					            		punk: el,
					            		rarity_obj: rarity_obj
					            	})
					            }}>
				              <div className="img_container">
				              	{
				              		formatters.video_mime_type.indexOf(image_type) !== -1
				              		?
				              		<video className="video" autoPlay loop muted>
						              	<source src={formatters.ipfs_gateway(url)} type="video/mp4"/>
						            </video>
				              		: <img src={formatters.ipfs_gateway(url)} />
				              	}
				              </div>
				              {props.collection ? <div className="logo_image_container" 
				              ><img src={"images/"+props.collection.logo_image} /></div> : null}
				              <h3>{el.name}</h3>
				              <p>{el.description}</p>
				              {
				              	rarity_obj && rarity_obj["Rank"]
				              	?
				              	<p style={{overflow: 'auto', whiteSpace: 'inherit'}}><b>Rank:</b> <span className="highlight">{rarity_obj["Rank"]}</span></p>
				              	: null
				              }
				              {
				              	rarity_obj && rarity_obj["Rank Points Bonus"]
				              	?
				              	<p style={{overflow: 'auto', whiteSpace: 'inherit'}}><b>Rank Points Bonus:</b> <span className="highlight">{rarity_obj["Rank Points Bonus"]}</span></p>
				              	: null
				              }
				              {
				              	rarity_obj && rarity_obj["rarity point"] && rarity_obj.rank
				              	?
				              	<div className="ranking_container row">
				              		<div className="col-6"><b>Rarity:</b> <span className="highlight">{rarity_obj["rarity point"]}</span></div>
				              		<div className="col-6"><b>Rank:</b> <span className="highlight">{rarity_obj.rank}</span></div>
				              	</div>
				              	: null
				              }
				              
				            </div> : null
}


