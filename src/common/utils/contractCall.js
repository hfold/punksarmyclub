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

	burn: async (args = {token_id:null}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				let post_conditions = []
				if (
					UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] == ctx.address 
				) 
				{
					const contractAddress = ctx.address;
					const contractName = ctx.ctr_name;
					const assetName = ctx.tkn;
					const postConditionCode = NonFungibleConditionCode.DoesNotOwn;
					const nonFungibleAssetInfo = createAssetInfo(contractAddress, contractName, assetName);

					post_conditions.push( makeStandardNonFungiblePostCondition(
					  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
					  postConditionCode,
					  nonFungibleAssetInfo,
					  uintCV(args.token_id)
					) )
				}


				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'burn-token',
				      functionArgs: [uintCV(args.token_id)],
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

	addMultipleAddresses: async (args = {list:[]}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {

				if(args.list.length > 220) {
					alert("Invalid list length");
					if(ecb) ecb("Invalid list length")
					return;
				}

				let list = []
				args.list.map(principal => list.push(standardPrincipalCV(principal)))

				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'add_multiple_addresses_to_mint_event',
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

	emptyAddresses: async (args = {}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'empty_whitelist',
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

	editMintEvent: async (args = {mint_price:0, public_value: 0, address_mint: 0}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			try {
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'edit_mint_event',
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

	mintMultiple: async (args = {}, UserState, ctx, amount, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				let token_amount = args.amount;
				let post_conditions = []
				if (
					UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] != ctx.address && 
					amount > 0) 
				{
					const postConditionCode = FungibleConditionCode.LessEqual;
					const postConditionAmount = parseInt(amount*token_amount);

					post_conditions.push( makeStandardSTXPostCondition(
					  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
					  postConditionCode,
					  postConditionAmount
					) )

				}

				let list = [];
				for(let n = 0; n < token_amount; n++) list.push(uintCV(n));

				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'claim_multiple',
				      functionArgs: [listCV(list)],
				      onFinish: (result) => {
				      	if(cb) cb( result )
				      },
				      onCancel: (result) => {
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

				  	list.push(tupleCV({
				  		metadata_url: el.metadata_url ? stringAsciiCV(el.metadata_url) : stringAsciiCV(el.image)
				  	}))

				  	i++;
				});

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
