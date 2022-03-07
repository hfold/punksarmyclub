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


const ctx = window.TOKEN_CONTRACT.split(".")[0]
const ctx_name = window.TOKEN_CONTRACT.split(".")[1]

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

	addBonusAddress: async (args = {}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'add-address-to-bonus',
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
	setBonusPercentage: async (args = {percentage: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'set-bonus-percentage',
			  network: globals.NETWORK,
			  functionArgs: [uintCV(args.percentage)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( parseInt(cvToJSON(result).value.value) === 1 )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},



	addMinterAddress: async (args = {}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'add-address-to-minter',
			      functionArgs: [contractPrincipalCV(args.address.split(".")[0],args.address.split(".")[1])],
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
	removeMinterAddress: async (args = {}, UserState, doContractCall, cb = null, ecb = null ) => {
		try {	
			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'remove-address-from-minter',
			      functionArgs: [contractPrincipalCV(args.address.split(".")[0],args.address.split(".")[1])],
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
	isMinter: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'is-minter-address',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address.split(".")[0],args.address.split(".")[1])],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( parseInt(cvToJSON(result).value.value) === 1 )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	

	getTotalSupply: async (args = {}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'get-current-supply',
			  network: globals.NETWORK,
			  functionArgs: [],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},

	getCurrentDivisor: async (args = {}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'get-current-divisor',
			  network: globals.NETWORK,
			  functionArgs: [],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},
	
}
