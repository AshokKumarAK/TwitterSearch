import 'whatwg-fetch';

class HttpService{
	fetchData = (searchUrl) =>{
		var promise= new Promise((resolve,reject)=>{
			fetch(searchUrl)
			.then(res => res.json())
			.then(response=>{
				resolve(response.statuses);
			})
		});
	return promise;
	}
}

export default HttpService;