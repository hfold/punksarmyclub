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
	cvToJSON,

	FungibleConditionCode,
	makeStandardSTXPostCondition,
	makeContractSTXPostCondition,

	NonFungibleConditionCode,
	createAssetInfo,
	makeStandardNonFungiblePostCondition,
	makeContractNonFungiblePostCondition,
	bufferCVFromString,
	PostConditionMode


} from '@stacks/transactions';
import {callReadOnlyFunction,makeSTXTokenTransfer} from '@stacks/transactions';

import { StacksMainnet, StacksTestnet } from '@stacks/network';

import globals from './globals'


export default {
	
	addAddress: async (args = {principal:''}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	removeAddress: async (args = {principal:''}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	openMintEvent: async (args = {mint_price:0, public_value: 0, address_mint: 0}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			console.log('calling add contractAddress', UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER])
			try {
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	closeMintEvent: async (args = {}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},
	/*
	gift: async (args = {}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				let post_conditions = []
				const contractAddress = ctx.address;
				const contractName = ctx.ctr_name;
				const postConditionCode = FungibleConditionCode.LessEqual;
				const postConditionAmount = parseInt(20000000);
				
				post_conditions.push( makeStandardSTXPostCondition(
				  contractAddress,
				  //contractName,
				  postConditionCode,
				  postConditionAmount
				) )

				post_conditions.push( makeContractSTXPostCondition(
				  contractAddress,
				  contractName,
				  postConditionCode,
				  postConditionAmount
				) )

				doContractCall({
					  postConditionMode: PostConditionMode.Allow,
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'gift-ct',
				      functionArgs: [],
				      onFinish: (result) => {
				      	//console.log('onFinish', result)
				      	if(cb) cb( result )
				      },
				      onCancel: (result) => {
				      	//console.log('onFinish', result)
				      	if(ecb) ecb( result )
				      },
				  	  postConditions: post_conditions,
				      network: globals.NETWORK,
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},*/

	mint: async (args = {}, UserState, ctx, amount, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				let post_conditions = []
				if (
					UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] != ctx.address && 
					amount > 0) 
				{
					console.log('amount', amount)
					const contractAddress = ctx.address;
					const contractName = ctx.ctr_name;
					const postConditionCode = FungibleConditionCode.LessEqual;
					const postConditionAmount = parseInt(amount);

					post_conditions.push( makeStandardSTXPostCondition(
					  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
					  //contractName,
					  postConditionCode,
					  postConditionAmount
					) )

					//post_conditions.push( makeContractSTXPostCondition(
					  //contractAddress,
					  //contractName,
					  //postConditionCode,
					  //postConditionAmount
					//) )
				}

				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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
				  	  postConditions: post_conditions,
				  	  postConditionMode: PostConditionMode.Deny,
				      network: globals.NETWORK,
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	addPunk: async (args = {list: []}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
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
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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
				      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
				    });
				
			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	
	
}
