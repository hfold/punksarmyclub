import { StacksMainnet, StacksTestnet } from '@stacks/network';


const network = window.network;
let _network = null; //network == 'testnet' ? new StacksTestnet() : new StacksMainnet();
let api_url = ''

if(network == 'testnet') {
	_network= new StacksTestnet();
	api_url = 'https://stacks-node-api.testnet.stacks.co';
} else {
	_network= new StacksMainnet();
	api_url = 'https://stacks-node-api.mainnet.stacks.co';
}


export default {
	SELECTED_NETWORK: network,
	CONTRACT_ADDRESS: window.CONTRACT_ADDRESS,
	CONTRACT_NAME: window.CONTRACT_NAME,
	NETWORK: _network,
	COLLECTION_URL: window.COLLECTION_URL,
	STACKS_API_BASE_URL: api_url,
	TOKEN_STR: 'PUNK_ARMY_NFT_TKN_STR'
}