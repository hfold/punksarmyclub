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
	makeContractFungiblePostCondition,
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


const ctx = window.BUY_TOKEN_CTX.split(".")[0]
const ctx_name = window.BUY_TOKEN_CTX.split(".")[1]

export default {

	addAdminAddress: async (args = {}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'add-address-to-administrative',
			      functionArgs: [standardPrincipalCV(args.address)],
			      onFinish: (result) => {
			      	if(cb) cb( result )
			      },
			      onCancel: (result) => {
			      	if(ecb) ecb( result )
			      },
			      network: globals.NETWORK,
			      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			    });
			
		} catch(e) {
			if(ecb) ecb(e)
		}
	},
	removeAdminAddress: async (args = {}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'remove-address-from-adminstrative',
			      functionArgs: [standardPrincipalCV(args.address)],
			      onFinish: (result) => {
			      	if(cb) cb( result )
			      },
			      onCancel: (result) => {
			      	if(ecb) ecb( result )
			      },
			      network: globals.NETWORK,
			      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			    });
			
		} catch(e) {
			if(ecb) ecb(e)
		}
	},
	isAdmin: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'is-admin',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( parseInt(cvToJSON(result).value.value) === 1 )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	

	addAddress: async (args = {principal:''}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: ctx,
				  	  contractName: ctx_name,
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

	addMultipleAddresses: async (args = {list:[]}, UserState, doContractCall, cb = null, ecb = null) => {
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
				      contractAddress: ctx,
				  	  contractName: ctx_name,
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

	removeAddress: async (args = {principal:''}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: ctx,
				  	  contractName: ctx_name,
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

	emptyAddresses: async (args = {}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: ctx,
				  	  contractName: ctx_name,
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


	getWhiteListAddresses: async (args = [], UserState, cb = null, ecb = null) => {
			//console.log('calling whitelist')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx,
				  contractName: ctx_name,
				  functionName: 'whitelist_addresses',
				  network: globals.NETWORK,
				  functionArgs: [],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},


	openMintEvent: async (args = {mint_price:0, public_value: 0, address_mint: 0}, UserState, doContractCall, cb = null, ecb = null) => {
			
			try {

				let data = [uintCV(args.mint_price),uintCV(args.public_value),uintCV(args.address_mint)]; 
				
				doContractCall({
				      contractAddress: ctx,
				  	  contractName: ctx_name,
				      functionName: 'open_mint_event',
				      functionArgs: data,
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
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	editMintEvent: async (args = {mint_price:0, public_value: 0, address_mint: 0}, UserState, doContractCall, cb = null, ecb = null) => {
			try {

				let data = [uintCV(args.mint_price),uintCV(args.public_value),uintCV(args.address_mint)]; 
				
				doContractCall({
				      contractAddress: ctx,
				  	  contractName: ctx_name,
				      functionName: 'edit_mint_event',
				      functionArgs: data,
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

	closeMintEvent: async (args = {}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				
				doContractCall({
				      contractAddress: ctx,
				  	  contractName: ctx_name,
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


	mintingResume: async (args = [], UserState, cb = null, ecb = null) => {
			//console.log('calling minting resume')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx,
				  contractName: ctx_name,
				  functionName: 'minting_resume',
				  network: globals.NETWORK,
				  functionArgs: [],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	addCommissionCtx: async (args = {list: [], amount: 0}, UserState, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add punks')
			try {
				if(args.amount < 1 || args.amount > 100) {
					alert('Invalid percentage')
					return;
				}
				let n = 200; // max number
				let i = 0;
				let array = args.list;
			  	let list = [];
			  	array.map( el => {
			  		if(i == n) return;

			  		let addr = el.split(".")

			  		if(addr[1]) {
			  			// is contract
			  			list.push(contractPrincipalCV(addr[0],addr[1]))
			  		} else {
			  			list.push(standardPrincipalCV(addr[0],addr[1]))
			  		}

				  	i++;
				});

			  	doContractCall({
				      contractAddress: ctx,
				  	  contractName: ctx_name,
				      functionName: 'add-address-to-commission',
				      functionArgs: [listCV(list), uintCV(args.amount)],
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

	removeCommissionAddress: async (args = {address: null}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	

			let addr = args.address.split(".")
			let principal = null
	  		if(addr[1]) {
	  			// is contract
	  			principal = contractPrincipalCV(addr[0],addr[1])
	  		} else {
	  			principal = standardPrincipalCV(addr[0],addr[1])
	  		}

			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'remove-address-from-commission',
			      functionArgs: [principal],
			      onFinish: (result) => {
			      	if(cb) cb( result )
			      },
			      onCancel: (result) => {
			      	if(ecb) ecb( result )
			      },
			      network: globals.NETWORK,
			      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			    });
			
		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	getCommissionAddresses: async (args = [], UserState, cb = null, ecb = null) => {
			//console.log('calling whitelist')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx,
				  contractName: ctx_name,
				  functionName: 'list-commission-addresses',
				  network: globals.NETWORK,
				  functionArgs: [],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	currentMintEvent: async (args = [], UserState, cb = null, ecb = null) => {
			//console.log('calling current mint event')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx,
				  contractName: ctx_name,
				  functionName: 'current_mint_event',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value )

			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	isOpenMinting: async (args = [], UserState, cb = null, ecb = null) => {
			//console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx,
				  contractName: ctx_name,
				  functionName: 'is_open_minting',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToString(result) === 'true' )

			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	buy: async (args = {amount: null}, UserState, amount, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {

				let fn = 'buy'
				
				let post_conditions = []
				
				const contractAddress = ctx;
				const contractName = ctx_name;
				const postConditionCode = FungibleConditionCode.LessEqual;
				const postConditionAmount = parseInt(amount);

				post_conditions.push( makeStandardSTXPostCondition(
				  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
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

				

				//const postConditionCtxAddress = ctx;
				//const postConditionCtxName = ctx_name;
				//const _postConditionCode = FungibleConditionCode.GreaterEqual;
				//const _postConditionAmount = parseInt(args.amount);
				//const assetAddress = window.BUY_TOKEN_MAIN_TOKEN_CTX.split(".")[0];
				//const assetContractName = window.BUY_TOKEN_MAIN_TOKEN_CTX.split(".")[1];
				//const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, window.BUY_TOKEN_MAIN_TOKEN_NAME);
				
				//post_conditions.push( makeContractFungiblePostCondition(
				  //postConditionCtxAddress,
				  //postConditionCtxName,
				  //_postConditionCode,
				  //_postConditionAmount,
				  //fungibleAssetInfo
				//));

				doContractCall({
				      contractAddress: ctx,
				  	  contractName: ctx_name,
				      functionName: fn,
				      functionArgs: [uintCV(args.amount)],
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
	
}
