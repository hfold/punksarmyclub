//import ipfs from 'jsipfs'

export default {
	format_stx_integers: (n) => {
		return String(parseFloat(n/1000000).toFixed(2))
	},
	format_stx_integers2: (n) => {
		let v = n/1000000
		let f = (v % 1 == 0) ? 0 : 2
		return String(parseFloat(v).toFixed(f))
	},
	format_stx_integers2_with_pow: (n, decimals) => {

		let divisor = Math.pow(10, parseInt(decimals))
		console.log('formatto', n, decimals)

		let v = parseInt(n)/divisor
		let f = (v % 1 == 0) ? 0 : 2
		return String(parseFloat(v).toFixed(f))
	},
	ipfs_gateway: (url) => {
		if(!window.GATEWAY) return url;

		if(url && url.match(/ipfs:\/\//) && window.GATEWAY) {
			return url.replace(/ipfs:\/\//, window.GATEWAY )
		}

		if(url && url.match(/https:\/\/gateway.pinata.cloud\/ipfs\//) && window.GATEWAY) {
			return url.replace(/https:\/\/gateway.pinata.cloud\/ipfs\//, window.GATEWAY )
		}

		return url;

	},
	video_mime_type: ['video/mp4', 'video/ogg'],
	getIpfsUrl: async (url) => {

		//if(url && url.match(/ipfs:\/\//)) {
//
			//let cid = url = url.replace(/ipfs:\/\//, "" );
//
			//if (cid == "" || cid == null || cid == undefined) {
		        //return;
		    //}
		    //for await (const file of ipfs.get(cid)) {
		        //if (file.size > limit) {
		            //return;
		        //}
		        //const content = [];
		        //if (file.content) {
		            //for await(const chunk of file.content) {
		                //content.push(chunk);
		            //}
		            //return URL.createObjectURL(new Blob(content, {type: mime}));
		        //}
		    //}
		//} else {
			//return url
		//}

	}
}