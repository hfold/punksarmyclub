//import ipfs from 'jsipfs'

export default {
	format_stx_integers: (n) => {
		return String(parseFloat(n/1000000).toFixed(6))
	},
	ipfs_gateway: (url) => {
		if(!window.GATEWAY) return url;

		if(url && url.match(/ipfs:\/\//) && window.GATEWAY) {
			return url.replace(/ipfs:\/\//, window.GATEWAY )
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