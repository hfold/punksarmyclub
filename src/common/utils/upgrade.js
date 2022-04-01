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


const ctx = window.UPGRADE_CONTRACT.split(".")[0]
const ctx_name = window.UPGRADE_CONTRACT.split(".")[1]

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

	upgrade: async (args = {punk_id: null, weapon_id: null}, UserState, doContractCall, cb = null, ecb = null) => {
		try {	

			let post_conditions = [];
			
			const postConditionCode = NonFungibleConditionCode.DoesNotOwn;
			const punkNonFungibleAssetInfo = createAssetInfo(
				window.UPGRADE_PUNK_CONTRACT.split(".")[0], 
				window.UPGRADE_PUNK_CONTRACT.split(".")[1], 
				window.UPGRADE_PUNK_CONTRACT_TOKEN
			);

			post_conditions.push( makeStandardNonFungiblePostCondition(
			  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			  postConditionCode,
			  punkNonFungibleAssetInfo,
			  uintCV(args.punk_id)
			) )

			const weaponNonFungibleAssetInfo = createAssetInfo(
				window.UPGRADE_WEAPONS_CONTRACT.split(".")[0], 
				window.UPGRADE_WEAPONS_CONTRACT.split(".")[1], 
				window.UPGRADE_WEAPONS_CONTRACT_TOKEN
			);

			post_conditions.push( makeStandardNonFungiblePostCondition(
			  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
			  postConditionCode,
			  weaponNonFungibleAssetInfo,
			  uintCV(args.weapon_id)
			) )

			doContractCall({
			      contractAddress: ctx,
			  	  contractName: ctx_name,
			      functionName: 'upgrade',
			      functionArgs: [
			      	uintCV(args.punk_id),
		      		contractPrincipalCV(
		      			window.UPGRADE_PUNK_CONTRACT.split(".")[0],
		      			window.UPGRADE_PUNK_CONTRACT.split(".")[1]
		      		), 
		      		uintCV(args.weapon_id),
		      		contractPrincipalCV(
		      			window.UPGRADE_WEAPONS_CONTRACT.split(".")[0],
		      			window.UPGRADE_WEAPONS_CONTRACT.split(".")[1]
		      		)
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
			if(ecb) ecb(e)
		}
	},

	

	upgradeList: async (args = {address: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'owner-upgrade-data',
			  network: globals.NETWORK,
			  functionArgs: [standardPrincipalCV(args.address)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

		} catch(e) {
			if(ecb) ecb(e)
		}
	},


	upgradeInfo: async (args = {upgrade_id: null}, UserState, cb = null, ecb = null ) => {
		try {

			let result = await callReadOnlyFunction({
			  contractAddress: ctx,
			  contractName: ctx_name,
			  functionName: 'get-upgrade-info',
			  network: globals.NETWORK,
			  functionArgs: [uintCV(args.upgrade_id)],
			  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
			})
			if(cb) cb( cvToJSON(result).value.value )

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
