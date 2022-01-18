import React from 'react'
import { useConnect } from "@stacks/connect-react";
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {callReadOnlyFunction} from '@stacks/transactions';
import { Person } from '@stacks/profile';


import { Button, Spinner, Row, Col, Container, 
	Nav, NavItem, NavLink 
} from 'reactstrap';
import ReadOnly from '../common/utils/readonly';
import {
  UserContext
} from '../store/UserContext';
import { userSession } from '../common/utils/auth';

import Whitelist from './Whitelist'
import MintEvent from './MintEvent'
import AddPunks from './AddPunks'
import Mint from './Mint'
import Transactions from './Transactions'
import YourPunks from './YourPunks'
import globals from '../common/utils/globals';



const avatarUrl = (UserState) => {
    const person = new Person(UserState.userData.profile)
    return person.avatarUrl();
  };




export default class SignedInClass extends React.Component {

	static contextType = UserContext;

	state = {
		loading: true,
		mounted: false,
		currentTab: 'none'
	}

	

	componentDidMount() {
		ReadOnly.isCtxOwner([], this.context.UserState, (result) => {
	    	
	    	this.setState({loading: false, currentTab: 'mint'})
	    	this.context.UserDispatch({
	    		type: 'update',
	    		obj: {
	    			isOwner: result
	    		}
	    	})
	    })
	}
	
	getChild() {
		switch(this.state.currentTab){
			case 'mint': return <Mint />
			case 'whitelist': return <Whitelist />
			case 'event': return <MintEvent />
			case 'add_punk': return <AddPunks />
			case 'txs': return <Transactions />
			case 'minted': return <YourPunks />
			default: return null
		}
	}

	render() {
		return <Container fluid={true}>
			<Row>
				
				<Col xs={12} sm={12} md={12}>
					<div style={{marginTop: 28, marginBottom: 28}}>
						<div>
							<b>ADDRESS</b>: {this.context.UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]}<br />
							<a href="#" onClick={async () => {
										userSession.signUserOut();
				          				this.context.UserDispatch({
								    		type: 'logout'
								    	})

									}}>Sign out</a>
						</div>
					{
						!this.state.loading ?
						<Nav
						    pills
						    center
						  >
						    <NavItem>
						      <NavLink
						        active={this.state.currentTab === 'mint'}
						        onClick={()=>this.setState({currentTab: 'mint'})}
						        href="#"
						      >
						        Mint your punk
						      </NavLink>
						    </NavItem>
						    <NavItem>
						      <NavLink
						        active={this.state.currentTab === 'minted'}
						        onClick={()=>this.setState({currentTab: 'minted'})}
						        href="#"
						      >
						        Your minted punks
						      </NavLink>
						    </NavItem>
						    {this.context.UserState.isOwner ? <NavItem>
						      <NavLink href="#" 
						      	active={this.state.currentTab === 'whitelist'}
						        onClick={()=>this.setState({currentTab: 'whitelist'})}>
						        Whitelist
						      </NavLink>
						    </NavItem> : null}
						    {this.context.UserState.isOwner ? <NavItem>
						      <NavLink href="#"
						      	active={this.state.currentTab === 'event'}
						        onClick={()=>this.setState({currentTab: 'event'})}
						      	>
						        Mint event
						      </NavLink>
						    </NavItem> : null}
						    {this.context.UserState.isOwner ? <NavItem>
						      <NavLink href="#"
						      	active={this.state.currentTab === 'add_punk'}
						        onClick={()=>this.setState({currentTab: 'add_punk'})}
						      >
						        Add punks
						      </NavLink>
						    </NavItem> : null}
						    {this.context.UserState.isOwner ? <NavItem>
						      <NavLink href="#"
						      	active={this.state.currentTab === 'txs'}
						        onClick={()=>this.setState({currentTab: 'txs'})}
						      >
						        Transactions
						      </NavLink>
						    </NavItem> : null}
						    
						  </Nav>
					  : <Spinner color="primary" />
					}
					</div>
					<div className="clearfix"></div>
					<Container fluid="true">
						{this.getChild()}
					</Container>
				</Col>
			</Row>
			
		</Container>
	}
}
