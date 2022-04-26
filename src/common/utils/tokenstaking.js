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
	makeStandardFungiblePostCondition,
	makeContractFungiblePostCondition,
	bufferCVFromString,
	PostConditionMode


} from '@stacks/transactions';
import {callReadOnlyFunction,makeSTXTokenTransfer} from '@stacks/transactions';

import { StacksMainnet, StacksTestnet } from '@stacks/network';

import globals from './globals'


const ctx = window.STAKING_TOKEN_CONTRACT.split(".")[0]
const ctx_name = window.STAKING_TOKEN_CONTRACT.split(".")[1]

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

	fund: async (args = {amount: 0}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			console.log(args)
			let post_conditions = []
			
			post_conditions.push( makeStandardSTXPostCondition(
			  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			  FungibleConditionCode.GreaterEqual,
			  args.amount
			) )

			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'fund',
			      functionArgs: [uintCV(args.amount)],
			      onFinish: (result) => {
			      	if(cb) cb( result )
			      },
			      onCancel: (result) => {
			      	if(ecb) ecb( result )
			      },
			      network: globals.NETWORK,
			      postConditions: post_conditions,
				  postConditionMode: PostConditionMode.Deny,
			      stxAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			    });
			
		} catch(e) {
			console.log('e', e)
			if(ecb) ecb(e)
		}
	},

	getContractInfo: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'get-contract-user-info',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	getCurrentBlockHeight: async (args = {}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'get-net-current-height',
			  network: globals.NETWORK,
			  functionArgs: [],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},


	getCurrentCyclesIdx: async (args = {}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'ctx-cycles-ids',
			  network: globals.NETWORK,
			  functionArgs: [],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	
	getStakingStatus: async (args = {cycle_id: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'get-staking-status',
			  network: globals.NETWORK,
			  functionArgs: [uintCV(args.cycle_id)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	
	extimatedTotalCycleGain: async (args = {}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'get-extimated-current-total-gain',
			  network: globals.NETWORK,
			  functionArgs: [],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	canDelegate: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'can-delegate',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},


	canUndelegate: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'can-undelegate',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	getAddressBalance: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'address-balance',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	isStakingAddress: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'is-staking-address',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	delegateToken: async (args = {cycle_id: null, number_of_cycles: null, amount: null}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	

			let post_conditions = []
			

			const postConditionAddress = UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER];
			const postConditionCode = FungibleConditionCode.GreaterEqual;
			const postConditionAmount = parseInt(args.amount);
			const assetAddress = window.STAKING_TOKEN_CTX.split(".")[0];
			const assetContractName = window.STAKING_TOKEN_CTX.split(".")[1];
			const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, window.STAKING_TOKEN_NAME);

			const standardFungiblePostCondition = makeStandardFungiblePostCondition(
			  postConditionAddress,
			  postConditionCode,
			  postConditionAmount,
			  fungibleAssetInfo
			);

			console.log('standardFungiblePostCondition', standardFungiblePostCondition)

			post_conditions.push( standardFungiblePostCondition )

			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'delegate-token',
			      functionArgs: [
			      	 uintCV(args.cycle_id),
		        	 uintCV(args.number_of_cycles),
		        	 uintCV(args.amount)
			      ],
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
			console.log('e',e)
			if(ecb) ecb(e)
		}
	},


	undelegateToken: async (args = {address: null, amount: null}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	

			let post_conditions = []
			
			if(args.amount > 0) {
				const postConditionAddress = window.STAKING_TOKEN_CONTRACT.split(".")[0];
				const postConditionCtxName = window.STAKING_TOKEN_CONTRACT.split(".")[1];
				const postConditionCode = FungibleConditionCode.GreaterEqual;
				const postConditionAmount = parseInt(args.amount);
				const assetAddress = window.STAKING_TOKEN_CTX.split(".")[0];
				const assetContractName = window.STAKING_TOKEN_CTX.split(".")[1];
				const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, window.STAKING_TOKEN_NAME);

				const contractFungiblePostCondition = makeContractFungiblePostCondition(
				  postConditionAddress,
				  postConditionCtxName,
				  postConditionCode,
				  postConditionAmount,
				  fungibleAssetInfo
				);

				console.log('contractFungiblePostCondition', contractFungiblePostCondition)
				post_conditions.push( contractFungiblePostCondition )
			}

			

			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'undelegate',
			      functionArgs: [
			      	standardPrincipalCV(args.address)
			      ],
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
			console.log('e',e)
			if(ecb) ecb(e)
		}
	},


	stopStaking: async (args = {address: null}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'stop-staking-till-next',
			      functionArgs: [
			      	standardPrincipalCV(args.address)
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
			console.log('e',e)
			if(ecb) ecb(e)
		}
	},
	
}
