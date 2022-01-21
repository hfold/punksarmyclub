import React from 'react';
import { 
	Container, Row, Col
} from 'reactstrap';

import Header from './layout/Header';
import Footer from './layout/Footer';

import {
	UserContext
} from '../../store/UserContext';


export default function Wrapper( args, WrappedComponent ) {
	
	return (class extends React.Component {
		
		static contextType = UserContext

		render() {
			
			return <React.Fragment>
				{
					args.hasHeader
					?
					<Header {...this.props} {...args} />
					: null
				}
				<Container>
					<WrappedComponent {...this.props} />
				</Container>
				<Footer />
			</React.Fragment>
		}

	})	
}
