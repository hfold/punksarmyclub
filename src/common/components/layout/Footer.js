import React from 'react'

import {Container} from 'reactstrap';

export default function Footer(props) {
	return <div className="footer">
	<Container>
		<a href={window.MAIN_URL}>{window.MAIN_URL_TEXT}</a>
	</Container>
	</div>;
}