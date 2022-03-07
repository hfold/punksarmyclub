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


const ctx = window.STACKING_CONTRACT.split(".")[0]
const ctx_name = window.STACKING_CONTRACT.split(".")[1]

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

	addBonusAddress: async (args = {address: null, percentage: null, daily: null}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'add-address-to-bonus',
			      functionArgs: [standardPrincipalCV(args.address), uintCV(args.percentage), uintCV(args.daily)],
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
	removeBonusAddress: async (args = {}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'remove-address-from-bonus',
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
	isBonus: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'is-bonus-address',
			  network: globals.NETWORK,
			  functionArgs: [contractPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( parseInt(cvToJSON(result).value.value) === 1 )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	addCollection: async (args = {
		contract: null, 
		min: null,
		max: null,
		collection_total: null,
		max_rank: null,
		daily: null,
		percentage: null
	}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'add-collection',
			      functionArgs: [
		      		contractPrincipalCV(
		      			args.contract.split(".")[0],
		      			args.contract.split(".")[1]
		      		), 
		      		tupleCV({
		      			"min-import": uintCV(args.min),
			      		"max-import": uintCV(args.max),
			      		"collection-total": uintCV(args.collection_total),
			      		"max-rank": uintCV(args.max_rank),
			      		"bonus-daily-step": uintCV(args.daily),
			      		"bonus-percentage": uintCV(args.percentage)
			      	})
			      ],
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
	removeCollection: async (args = {contract: null}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'remove-collection',
			      functionArgs: [contractPrincipalCV(
		      			args.contract.split(".")[0],
		      			args.contract.split(".")[1]
		      		)],
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


	fullCollectionList: async (args = {}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'full-collection-list',
			  network: globals.NETWORK,
			  functionArgs: [],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	getAddressStackingNft: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'current-staking',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	getTokenMinted: async (args = {stacking_id: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'get-staking-status',
			  network: globals.NETWORK,
			  functionArgs: [uintCV(args.stacking_id)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	stake: async (args = {contract: null, nft_id: null}, ctx_data, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	

			let post_conditions = []
			const contractAddress = ctx_data.address;
			const contractName = ctx_data.ctr_name;
			const assetName = ctx_data.tkn;
			const postConditionCode = NonFungibleConditionCode.DoesNotOwn;
			const nonFungibleAssetInfo = createAssetInfo(contractAddress, contractName, assetName);

			post_conditions.push( makeStandardNonFungiblePostCondition(
			  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			  postConditionCode,
			  nonFungibleAssetInfo,
			  uintCV(args.nft_id)
			) )


			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'stake',
			      functionArgs: [uintCV(args.nft_id), contractPrincipalCV(
		      			args.contract.split(".")[0],
		      			args.contract.split(".")[1]
		      		)],
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
			if(ecb) ecb(e)
		}
	},

	claim: async (args = {stacking_id: null, nft_id: null, collection: null, token_name: null}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			console.log('claim', args)
			let post_conditions = []
			const contractAddress = args.collection.split(".")[0];
			const contractName = args.collection.split(".")[1];
			const assetName = args.token_name;
			const nonFungibleAssetInfo = createAssetInfo(contractAddress, contractName, assetName);
		
			post_conditions.push( makeStandardNonFungiblePostCondition(
			  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			  NonFungibleConditionCode.Owns,
			  nonFungibleAssetInfo,
			  uintCV(args.nft_id)
			) )

			post_conditions.push( makeContractNonFungiblePostCondition(
			  ctx,
			  ctx_name,
			  NonFungibleConditionCode.DoesNotOwn,
			  nonFungibleAssetInfo,
			  uintCV(args.nft_id)
			) )

			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'claim',
			      functionArgs: [uintCV(args.stacking_id), contractPrincipalCV(
			      		args.collection.split(".")[0],
			      		args.collection.split(".")[1]
			      	)],
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
			if(ecb) ecb(e)
		}
	},

	getNft: async (args = {token_id: 0}, UserState, ctx, cb = null, ecb = null) => {
			if(!args.token_id) return;
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'get-token-uri',
				  network: globals.NETWORK,
				  functionArgs: [uintCV(args.token_id)],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				//console.log('error', e, args)
				if(ecb) ecb(e)
			}
		},

	
}
