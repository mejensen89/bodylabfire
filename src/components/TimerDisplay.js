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
			isRunning: false,
			formattedTime: '--:--',
			isFull: false,
			lastSlide: -1,
			currentSlide: 0,
			nextSlide: 1,
			playList: [],
			played: false,
		}
		this.SlidesRef = this.props.firebase.database().ref('Slides');
	}

	componentDidMount(){
		console.log("Here is the Timer Display");
		this.setState({currentWorkout: this.props.currentWorkout});
	}	

	componentDidUpdate(prevProps) {
	  /*if(prevProps.currentWorkout!==this.props.currentWorkout){
	    //Perform some operation here
	    this.setState({playList: this.props.currentWorkout});
	  }*/
	}

	catchMinutes (e){
		console.log("things are happening!!!");
		this.setState({ minutes: e.target.value });
	}

	componentDidUpdate(){
		console.log("TimerDisplay Updated");
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

	startWorkout(e){
		this.setState({isRunning: !this.state.isRunning});
		for (var j = 0; j< this.props.currentWorkout.slides.length; j++){
			for (var x = 0; x <this.props.slideList.length; x++){
				if (this.props.currentWorkout.slides[j] === this.props.slideList[x].key){
					this.state.playList.push(this.props.slideList[x]);
					this.setState({
						title: this.props.slideList[x].title,
						color: this.props.slideList[x].color,
						minutes: this.props.slideList[x].minutes,
						seconds: this.props.slideList[x].seconds,
					});										
				}
			}
		}
		if (this.state.isRunning === true){
			var oldMin = parseInt(this.state.minutes*60);
			var oldSec = parseInt(this.state.seconds);
			var totalSec = parseInt(oldMin)+parseInt(oldSec);
			var tock = setInterval(()=>{
				this.format();
				var newMin = parseInt(totalSec/60);
				var newSec= totalSec%60;
				this.setState({
					minutes: newMin,
					seconds: newSec,
				});
			if (totalSec >0 && this.state.played === false && this.state.nextSlide <= this.state.playList.length){
				let newTotal = totalSec-1
				totalSec = totalSec-1
			} else if (totalSec === 0 && this.state.played === false && this.state.nextSlide <= this.state.playList.length){
				totalSec = totalSec-1;
				this.setState({played: true})
			} else if (this.state.nextSlide > this.state.playList.length){
				clearInterval(tock);
				return;
			}else if (this.state.played === true && this.state.nextSlide <= this.state.playList.length){
				let newNext = this.state.nextSlide+1
				this.setState({
					currentSlide: this.state.nextSlide,
					lastSlide: this.state.currentSlide,
					nextSlide: newNext,
					title: this.state.playList[this.state.nextSlide].title,
					color: this.state.playList[this.state.nextSlide].color,
					minutes: this.state.playList[this.state.nextSlide].minutes,
					seconds: this.state.playList[this.state.nextSlide].minutes,
				});
			}
			}, 1000)
		} else if (this.state.isRunning === false){

		}
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
					<button onClick={(e)=>this.startWorkout()}> Start </button>
				</div>
				
			</div>
		)
	}

}

export default TimerDisplay;