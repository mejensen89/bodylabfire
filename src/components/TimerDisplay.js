import React, {Component} from 'react';
import Fullscreen from "react-full-screen";
import * as firebase from 'firebase';


class TimerDisplay extends Component {

	constructor(props){
		super(props);
		this.state = {
			minutes: 0,
			seconds: 0,
			totalSec: 0,
			title: '',
			id: '',
			color: '',
			lastPlayed: this.props.firebase.database.ServerValue.TIMESTAMP,
			isRunning: false,
			formattedTime: '--:--',
			isFull: false,
			queuePlayer: [],
		}
		this.SlidesRef = this.props.firebase.database().ref('Slides');
	}

	componentDidMount(){
		console.log("Here is the Timer Display");
	}	

	catchMinutes (e){
		console.log("things are happening!!!");
		this.setState({ minutes: e.target.value });
	}

	catchSeconds(e){
		this.setState({ seconds: e.target.value });
	}

	catchColor(e){
		this.setState({ color: e.target.value });
	}

	catchTitle(e){
		this.setState({ title: e.target.value});
	}

	toggleIsRunning(e){
		this.setState({ isRunning: !this.state.isRunning});
	}

	tick(e){
		this.toggleIsRunning(e);
		var oldMin = parseInt(this.state.minutes*60);
		var oldSec = parseInt(this.state.seconds);
		var totalSec = parseInt(oldMin)+parseInt(oldSec);
		var tock = setInterval(()=>{
			this.format();
			console.log(totalSec, oldMin, oldSec);
			var newMin = parseInt(totalSec/60);
			var newSec= totalSec%60;
			this.setState({
				minutes: newMin,
				seconds: newSec,
			});
			if (this.state.isRunning === false){
				clearInterval(tock);
				return;
			} else if (totalSec >= 0 && this.state.isRunning === true){
				totalSec = totalSec-1;			
			} else if (totalSec === -1 && this.state.isRunning === true){
				this.setState({
					totalSec: 0,
					minutes: 0,
					seconds: 0, 
					isRunning: false 
				});
				clearInterval(tock);
				return;			
			}
		}, 1000);
	
	}

	goFull(e) {
		this.setState({ isFull: true });
	}


	format(){
		console.log("formatter called");
		if(this.state.minutes <10 && this.state.seconds <10){
			this.setState({formattedTime: ("0"+this.state.minutes+":"+"0"+this.state.seconds)});
		} else if (this.state.minutes < 10 && this.state.seconds >10){
			this.setState({formattedTime: ("0"+this.state.minutes+":"+this.state.seconds)});
		} else if (this.state.minutes > 10 && this.state.seconds < 10){
			this.setState({formattedTime: (this.state.minutes+":"+"0"+this.state.seconds)});
		} else if (this.state.minutes > 10 && this.state.minutes > 10){
			this.setState({formattedTime: (+this.state.minutes+":"+this.state.seconds)});
		} else if (this.state.minutes === 0 && this.state.seconds === 0){
			this.setState({formattedTime: "--:--"});
		}
	}

	getPlayList(){
		//needs to call next slide when tick hits 0.
		//NextS. will be passed in as prop from app.

	}

	/*queuePlayer(slide){
		let SQ = this.props.slideQueue;
		for (var i=0; i<SQ.length; i++) {
			this.setState( queuePlayer: [...this.state.queuePlayer, this.props.slideList.filter(slide => slide.key === SQ[i]);)
		}
	}*/


	render(){
		return(
			<div>
				<Fullscreen 
					enabled = {this.state.isFull}
					onChange={isFull => this.setState({isFull})}
				>
				<div  className= "centeredOnScreen" style={{margin: "20px", backgroundColor: this.state.color}}>
					<h1> {this.state.title}: {this.state.formattedTime}</h1>
				</div>
				</Fullscreen>
				<div className="row">
					<form>
						Title: <input type = "text" onChange={(e)=> this.catchTitle(e)}/>
						Color:<input type = "string" onChange={(e)=> this.catchColor(e)}/>
						Minutes:<input type="number" onChange={(e)=> this.catchMinutes(e)}/> 
						Seconds:<input type = "number" onChange={(e)=> this.catchSeconds(e)}/>  						   					
					</form>
				</div>
				<div className= "centered smallRow">
					<button onClick={(e)=>this.tick(e)}>Start/Pause</button>
					<button onClick={(e)=>this.goFull(e)}> Fullscreen </button>
					
					<button> Delete </button>
					<p> "TODO: add player controls"</p>
				</div>
				<div>
					<p> Slide Queue: {this.props.slideQueue.map((ID, index)=>
					 <p key = {index}> {ID} </p>
					)}
				</p>
				<button onClick={(e)=>this.queuePlayer()}> Get IDs </button>
				</div>
			</div>
		)
	}

}

export default TimerDisplay;