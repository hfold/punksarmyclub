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
	stringToCV,
	cvToJSON
} from '@stacks/transactions';
import {callReadOnlyFunction} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import globals from './globals'

export default {
	getCanAddMultipleWhitelist: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'has_multiple_whitelist',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				if(ecb) ecb(e)
			}
		},

	hasAvaibleMultipleMint: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'has_avaible_multiple_mint',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				if(ecb) ecb(e)
			}
		},

	getLastTokenId: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'get-last-token-id',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	getLastPunkId: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'get_last_punk',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				if(cb) cb( cvToJSON(result).value.value )

			} catch(e) {
				//console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	isOpenMinting: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling get last token id')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
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

	isCtxOwner: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			console.log('calling is owner', UserState.userData.profile)
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'is_nft_contract_owner',
				  network: globals.NETWORK,
				  functionArgs: [...args],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				
				if(cb) cb( cvToString(result) === 'true' )

			} catch(e) {
				console.log('error', e)
				if(ecb) ecb(e)
			}
		},

	currentMintEvent: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling current mint event')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
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

	getWhiteListAddresses: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling whitelist')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
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

	mintingResume: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling minting resume')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
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

	getPunk: async (args = {token_id: 0}, UserState, ctx, cb = null, ecb = null) => {
			if(!args.token_id) return;
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'get-punk',
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


	/**
	 * Extended functions
	 */
	getAvaibleTokens: async (args = {}, UserState, ctx, cb = null, ecb = null) => {
			
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'get-avaible-tokens',
				  network: globals.NETWORK,
				  functionArgs: [],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				console.log('TOKEN RESULT', result)
				if(cb) cb( result.list )

			} catch(e) {
				//console.log('error', e, args)
				if(ecb) ecb(e)
			}
		},

	getPackages: async (args = {}, UserState, ctx, cb = null, ecb = null) => {
			
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
				  functionName: 'get-packages-list',
				  network: globals.NETWORK,
				  functionArgs: [],
				  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
				})
				console.log('TOKEN RESULT', result)
				if(cb) cb( cvToJSON( result ) )

			} catch(e) {
				//console.log('error', e, args)
				if(ecb) ecb(e)
			}
		},

	getTokenDecimals: async (args = {ctx: null}, UserState, ctx, cb = null, ecb = null) => {
			return new Promise(async (resolve, reject)=>{
				try {
					
					let result = await callReadOnlyFunction({
					  contractAddress: args.ctx.split(".")[0],
					  contractName: args.ctx.split(".")[1],
					  functionName: 'get-decimals',
					  network: globals.NETWORK,
					  functionArgs: [],
					  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
					})
					console.log('TKN DECIMALS', cvToJSON( result ))
					if(cb) {
						cb( cvToJSON( result ) )
					} 

					resolve( cvToJSON( result ) )

				} catch(e) {
					//console.log('error', e, args)
					if(ecb) ecb(e)

					reject(e)
				}
			})
		},

	getTokenBalance: async (args = {ctx: null}, UserState, ctx, cb = null, ecb = null) => {
			return new Promise(async (resolve, reject)=>{
				try {
				
					let result = await callReadOnlyFunction({
					  contractAddress: args.ctx.split(".")[0],
					  contractName: args.ctx.split(".")[1],
					  functionName: 'get-balance',
					  network: globals.NETWORK,
					  functionArgs: [standardPrincipalCV(UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER])],
					  senderAddress: UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER]
					})
					console.log('TKN DECIMALS', cvToJSON( result ))
					if(cb) {
						cb( cvToJSON( result ) )
					} 

					resolve( cvToJSON( result ) )

				} catch(e) {
					//console.log('error', e, args)
					if(ecb) ecb(e)

					reject(e)
				}
			})
			
		},

	getCommissionAddresses: async (args = [], UserState, ctx, cb = null, ecb = null) => {
			//console.log('calling whitelist')
			try {
				
				let result = await callReadOnlyFunction({
				  contractAddress: ctx.address,
				  contractName: ctx.ctr_name,
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
}