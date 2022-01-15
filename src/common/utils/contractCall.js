import React from 'react';

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
import {callReadOnlyFunction} from '@stacks/transactions';

import { StacksMainnet, StacksTestnet } from '@stacks/network';

import globals from './globals'


export default {
	
	addAddress: async (args = {principal:''}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: globals.CONTRACT_ADDRESS,
				      contractName: globals.CONTRACT_NAME,
				      functionName: 'add_address_to_mint_event',
				      functionArgs: [standardPrincipalCV(args.principal)],
				      onFinish: (result) => {
				      	//console.log('onFinish', result)
				      	if(cb) cb( result )
				      },
				      onCancel: (result) => {
				      	//console.log('onFinish', result)
				      	if(ecb) ecb( result )
				      },
				      network: globals.NETWORK,
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	removeAddress: async (args = {principal:''}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: globals.CONTRACT_ADDRESS,
				      contractName: globals.CONTRACT_NAME,
				      functionName: 'remove_address_to_mint_event',
				      functionArgs: [standardPrincipalCV(args.principal)],
				      onFinish: (result) => {
				      	//console.log('onFinish', result)
				      	if(cb) cb( result )
				      },
				      onCancel: (result) => {
				      	//console.log('onFinish', result)
				      	if(ecb) ecb( result )
				      },
				      network: globals.NETWORK,
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	openMintEvent: async (args = {mint_price:0, public_value: 0, address_mint: 0}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: globals.CONTRACT_ADDRESS,
				      contractName: globals.CONTRACT_NAME,
				      functionName: 'open_mint_event',
				      functionArgs: [uintCV(args.mint_price),uintCV(args.public_value),uintCV(args.address_mint)],
				      onFinish: (result) => {
				      	//console.log('onFinish', result)
				      	if(cb) cb( result )
				      },
				      onCancel: (result) => {
				      	//console.log('onFinish', result)
				      	if(ecb) ecb( result )
				      },
				      network: globals.NETWORK,
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	closeMintEvent: async (args = {}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: globals.CONTRACT_ADDRESS,
				      contractName: globals.CONTRACT_NAME,
				      functionName: 'close_mint_event',
				      functionArgs: [],
				      onFinish: (result) => {
				      	//console.log('onFinish', result)
				      	if(cb) cb( result )
				      },
				      onCancel: (result) => {
				      	//console.log('onFinish', result)
				      	if(ecb) ecb( result )
				      },
				      network: globals.NETWORK,
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	mint: async (args = {}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: globals.CONTRACT_ADDRESS,
				      contractName: globals.CONTRACT_NAME,
				      functionName: 'claim_punk',
				      functionArgs: [],
				      onFinish: (result) => {
				      	//console.log('onFinish', result)
				      	if(cb) cb( result )
				      },
				      onCancel: (result) => {
				      	//console.log('onFinish', result)
				      	if(ecb) ecb( result )
				      },
				      network: globals.NETWORK,
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	addPunk: async (args = {list: []}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add punks')
			try {
				
				let n = window.MAX_PUNK; // max number
				let i = 0;
				let array = args.list;
			  	let list = [];
			  	array.map( el => {
			  		if(i == n) return;

				  	
				  	//let attrs = [];
				  	//el.attributes.map((a)=>{
				  		
				  		//let tv = tupleCV({
				  				//trait_type: stringAsciiCV(a.trait_type),
				  				//value: stringAsciiCV(String(a.value)),
				  			//});
				  		
				  		//attrs.push(
				  			//tv
				  		//)
				  	//})

				  	
				  	list.push(tupleCV({
				  		metadata_url: el.metadata_url ? stringAsciiCV(el.metadata_url) : stringAsciiCV(el.image)
				  		//name: stringAsciiCV(el.name),
				  		//description: stringAsciiCV(el.description),
				  		//image: stringAsciiCV(el.image),
				  		//external_url: stringAsciiCV(globals.COLLECTION_URL),
				  		//edition: uintCV(1),
				  		//attributes: listCV(attrs)
				  	}))

				  	i++;
				});

			  	//console.log('invio', listCV(list) )
				doContractCall({
				      contractAddress: globals.CONTRACT_ADDRESS,
				      contractName: globals.CONTRACT_NAME,
				      functionName: 'create-multiple-punk',
				      functionArgs: [listCV(list)],
				      onFinish: (result) => {
				      	//console.log('onFinish', result)
				      	if(cb) cb( result )
				      },
				      onCancel: (result) => {
				      	//console.log('onFinish', result)
				      	if(ecb) ecb( result )
				      },
				      network: globals.NETWORK,
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	
	
}