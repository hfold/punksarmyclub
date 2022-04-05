import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { FormGroup, Input, Label, Button, Spinner, Row, Col } from 'reactstrap';

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
import galleries from '../common/utils/collections_gallery';

import moment from 'moment';
import {
  	useParams, useHistory
} from "react-router-dom";
import Wrapper from '../common/components/Wrapper';



const Rarity = (props) => {
 	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

  	const {UserState, UserDispatch} = React.useContext(UserContext);
	let {collection} = useParams();
	const history = useHistory();

	const [current_page, setCurrentPage] = React.useState(1)
	const [id, setId] = React.useState(0)
	const [show_rarity, setShowRarity] = React.useState(false)
  	
  return (<div style={{marginTop: '20vh'}}>
  	<Row style={{overflow: 'visible'}}>
  		<Col lg={6} md={12} className="offset-lg-3 offset-md-0">
  			<h3 className="subtitle">PUNKS ARMY RARITY CHECK</h3>
		  	<Button id="back_to_home" color="primary" style={{color: '#fff', margin: '12px 0', display: 'block'}} className="mb-3" size="xs" 
				onClick={async () => history.push("/")}>
					GO TO HOME
			</Button>
			{
				!globals.COLLECTIONS[collection].has_rarity
				? <p style={{color: '#fff'}}>The collection you're looking for doesn't have rarity points at the moment</p>
				:
				<React.Fragment>
				{
					show_rarity
					?
					<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
						className="mb-3" size="lg" onClick={async () => {
							setId(0)
							setShowRarity(false)
						}}>
						Search another
					</Button>
					: <React.Fragment>
					<p>Search punk rarity</p>
					<FormGroup floating>
						<Input value={id} type="number" id="max_mint" onChange={(e)=>setId(e.target.value)} />
						<Label for="max_mint">
					        NFT #
				      	</Label>
					</FormGroup>
					<Button id="confirm_open" block color="primary" style={{color: '#fff'}} 
						className="mb-3" size="lg" onClick={async () => {
							if(id < 1 || id > 2000) {
								alert("Set a number between 1 and 2000")
							} else {
								setShowRarity(true)
							}
						}}>
						Show punk
					</Button>
					</React.Fragment>

				}
	  			
				{
		  			show_rarity ?
					<div>
						<p>punk</p>
						<GetPunk id={id} key={"punk_id_"+id} collection={collection} />
					</div>
					: null
		  		}
				</React.Fragment>
			}
  		</Col>
  	</Row>
  	
  	</div>);
};


export default Wrapper({route: 'Rarity', 
  hasHeader: false,
  hide_nav: true
}, Rarity)