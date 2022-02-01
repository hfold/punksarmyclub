import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { Button, Spinner, Row, Col } from 'reactstrap';

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
import GetPunkByMetadata from '../common/components/GetPunkByMetadata';
import galleries from '../common/utils/collections_gallery';

import moment from 'moment';
import {
  	useParams, useHistory
} from "react-router-dom";
import Wrapper from '../common/components/Wrapper';

const per_page = 9;
const getPunksToShow = (collection, page) => {
	try {
		return galleries[globals.COLLECTIONS[collection].full_gallery_name].slice(0, (per_page*page))
	} catch(e) {
		console.log('e', e)
		return []
	}
}

const hasMorePunks = (collection, page) => {
	try {
		return galleries[globals.COLLECTIONS[collection].full_gallery_name].length > (per_page*page)
	} catch(e) {
		return false;
	}
}

const getCollectionName = (collection) => {
	try {
		return globals.COLLECTIONS[collection].name
	} catch(e) {
		return ""
	}
}

const Gallery = (props) => {
 	const [loaded, setLoaded] = React.useState(false)
	const [loading, setLoading] = React.useState(false)

  	const {UserState, UserDispatch} = React.useContext(UserContext);
	let {collection} = useParams();
	const history = useHistory();

	const [current_page, setCurrentPage] = React.useState(1)
	React.useEffect(() => {
		
		setCurrentPage(1)

	}, [collection]);
  	
  return (<div>
  	<h3 className="subtitle">{ getCollectionName(collection)} GALLERY</h3>
  	<Button id="back_to_home" color="primary" style={{color: '#fff', margin: '12px 0', display: 'block'}} className="mb-3" size="xs" 
		onClick={async () => history.push("/")}>
			BACK TO HOME
		</Button>
  	<Row style={{overflow: 'visible'}}>
  		{getPunksToShow(collection, current_page).map(pnk => 
  			<Col style={{padding: 20, overflow: 'visible', textAlign: 'center'}} sm={6} xs={12} md={4}>
  			<GetPunkByMetadata metadata_url={pnk} key={"punk_id_"+pnk} collection={collection} /></Col>)}
  	</Row>
  	{
  		hasMorePunks(collection, current_page) ?
  		<Button id="load_more_punks" color="primary" style={{color: '#fff', margin: '12px auto', display: 'block'}} className="mb-3" size="xs" 
		onClick={async () => setCurrentPage(current_page+1)}>
			LOAD MORE
		</Button>
		: null
  	}
  	</div>);
};


export default Wrapper({route: 'Gallery', 
  hasHeader: true,
  hide_nav: true
}, Gallery)