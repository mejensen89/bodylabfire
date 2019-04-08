import React, {Component} from 'react';
import Fullscreen from "react-full-screen";
import Logo from '../logo.svg';


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
			loop: true,
			currentWorkout: ''
		}
		this.SlidesRef = this.props.firebase.database().ref('Slides');
	}

	componentDidMount(){
		
		this.setState({currentWorkout: this.props.currentWorkout});
	}	

	componentDidUpdate(prevProps, prevState) {
	  if(prevProps.currentWorkout !== this.props.currentWorkout){
	  	console.log("Updated Workout currently loaded. ");
	  	this.setState({currentWorkout: this.props.currentWorkout})
	  }
	    //this.format();
	}

	catchMinutes (e){
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

	toggleLoop(e){
		this.setState({ loop: !this.state.loop});
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
		var oldMin = parseInt(this.state.minutes*60);
			var oldSec = parseInt(this.state.seconds);
			var totalSec = parseInt(oldMin)+parseInt(oldSec);
		if (this.props.currentWorkout.slides === undefined){
			alert("We're glad you're ready to start your workout. Would you please load the workout you'd like to do first?");
		} else if (this.props.currentWorkout.slides !== undefined){
			//this.format();			
			var tock = setInterval(()=>{
				
				this.format();
				console.log(totalSec, oldMin, oldSec);
				var newMin = parseInt(totalSec/60);
				var newSec= totalSec%60;
				this.setState({
					minutes: newMin,
					seconds: newSec,
				});
				if (this.state.playList.length > this.props.currentWorkout.slides.length){
					clearInterval(tock);
					alert("Something went wrong. There are more zones loaded than are in this workout. Please tell the front desk");
					return
				} else if (this.state.playList.length <= this.props.currentWorkout.slides.length){
					if (this.state.isRunning === true){
						if (this.state.playList.length ===0){
							this.setState({
								title: "Loading...",
								formattedTime: "Get Ready",
							})							
							for (var j = 0; j< this.props.currentWorkout.slides.length; j++){
								for (var x = 0; x <this.props.slideList.length; x++){
									if (this.props.currentWorkout.slides[j] === this.props.slideList[x].key && this.state.playList.length <= this.props.currentWorkout.slides.length){
										this.state.playList.push(this.props.slideList[x]);
										if(this.state.playList.length === 0){
											this.setState({
												title: this.props.slideList[x].title,
												color: this.props.slideList[x].color,
												minutes: this.props.slideList[x].minutes,
												seconds: this.props.slideList[x].seconds,
												//totalSec: parseInt(parseInt(this.state.playList[0]*60)+this.state.playList[0].seconds)
											})
											console.log("playlist loaded from slideList");
											oldMin = this.props.slideList[x].minutes;
											oldSec = this.props.slideList[x].seconds;
											totalSec = parseInt(this.props.slideList[x].minutes)+parseInt(this.props.slideList[x].seconds)
										}																			
									}
								}
							}
						}else if (this.state.playList.length >0){
							let c = this.state.currentSlide;
							let n = this.state.currentSlide+1;
							let pl = this.state.playList;
							if (this.state.nextSlide<= this.state.playList.length){
								if (totalSec >= 0){
									totalSec = totalSec-1;
								} else if (totalSec < 0){
									this.setState({
										title: pl[c].title,
										color: pl[c].color,
										minutes: pl[c].minutes,
										seconds: pl[c].seconds,
										lastSlide: this.state.lastSlide+1,
										currentSlide: this.state.currentSlide+1,
										nextSlide: n+1,
									})
									totalSec = parseInt(pl[c].minutes*60)+parseInt(pl[c].seconds)
								}
							}else if(this.state.nextSlide>this.state.playList.length){
								if(totalSec>=0){
									totalSec = totalSec-1
								} else if (totalSec<0){
									if(this.state.loop === true){
										this.setState({
											title: pl[0].title,
											color: pl[0].color,
											minutes: pl[0].minutes,
											seconds: pl[0].seconds,
											lastSlide: -1,
											currentSlide: 0,
											nextSlide: 1
										})
										totalSec = parseInt(pl[0].minutes*60)+parseInt(pl[0].seconds)
									} else if (this.state.loop === false){
										this.setState({title: "That's it for cardio today. Great job! Get ready to lift!"});
										clearInterval(tock)
										return
									}
									
								}
							}
							
						} else if (this.state.playList.length <0){
							alert("playList length is negative. This shouldn't be possible. ")
							clearInterval(tock);
							return
						}
					}else if (this.state.isRunning === false){
						alert("Workout paused. Press start to resume.");
						clearInterval(tock);
						return;
					}
					
				}
			},1000)
		}

			 
	}

	format(){
		console.log("formatter called");
		if(this.state.minutes <10 && this.state.seconds <10){
			this.setState({formattedTime: ("0"+ this.state.minutes+":0"+this.state.seconds)});
		} else if ( this.state.minutes < 10 && this.state.seconds >=10){
			this.setState({formattedTime: ("0" +this.state.minutes+":"+this.state.seconds)});
		} else if (this.state.minutes >= 10 && this.state.seconds < 10){
			this.setState({formattedTime: (this.state.minutes+":0"+this.state.seconds)});
		} else if (this.state.minutes >= 10 && this.state.minutes >= 10){
			this.setState({formattedTime: (this.state.minutes+":"+this.state.seconds)});
		} else if (this.state.minutes === 0 && this.state.seconds === 0 && this.state.isRunning === false){
			this.setState({formattedTime: "--:--"});
		} else if (this.state.minutes <= 0 && this.state.seconds <=0 && this.state.isRunning === true){
			this.setState({formattedTime: "--:--"})
		}
	}


	render(){
		return(
			<div>
				<Fullscreen 
					enabled = {this.state.isFull}
					onChange={isFull => this.setState({isFull})}
				>
				<div  className= {this.state.isFull === true ? "isFull":"centeredOnScreen" } style={{margin: "20px", backgroundColor: this.state.color}}>
					<h1> {this.state.title}: {this.state.formattedTime}</h1>
          			<img src={Logo}  className={this.state.isFull?("App-logo-big"):("App-logo-small")} alt="logo" />
				</div>
				</Fullscreen>
				<div>
					<p> The current workout loaded is: {this.state.currentWorkout.Title}</p>
				</div>
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
					<button onClick={(e)=>this.toggleLoop()}> Loop </button>
				</div>
				
			</div>
		)
	}

}

export default TimerDisplay;