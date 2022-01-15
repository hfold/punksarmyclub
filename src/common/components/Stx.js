import React from 'react';

export default function Stx(props) {
	return <svg style={{width: props.dim || 40, height: props.dim || 40, ...props.style, fill: 'none', display: 'inline'}} viewBox="0 0 22 22">
	<path d="M4.18817 0.940674L9.37024 8.99389M9.37024 8.99389H0.266602M9.37024 8.99389H12.7316" stroke="currentColor" stroke-width="2" stroke-linejoin="bevel"></path><path d="M17.9129 0.940674L12.7308 8.99389H21.8345" stroke="currentColor" stroke-width="2" stroke-linejoin="bevel"></path><path d="M4.18817 21.4407L9.37024 13.3875M9.37024 13.3875H0.266602M9.37024 13.3875H12.7316" stroke="currentColor" stroke-width="2" stroke-linejoin="bevel"></path><path d="M17.9129 21.4407L12.7308 13.3875H21.8345" stroke="currentColor" stroke-width="2" stroke-linejoin="bevel"></path></svg>
}