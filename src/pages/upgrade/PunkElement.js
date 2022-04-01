import React from 'react';
import {FormGroup, Input, Label, Button, Spinner,
UncontrolledPopover,
PopoverHeader,
PopoverBody,
Alert,
Row,
Col,
List
} from 'reactstrap';

import CodeEditor from '@uiw/react-textarea-code-editor';

import contractCall from '../../common/utils/contractCall';
import {
  UserContext
} from '../../store/UserContext';

import { useConnect } from "@stacks/connect-react";

import GetPunkByMetadata from '../../common/components/GetPunkByMetadata';



import Wrapper from '../../common/components/Wrapper';
import formatters from '../../common/utils/formatter';
import globals from '../../common/utils/globals'
import upgrade from '../../common/utils/upgrade'
import {
  	useParams,
  	useLocation
} from "react-router-dom";

function PunkElement (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [url,setUrl] = React.useState(null)
	const [el,setEl] = React.useState({})

	

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			console.log('prendo nft', props)
			setTimeout(()=>{
				upgrade.getNft(
					{ token_id: props.nft_id },
					UserState,
					{
						address: props.ctx.address,
						ctr_name: props.ctx.name
					},
					async (res)=>{
						console.log('nft results id ' + props.nft_id, res)
						//setNft(res)
						
						let u = await formatters.ipfs_gateway( res.value );
						console.log('prendo valore da url', u)
						fetch( u )
					      .then(re => {
					      	return re.json()
					      })
					      .then(
					        (result) => {

					        	console.log('PUNK RESULT ID ' + props.nft_id, result)
					        	let add = result.attributes && result.attributes.length > 0 ? true : false;
					        	if(result.attributes){
					        		result.attributes.map(attr => {

					        			if(attr.trait_type == 'Hand') add = false;

					        			return attr;
					        		})
					        	}

					        	if(add) {
					        		setEl(result)
					        	}
					        },
					        (error) => {
					          console.log('ERROR SINGLE NFT ID: '  + props.nft_id, error)
					        }
					      )

					},
					(err) => {
						console.log('err', err)
					}
				)
			}, props.n_el * 300)
			
		}

	}, []);	

	return el.image ? <Col xl={4} md={6} sm={12}><div className={"upgrade_avaible" + ((props.selected && props.selected.nft_id == props.nft_id) ? ' selected' : '')}>
		<img onClick={() => {
			if(props.selected && props.selected.nft_id == props.nft_id) {
				props.onSelect(null)
			} else {
				props.onSelect({...el, nft_id: props.nft_id})
			}
			
		}} style={{width: '100%', height: 'auto'}} src={formatters.ipfs_gateway(el.image)} />
	</div></Col> : null
}



export default PunkElement