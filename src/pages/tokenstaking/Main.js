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

import CurrencyInput from 'react-currency-input-field';

import Wrapper from '../../common/components/Wrapper';
import MempoolTxs from '../../common/components/MempoolTxs';
import globals from '../../common/utils/globals'
import staking from '../../common/utils/tokenstaking'
import {
  	useParams,
  	useLocation,
  	useHistory
} from "react-router-dom";


const getTokenBalance = (balance) => {
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

	const [contract_balance, setContractBalance] = React.useState(0)
	const [gain, setGain] = React.useState(0)
	const [idxs, setIdxs] = React.useState({
		'current-stake-cycle-id': {value: null},
		'next-stake-cycle-id': {value: null},
		'stake-cycle-id': {value: null}
	})
	const [current_staking,setCurrentStaking] = React.useState({
		'addresses': {type: 'uint', value: '0'},
		'end-block-height': {type: 'uint', value: '0'},
		'open-registration': {type: 'bool', value: true},
		'released': {type: 'bool', value: false},
		'stacks-ctx-percentage': {type: 'uint', value: '0'},
		'start-block-height': {type: 'uint', value: '0'},
		'total-staked': {type: 'uint', value: '0'},
	})
	const [next_staking,setNextStaking] = React.useState({
		'addresses': {type: 'uint', value: '0'},
		'end-block-height': {type: 'uint', value: '0'},
		'open-registration': {type: 'bool', value: true},
		'released': {type: 'bool', value: false},
		'stacks-ctx-percentage': {type: 'uint', value: '0'},
		'start-block-height': {type: 'uint', value: '0'},
		'total-staked': {type: 'uint', value: '0'},
	})
	const [can_delegate, setCanDelegate] = React.useState(false)
	const [can_undelegate, setCanUndelegate] = React.useState(false)

	const [balance, setBalance] = React.useState({
		stx: {type: 'uint', value: '0'},
		token: {type: 'uint', value: '0'}
	})

	const [is_staking, setIsStaking] = React.useState({
		'is-staking': {type: 'bool', value: false},
		'staking-data': {type: '(optional none)', value: null}
	})
	const [current_height, setCurrentHeight] = React.useState(0)
	const [is_admin, setIsAdmin] = React.useState(false)


	const [stx, setStx] = React.useState(0)
	const [adding, setAdding] = React.useState(false)


	const [token, setToken] = React.useState(0)
	const [delegating, setDelegating] = React.useState(false)
	const [stopping, setStopping] = React.useState(false)
	const [number_of_cycles, setNumberOfCycles] = React.useState(1)
	React.useEffect(() => {
		if(!loaded) {
			
			setLoaded(true)

			let balance_url = globals.STACKS_API_BASE_URL+"/extended/v1/address/"+window.STAKING_TOKEN_CONTRACT+"/balances"
			fetch(balance_url)
		      .then(res => res.json())
		      .then(
		        (result) => {
		        	console.log('CONTRACT BALANCE', result.stx.balance)
		          	setContractBalance(result.stx.balance)

		        },
		        (error) => {
		        	console.log('err', error)
		        }
		      )
			
			staking.isAdmin(
					{ address:UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] },
					UserState,
					(res)=>{
						console.log('IS ADMON', res)
						setIsAdmin(res)
					},
					(err) => {
						console.log('err', err)
					}
				)
			
			staking.extimatedTotalCycleGain(
					{ },
					UserState,
					(res)=>{
						console.log('GAIN', res)
						setGain(res)
					},
					(err) => {
						console.log('err', err)
					}
				)

			staking.getCurrentCyclesIdx(
					{ },
					UserState,
					(res)=>{
						console.log('IDXS', res)
						setIdxs(res)

						staking.getStakingStatus(
							{cycle_id: parseInt(res['current-stake-cycle-id'].value)},
							UserState,
							(res)=>{
								console.log('CURRENT STAKING', res)
								setCurrentStaking(res)
							},
							(err) => {
								console.log('err', err)
							}
							)

						staking.getStakingStatus(
							{cycle_id: parseInt(res['next-stake-cycle-id'].value)},
							UserState,
							(res)=>{
								console.log('NEXT STAKING', res)
								setNextStaking(res)
							},
							(err) => {
								console.log('err', err)
							}
							)
					},
					(err) => {
						console.log('err', err)
					}
				)
			
			staking.canDelegate(
					{ address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] },
					UserState,
					(res)=>{
						console.log('CAN DELEGATE', res)
						setCanDelegate(res)
					},
					(err) => {
						console.log('err', err)
					}
				)

			staking.canUndelegate(
					{ address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] },
					UserState,
					(res)=>{
						console.log('CAN UNDELEGATE', res)
						setCanUndelegate(res == 'true' ? true : false)
					},
					(err) => {
						console.log('err', err)
					}
				)

			staking.isStakingAddress(
					{ address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] },
					UserState,
					(res)=>{
						console.log('IS STAKING', res)
						setIsStaking(res)
					},
					(err) => {
						console.log('err', err)
					}
				)

			
			staking.getAddressBalance(
					{ address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] },
					UserState,
					(res)=>{
						console.log('ADDRESS BALANCE', res)
						setBalance(res)
					},
					(err) => {
						console.log('err', err)
					}
				)

			staking.getCurrentBlockHeight(
					{  },
					UserState,
					(res)=>{
						console.log('CURRENT HEIGHT', res)
						setCurrentHeight(res)
					},
					(err) => {
						console.log('err', err)
					}
				)

			
		}

	}, []);	

	return <div>
		<Button id="back_to_home" color="danger" style={{color: '#fff', marginBottom: '12px'}} className="mb-3" size="lg" 
		onClick={async () => history.push("/")}>
			<b>BACK TO HOME</b>
		</Button>
		<MempoolTxs functions={['fund', 'delegate-token', 'undelegate', 'stop-staking-till-next']} contract={window.STAKING_TOKEN_CONTRACT} />
		<Row>
			<Col xl={4} md={12} sm={12} style={{marginTop: 12}}>
				<h3 className="subtitle no-border" style={{marginTop: 24}}>INFO</h3>
				<div className="w_box">
					<Row>
						<Col xs={6}>
						<span style={{fontSize: 39, fontWeight: 'bold'}}>STX</span><br />
						<span style={{fontWeight: 900, color: '#aaaaaa', position: 'relative', top: -10}}>CONTRACT</span></Col>
						<Col xs={6}>
							<span style={{lineHeight: '70px', fontSize: 22}}>{getTokenBalance(parseInt(contract_balance))}</span>
						</Col>
					</Row>
					<Row>
						<Col xs={6}>
						<span style={{fontSize: 39, fontWeight: 'bold'}}>$ROMA</span><br />
						<span style={{fontWeight: 900, color: '#aaaaaa', position: 'relative', top: -10}}>ACCOUNT</span></Col>
						<Col xs={6}>
							<span style={{lineHeight: '70px', fontSize: 22}}>{getTokenBalance(parseInt(balance.token.value))}</span>
						</Col>
					</Row>
					<p><b>CURRENT BLOCK HEIGHT: {current_height}</b></p>
					{
						is_admin
						?
						<div>
						<hr />
						<b>FUND THE CONTRACT</b>
						<FormGroup floating>
							<CurrencyInput 
							decimalSeparator="." groupSeparator=","
							className="form-control" id="fee" value={stx} onValueChange={(value, name) => {
								setStx(value)
							}} />
							<Label for="fee">
						        STX funds
					      	</Label>
						</FormGroup>
						<Button id="fund_account" block color="primary" style={{color: '#fff'}} 
							className="mb-3" size="lg" onClick={async () => {

					      		let full_value = ""
					      		let _stx = stx || "0";
					      		let value = _stx.split(".");
					      		console.log('splitted', value)

					      		full_value += String(value[0]);
					      		if(value[1]) {
					      			let decimals = String(value[1]);
					      			if(decimals.length == 1) decimals += "0";
					      		
					      			full_value += decimals
					      		} else {
					      			full_value += "00";
					      		}
					      		

					      		let stx_full_value = parseInt(full_value*10000)
					      		
					      		if(adding) return;
					      		setAdding(true)

					      		
					      		staking.fund(
					      			{amount:stx_full_value}, 
					      			UserState, 
					      			doContractCall, (result)=>{
					      			
					      			setAdding(false)

					      		}, (result)=>{
					      			setAdding(false)
					      			
					      		})

							      	}}>
								{adding ? <Spinner size="sm" /> : <b>Confirm</b>}
							</Button>
						</div>
						: null
					}
				</div>
			</Col>
			<Col xl={4} md={6} sm={12} style={{marginTop: 12}}>
				<h3 className="subtitle no-border" style={{marginTop: 24}}>CURRENT CYCLE</h3>
				{
					parseInt(current_staking['start-block-height'].value) > 0
					?
					<div className="w_box">
						<h3><b>#{idxs['current-stake-cycle-id'].value}</b></h3>
						<p><b>START AT BLOCK</b> {current_staking['start-block-height'].value}<br />
							<b>END AT BLOCK</b> {current_staking['end-block-height'].value}</p>
						<p>
							{
								current_height >= parseInt(current_staking['start-block-height'].value) && current_height <= parseInt(current_staking['end-block-height'].value)
								? <b className="text-danger">RUNNING</b>
								: <React.Fragment>{
									parseInt(current_staking['start-block-height'].value) > 
									parseInt(current_height) &&
									current_staking['open-registration'] == 'true'
									? <b className="text-success">REGISTRATIONS ARE OPEN</b> : <b>CLOSED</b>
								}</React.Fragment>
							}
						</p>
						<Row>
							<Col xs={6}>
							<span style={{fontSize: 39, fontWeight: 'bold'}}>STX</span><br />
							<span style={{fontWeight: 900, color: '#aaaaaa', position: 'relative', top: -10}}>DISTRIBUTION</span></Col>
							<Col xs={6}>
								<span style={{lineHeight: '70px', fontSize: 22}}>{getTokenBalance(parseInt(gain))}</span>
							</Col>
						</Row>
						<Row>
							<Col xs={6}>
							<span style={{fontSize: 39, fontWeight: 'bold'}}>$ROMA</span><br />
							<span style={{fontWeight: 900, color: '#aaaaaa', position: 'relative', top: -10}}>TOTALLY STAKED</span></Col>
							<Col xs={6}>
								<span style={{lineHeight: '70px', fontSize: 22}}>{getTokenBalance(parseInt(current_staking['total-staked'].value))}</span>
							</Col>
						</Row>
						{
							is_staking['is-staking'].value
							?
							<React.Fragment>
								<Row>
									<Col xs={6}>
									<span style={{fontSize: 39, fontWeight: 'bold'}} className="text-success">$ROMA</span><br />
									<span style={{fontWeight: 900, color: '#aaaaaa', position: 'relative', top: -10}}>YOUR STAKE</span></Col>
									<Col xs={6}>
										<span style={{lineHeight: '70px', fontSize: 22}}>{getTokenBalance(parseInt(is_staking['staking-data'].value.amount.value))}</span>
									</Col>
								</Row>
								<Row>
									<Col xs={6}>
									<span style={{fontSize: 39, fontWeight: 'bold'}} className="text-success">STX</span><br />
									<span style={{fontWeight: 900, color: '#aaaaaa', position: 'relative', top: -10}}>EXT. GAIN</span></Col>
									<Col xs={6}>
										<span style={{lineHeight: '70px', fontSize: 22}}>{getTokenBalance(
											parseInt(gain) /
											parseInt(
												parseInt(current_staking['total-staked'].value) / parseInt(is_staking['staking-data'].value.amount.value)
											)
										)}</span>
									</Col>
								</Row>
							</React.Fragment>
							: null
						}

						{can_delegate ? 
						<React.Fragment>
						<b>DELEGATE $ROMA</b>
						<FormGroup floating>
							<CurrencyInput 
							decimalSeparator="." groupSeparator=","
							className="form-control" id="fee" value={token} onValueChange={(value, name) => {
								setToken(value)

							}} />
							<Label for="fee">
						        $ROMA amount
					      	</Label>
						</FormGroup>
						<FormGroup floating>
							<Input value={number_of_cycles} type="number" id="max_mint" onChange={(e)=>setNumberOfCycles(e.target.value)} />
							<Label for="max_mint">
						        Number of cycles
					      	</Label>
						</FormGroup>
						<Button id="fund_account" block color="primary" style={{color: '#fff'}} 
							className="mb-3" size="lg" onClick={async () => {

					      		let full_value = ""
					      		let _token = token || "0";
					      		_token = _token.replace(/,/g,"")
					      		let value = _token.split(".");
					      		console.log('splitted', value)

					      		full_value += String(value[0]);
					      		if(value[1]) {
					      			let decimals = String(value[1]);
					      			if(decimals.length == 1) decimals += "0";
					      		
					      			full_value += decimals
					      		} else {
					      			full_value += "00";
					      		}
					      		

					      		let token_full_value = parseInt(full_value*10000)

					      		if(token_full_value <= 0 || token_full_value > parseInt(balance.token.value)) {
					      			alert('INVALID VALUE')
					      			return;
					      		}
					      		
					      		if(delegating) return;
					      		setDelegating(true)

					      		
					      		staking.delegateToken(
					      			{
					      				cycle_id: parseInt(idxs['current-stake-cycle-id'].value),
					      				number_of_cycles: number_of_cycles,
					      				amount:token_full_value
					      			}, 
					      			UserState, 
					      			doContractCall, (result)=>{
					      			
					      			setDelegating(true)

					      		}, (result)=>{
					      			setDelegating(false)
					      			
					      		})

							      	}}>
								{delegating ? <Spinner size="sm" /> : <b>DELEGATE $ROMA</b>}
						</Button>
						</React.Fragment>
						: null}

						{can_undelegate ? 
						<React.Fragment>
						<b>UNDELEGATE $ROMA</b>
						<Button id="fund_account" block color="primary" style={{color: '#fff'}} 
							className="mb-3" size="lg" onClick={async () => {

					      		
					      		if(delegating) return;
					      		setDelegating(true)

					      		let amount = 0;
					      		try {
					      			amount = parseInt(is_staking['staking-data'].value.amount.value)
					      		} catch(e) {

					      		}
					      		
					      		staking.undelegateToken(
					      			{
					      				address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
					      				amount: amount
					      			}, 
					      			UserState, 
					      			doContractCall, (result)=>{
					      			
					      			setDelegating(false)

					      		}, (result)=>{
					      			setDelegating(false)
					      			
					      		})

							      	}}>
								{delegating ? <Spinner size="sm" /> : <b>UNDELEGATE $ROMA</b>}
						</Button>
						</React.Fragment>
						: null}

						{is_staking['is-staking'].value ? 
						<React.Fragment>
							<b>END STAKING TILL NEXT CYCLE</b><br />
							<small>* this will take effect at the end of current cycle</small>
							<Button id="fund_account" block color="primary" style={{color: '#fff'}} 
								className="mb-3" size="lg" onClick={async () => {

						      		if(stopping) return;
						      		setStopping(true)
						      		
						      		staking.stopStaking(
						      			{
						      				address: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
						      			}, 
						      			UserState, 
						      			doContractCall, (result)=>{
						      			
						      			setStopping(false)

						      		}, (result)=>{
						      			setStopping(false)
						      			
						      		})

								      	}}>
									{stopping ? <Spinner size="sm" /> : <b>STOP STAKING $ROMA</b>}
							</Button>
						</React.Fragment>
						: null}


					</div>
					: null
				}
			</Col>
			<Col xl={4} md={6} sm={12} style={{marginTop: 12}}>
				<h3 className="subtitle no-border superbig">NEXT CYCLE #{parseInt(idxs['current-stake-cycle-id'].value)+1}
					{parseInt(next_staking['start-block-height'].value) > 0 ? 
					' WILL START AT ' + next_staking['start-block-height'].value : ' TBD'}
				</h3>
			</Col>
	</Row> 
	</div>
}



export default Wrapper({route: 'MainStakingToken', 
  hasHeader: false,
  hide_nav: true,
  hasSecondaryHeader: true
}, Home)