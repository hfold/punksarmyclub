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

function WeaponElement (props) {
	
	const [loaded, setLoaded] = React.useState(false)
	

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	
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
						console.log('nft results', res)
						//setNft(res)
						
						let u = await formatters.ipfs_gateway( res.value );
						fetch( u )
					      .then(re => {
					      	console.log('risultato arma', re)
					      	return re.json()
					      })
					      .then(
					        (result) => {
					        	console.log('result weapon', result)
					        	if(result && result.image) setEl(result)

					        },
					        (error) => {
					          console.log('e', error)
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

	return el.image ? <img onClick={() => {
			if(props.selected && props.selected.nft_id == props.nft_id) {
				props.onSelect(null)
			} else {
				props.onSelect({...el, nft_id: props.nft_id})
			}
		}} style={{width: '100%', height: 'auto'}} src={formatters.ipfs_gateway(el.image)} /> : null
}



export default WeaponElement