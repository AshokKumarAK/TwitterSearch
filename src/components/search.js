import React,{Component} from 'react';
import HttpService from '../services/http-service';
import './search.css';

const http= new HttpService();

class search extends Component {
	constructor(props){
		super(props);
		this.myVariable='';
		this.state={
			query:'',
			results:[],
			loaded:false,
			time:'',
			status:''
		}
		this.onButtonClicked=this.onButtonClicked.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderSearchResults=this.renderSearchResults.bind(this);
		this.startTime=this.startTime.bind(this);
		this.renderTimer=this.renderTimer.bind(this);
	}
	handleChange({ target }) {
		this.myVariable=target.value;
	}
	renderSearchResults=() => {
		const{results,loaded}=this.state;
		if(Object.keys(results).length && results.length){
			return(
				<div>
				{results.map(result=>{
					return (
						<div className="row" key={result.id}>
					        <div className="col-md-12 bg-color">
					            <div className="card col-md-12">
					                <div className="card-body col-md-12">
					                    <img src={result.user.profile_image_url_https} className="rounded-circle col-md-1 pad-img" alt="Profile"/>
					                    <div className="col-md-11 pad-card">
					                        <h4 className="card-title mb-2 col-md-3">{result.user.name}</h4>
					                        <p className="card-text mb-2 col-md-3">{result.user.location}</p>
					                        <p className="card-text mb-2 col-md-4">{result.created_at}</p>
					                    </div>
					                </div>
					            </div>
					        </div>
					    </div>
						)
				})}
				</div>
				)
		}else if(loaded){
			return(
				<div className="alert alert-warning">No data Found</div>
			)
		}else if(this.state.query==='' && this.state.status==='Empty'){
			return(
				<div className="alert alert-warning">Please Enter data</div>
			)
		}
	}
	startTime=()=>{
		clearInterval(this.timer);
			this.setState({
		      	time: 30			
			})
			this.timer=setInterval(() => {
				this.setState({
		      		time: this.state.time - 1			
				});
				if(this.state.time===0){
					clearInterval(this.timer);
					this.onButtonClicked();
				}
			}, 1000)
	}
	onButtonClicked=()=> {
		this.setState({query:this.myVariable},()=>{
			if(this.state.query===''){
			this.setState({status:'Empty',results:[],loaded:false});
			this.renderSearchResults();
		}else{
			this.startTime();
			const searchUrl=`https://aravindtwitter.herokuapp.com/twittersearch?key=${this.state.query}`;
			http.fetchData(searchUrl).then(data=>{
				this.setState({results:data,loaded:true})
			},err=>{
				console.log("Error");
			});
		}
		});
	};
	renderTimer=()=>{
		if(this.state.loaded){
			return(
				<div>Auto Refresh in <span className="time-color">{this.state.time}</span> Seconds</div>
			)
		}
	}
	render() {
		return (
			<div className="App container">
				<div className="panel">
				    <div className="panel-heading">
				         <div className="panel-title pull-left ">
				            <b> Search@Twitter</b>
				         </div>
				        <div className="panel-title pull-right">{this.renderTimer()}</div>
				        <div className="clearfix"></div>
				    </div>
				</div>
			<div className="input-group">
			<input type="text" className="form-control" placeholder="Search" name="query" id="search-input"  onChange={ this.handleChange }/>
			<div className="input-group-btn">
			<button className="btn btn-primary" onClick={this.onButtonClicked}><i className="glyphicon glyphicon-search"></i></button>
			</div>
			</div>
			{this.renderSearchResults()}
			</div>
			);
	}
}

export default search;