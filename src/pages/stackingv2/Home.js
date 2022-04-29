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

import ReadOnly from '../../common/utils/readonly';



import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import stacking from '../../common/utils/stackingv2'
import {
  	useParams,
  	useLocation,
  	useHistory
} from "react-router-dom";

import HomeStackable from './HomeStackable'
import StackingData from './StackingData'

const getStackable = (accountBalance, collections) => {
	if(!accountBalance.non_fungible_tokens || collections.length === 0) return []

	let colls = []
	Object.keys(accountBalance.non_fungible_tokens).map(nft => {
		if(collections.find(c => c.value?.collection?.value === nft.split("::")[0])) colls.push({
			collection: nft.split("::")[0],
			tokenName: nft.split("::")[1],
			fullName: nft 
		})

		return true;
	})

	return colls;
}

const getTokenBalance = (accountBalance) => {
	let balance = 0
	if(accountBalance.fungible_tokens) {
		Object.keys(accountBalance.fungible_tokens).map(k=>{
			if(k.split("::")[0] === window.TOKEN_CONTRACT) balance = accountBalance.fungible_tokens[k].balance
		})
	}

	return parseFloat(balance / 1000000).toFixed(2)
}

function Home (props) {
	const history = useHistory();
	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [_loading, set_Loading] = React.useState(false)
	

	const {doContractCall} = useConnect();
	const {UserState, UserDispatch} = React.useContext(UserContext);

	const [txs, setTxs] = React.useState([]);

	const [collections,setCollections] = React.useState([])
	const [account_balance,setAccountBalance] = React.useState({})

	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)
			
			
			stacking.fullCollectionList(
					{ },
					UserState,
					(res)=>{
						console.log('result collections', res)
						setCollections(res)
					},
					(err) => {
						console.log('err', err)
					}
				)

			let balance_url = globals.STACKS_API_BASE_URL+"/extended/v1/address/"+UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]+"/balances"
			fetch(balance_url)
		      .then(res => res.json())
		      .then(
		        (result) => {
		        	console.log('balance', result)
		          	setAccountBalance(result)

		        },
		        (error) => {
		        	console.log('err', error)
		        }
		      )
		}

	}, []);	

	return <div>
		
		<Row>
		<Col sm={12}>
			{window.STACKING ? <Button id="back_to_home" color="primary" style={{color: '#fff', marginBottom: '12px'}} className="mb-3" size="lg" 
			onClick={async () => history.push("/staking")}>
				<b>GO TO STAKING V1</b>
			</Button> : null }
		</Col>
		<Col sm={12}>
			<MempoolTxs functions={['claim','stake']} contract={window.STACKING_CONTRACT_V2} />
		</Col>
		<Col xl={6} md={8} sm={12}>
			<div  className="w_box">
				<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => {
					if(_loading) return;
					set_Loading(true)
					let balance_url = globals.STACKS_API_BASE_URL+"/extended/v1/address/"+UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]+"/balances"
					fetch(balance_url)
				      .then(res => res.json())
				      .then(
				        (result) => {
				        	console.log('balance', result)
				          	setAccountBalance(result)
				          	set_Loading(false)
				        },
				        (error) => {
				        	console.log('err', error)
				        	set_Loading(false)
				        }
				      )

				}}>
					{_loading ? <Spinner size="sm" /> : "Refresh balance"}
				</Button>
				<p><b>$ROMA BALANCE:</b> {getTokenBalance(account_balance)}</p>
			</div>
		</Col>
		<Col xl={6} md={4} sm={12}>
		</Col>
		<Row>
			<Col sm={12}>
				<h3 className="subtitle" style={{marginTop: 24}}>CURRENT STAKING</h3>
			</Col>
			<StackingData />
		</Row>
		<Row>
			<Col xl={12}>
				<h2 style={{color: '#fff'}}>Avaible nft to stake</h2>
				<Button id="confirm_add" color="primary" style={{color: '#fff'}} className="mb-3" size="xs" 
				onClick={async () => {
					if(loading) return;
					setLoading(true)
					stacking.fullCollectionList(
						{ },
						UserState,
						(res)=>{
							console.log('result collections', res)
							setCollections(res)
							setLoading(false)
						},
						(err) => {
							console.log('err', err)
							setLoading(false)
						}
					)

				}}>
					{loading ? <Spinner size="sm" /> : "Refresh collections"}
				</Button>
				<div style={{marginTop: 24}}>
					{getStackable(account_balance, collections).map(c => 
						<div>
							<h3 className="subtitle">{c.tokenName}</h3>
							<HomeStackable collection={c} />
						</div>)}
				</div>
			</Col>
		</Row>
	</Row> 
	</div>
}



export default Home