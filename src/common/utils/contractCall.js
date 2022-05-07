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
	makeStandardFungiblePostCondition,
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

	chMetadata: async (args = {id: 0, metadata_url: ''}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			console.log('calling ch metadata', UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER])
			try {
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'set_punk_metadata_url',
				      functionArgs: [uintCV(args.id), stringAsciiCV(args.metadata_url)],
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
			
			try {

				let data = ctx.is_extended ? [uintCV(args.public_value),uintCV(args.address_mint)] : [uintCV(args.mint_price),uintCV(args.public_value),uintCV(args.address_mint)]; 
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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

	editMintEvent: async (args = {mint_price:0, public_value: 0, address_mint: 0}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			try {

				let data = ctx.is_extended ? [uintCV(args.public_value),uintCV(args.address_mint)] : [uintCV(args.mint_price),uintCV(args.public_value),uintCV(args.address_mint)]; 
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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

				let fn = args.token ? 'claim_punk_with_token' : 'claim_punk'
				
				let post_conditions = []
				if (
					(
						UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] != ctx.address ||
						ctx.is_extended
					) && 
					amount > 0 
				) 
				{
					if(args.token) {

						const postConditionAddress = UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER];
						const postConditionCode = FungibleConditionCode.GreaterEqual;
						const postConditionAmount = parseInt(amount);
						const assetAddress = args.token.tokenContract.split(".")[0];
						const assetContractName = args.token.tokenContract.split(".")[1];
						const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, args.token.tokenName);

						post_conditions.push( makeStandardFungiblePostCondition(
						  postConditionAddress,
						  postConditionCode,
						  postConditionAmount,
						  fungibleAssetInfo
						));
						if(ctx.is_extended) {
							post_conditions.push( makeContractFungiblePostCondition(
							  ctx.address,
							  ctx.ctr_name,
							  postConditionCode,
							  postConditionAmount,
							  fungibleAssetInfo
							));
						}
						
					} else {
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
						if(ctx.is_extended) {
							post_conditions.push( makeContractSTXPostCondition(
							  ctx.address,
							  ctx.ctr_name,
							  postConditionCode,
							  postConditionAmount
							) )
						}
					}

				}

				let data_to_send = [];
				if(args.token) {
					data_to_send = [contractPrincipalCV( args.token.tokenContract.split(".")[0], args.token.tokenContract.split(".")[1] )]
				} 

				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: fn,
				      functionArgs: data_to_send,
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
				let fn = args.token ? 'claim_multiple_with_token' : 'claim_multiple'

				let token_amount = args.amount;
				let post_conditions = []
				if (
					(
						UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] != ctx.address ||
						ctx.is_extended
					) && 
					amount > 0) 
				{

					if(args.token) {

						const postConditionAddress = UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER];
						const postConditionCode = FungibleConditionCode.GreaterEqual;
						const postConditionAmount = parseInt(amount*token_amount);
						const assetAddress = args.token.tokenContract.split(".")[0];
						const assetContractName = args.token.tokenContract.split(".")[1];
						const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, args.token.tokenName);

						post_conditions.push( makeStandardFungiblePostCondition(
						  postConditionAddress,
						  postConditionCode,
						  postConditionAmount,
						  fungibleAssetInfo
						));
						if(ctx.is_extended) {
							post_conditions.push( makeContractFungiblePostCondition(
							  ctx.address,
							  ctx.ctr_name,
							  postConditionCode,
							  postConditionAmount,
							  fungibleAssetInfo
							));
						}

					} else {
						// is using stx
						const postConditionCode = FungibleConditionCode.LessEqual;
						const postConditionAmount = parseInt(amount*token_amount);

						post_conditions.push( makeStandardSTXPostCondition(
						  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
						  postConditionCode,
						  postConditionAmount
						) )

						if(ctx.is_extended) {
							post_conditions.push( makeContractSTXPostCondition(
							  ctx.address,
							  ctx.ctr_name,
							  postConditionCode,
							  postConditionAmount
							) )
						}
					}

				}

				let list = [];
				for(let n = 0; n < token_amount; n++) list.push(uintCV(n));

				let data_to_send = [];
				if(args.token) {
					data_to_send = [listCV(list),contractPrincipalCV( args.token.tokenContract.split(".")[0], args.token.tokenContract.split(".")[1] )]
				} else {
					data_to_send = [listCV(list)]
				}

				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: fn,
				      functionArgs: data_to_send,
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

	



	/**
	 * Extended functions
	 */
	setTokenPrice: async (args = {tokenContract:null, amount: 0, tokenName: null}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			
			try {

				let data = [
					contractPrincipalCV(args.tokenContract.split(".")[0], args.tokenContract.split(".")[1]), 
					uintCV(args.amount),
					stringAsciiCV(args.tokenName)
				];
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'set-token-price',
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


	removeTokenPrice: async (args = {tokenContract:null}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			
			try {

				let data = [
					contractPrincipalCV(args.tokenContract.split(".")[0], args.tokenContract.split(".")[1])
				];
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'remove-token-price',
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
	
	setStxPrice: async (args = {amount:0}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			
			try {

				let data = [
					uintCV(args.amount)
				];
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'set-stx-price',
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
	
	setLockStxAcquire: async (args = {lock:0}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			
			try {

				let data = [
					args.lock ? trueCV() : falseCV()
				];
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'set-lock-stx-acquire',
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
	

	addPackage: async (args = {
					nftget: 1,
					nftpaid: 1,
					order: 1,
					qty: 1,
				}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			
			try {

				let data = [
					uintCV(args.nftpaid),
					uintCV(args.nftget),
					uintCV(args.qty),
					uintCV(args.order)
				];
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'add-package',
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


	editPackage: async (args = {
					id: null,
					nftget: 1,
					nftpaid: 1,
					order: 1,
					qty: 1,
				}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			
			try {

				let data = [
					uintCV(args.id),
					uintCV(args.nftpaid),
					uintCV(args.nftget),
					uintCV(args.qty),
					uintCV(args.order)
				];
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'edit-package',
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

	removePackage: async (args = {
					id: null
				}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
			
			try {

				let data = [
					uintCV(args.id)
				];
				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: 'remove-package',
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


	addCommissionCtx: async (args = {list: [], amount: 0}, UserState, ctx, doContractCall, cb = null, ecb = null) => {
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
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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

		removeCommissionAddress: async (args = {address: null}, UserState, ctx, doContractCall, cb = null, ecb = null ) => {
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
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
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


		buyPackage: async (args = {id: null, token: null, amount: 1}, UserState, ctx, amount, doContractCall, cb = null, ecb = null) => {
			//console.log('calling add contractAddress')
			try {
				let fn = !args.token ? 'buy_package' : 'buy_package_with_token'
				
				let token_amount = args.amount;
				let list = [];
				for(let n = 0; n < token_amount; n++) list.push(uintCV(n));

				let fnargs = [];

				let post_conditions = []
				if (
					(
						UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER] != ctx.address ||
						ctx.is_extended
					) && 
					amount > 0) 
				{

					if(args.token) {

						const postConditionAddress = UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER];
						const postConditionCode = FungibleConditionCode.GreaterEqual;
						const postConditionAmount = parseInt(amount);
						const assetAddress = args.token.tokenContract.split(".")[0];
						const assetContractName = args.token.tokenContract.split(".")[1];
						const fungibleAssetInfo = createAssetInfo(assetAddress, assetContractName, args.token.tokenName);

						post_conditions.push( makeStandardFungiblePostCondition(
						  postConditionAddress,
						  postConditionCode,
						  postConditionAmount,
						  fungibleAssetInfo
						));

						if(ctx.is_extended) {
							post_conditions.push( makeContractFungiblePostCondition(
							  ctx.address,
							  ctx.ctr_name,
							  postConditionCode,
							  postConditionAmount,
							  fungibleAssetInfo
							));
						}

						fnargs = [
							uintCV(args.id),
							contractPrincipalCV(args.token.tokenContract.split(".")[0], args.token.tokenContract.split(".")[1]),
							listCV(list)
						]

					} else {
						// is using stx
						const postConditionCode = FungibleConditionCode.LessEqual;
						const postConditionAmount = parseInt(amount);

						post_conditions.push( makeStandardSTXPostCondition(
						  UserState.userData.profile.stxAddress[globals.SELECTED_NETWORK_CALLER],
						  postConditionCode,
						  postConditionAmount
						) )

						if(ctx.is_extended) {
							post_conditions.push( makeContractSTXPostCondition(
							  ctx.address,
							  ctx.ctr_name,
							  postConditionCode,
							  postConditionAmount
							) )
						}

						fnargs = [
							uintCV(args.id),
							listCV(list)
						]
					}

				}

				
				doContractCall({
				      contractAddress: ctx.address,
				  	  contractName: ctx.ctr_name,
				      functionName: fn,
				      functionArgs: fnargs,
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
}
