import { StacksMainnet, StacksTestnet, StacksMocknet } from '@stacks/network';


let _network = null; //network == 'testnet' ? new StacksTestnet() : new StacksMainnet();
let api_url = ''
let socket_url = '';
switch(window.network) {
	case 'testnet': 
		_network = new StacksTestnet();
		api_url = 'https://stacks-node-api.testnet.stacks.co';
		socket_url = 'https://stacks-node-api.testnet.stacks.co/';
		break;
	case 'mocknet':
		let __network = new StacksMocknet();
		_network = {...__network};
		api_url = 'http://localhost:3999';
		socket_url = 'http://localhost:3999/'
		break;
	case 'mainnet':
		_network = new StacksMainnet();
		api_url = 'https://stacks-node-api.mainnet.stacks.co';
		socket_url = 'https://stacks-node-api.mainnet.stacks.co/';
		break;
	default:
		Error("Invalid network")
}


export default {
	SELECTED_NETWORK: network,
	SELECTED_NETWORK_CALLER: network != 'mocknet' ? network : 'testnet',
	CONTRACT_ADDRESS: window.CONTRACT_ADDRESS,
	CONTRACT_NAME: window.CONTRACT_NAME,
	NETWORK: _network,
	COLLECTION_URL: window.COLLECTION_URL,
	STACKS_API_BASE_URL: api_url,
	STACKS_SOCKET_URL: socket_url,
	TOKEN_STR: 'PUNK_ARMY_NFT_TKN_STR',
	COLLECTIONS: window.COLLECTIONS,
	DAPPS: window.DAPPS
}