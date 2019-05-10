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

	format(){
		let minutes = parseInt(this.state.totalSec/60);
		let seconds = parseInt(this.state.totalSec%60)
		console.log("formatter called");
		if(minutes <10 && seconds === "00"){
			this.setState({formattedTime: ("0"+ minutes+":"+seconds)});
		} else if (minutes <10 && seconds <10){
			this.setState({formattedTime: ("0"+ minutes+":0"+seconds)});
		} else if ( minutes < 10 && seconds >=10){
			this.setState({formattedTime: ("0" +minutes+":"+seconds)});
		} else if (minutes >= 10 && seconds < 10){
			this.setState({formattedTime: (minutes+":0"+seconds)});
		} else if (minutes >= 10 && minutes >= 10){
			this.setState({formattedTime: (minutes+":"+seconds)});
		} else if (minutes === 0 && seconds === 0 && this.state.isRunning === false){
			this.setState({formattedTime: "--:--"});
		} else if (minutes <= 0 && seconds <=0 && this.state.isRunning === true){
			this.setState({formattedTime: "--:--"})
		} else {
			this.setState({formattedTime: "something is wrong, very wrong. Tell Melvin"});
		}
	}

	startWorkout(e){
		this.setState({
			isRunning: !this.state.isRunning,
		});
		/*var oldMin = parseInt(this.state.minutes*60);
		var oldSec = parseInt(this.state.seconds);
		var totalSec = this.state.totalSec;*/
		if (!this.props.currentWorkout.slides){
			alert("We're glad you're ready to start your workout. Would you please load the workout you'd like to do first?");
		} else if (this.props.currentWorkout.slides){
			//this.format();			
			var tock = setInterval(()=>{				
				//this.format();
				console.log("tock")
				//console.log(totalSec, oldMin, oldSec);
				//var newMin = parseInt(this.state.totalSec/60);
				//var newSec= parseInt(this.state.totalSec%60);
				/*this.setState({
					minutes: newMin,
					seconds: newSec,
				});*/
				if (this.state.playList.length > this.props.currentWorkout.slides.length){
					clearInterval(tock);
					alert("Something went wrong. There are more slides loaded than are in this workout. Please tell the front desk");
					return
				} else if (this.state.playList.length <= this.props.currentWorkout.slides.length){
					if (this.state.isRunning === true){
						if (this.state.playList.length === 0){
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
												totalSec: parseInt(parseInt(this.state.playList[0].minutes*60)+this.state.playList[0].seconds)
											})
											console.log("playlist loaded from slideList");
											//oldMin = this.props.slideList[x].minutes;
											//oldSec = this.props.slideList[x].seconds;
											//totalSec = parseInt(this.props.slideList[x].minutes*60)+parseInt(this.props.slideList[x].seconds-1)
										}																			
									}
								}
							}
						}else if (this.state.playList.length >0){
							let c = this.state.currentSlide;
							let n = this.state.currentSlide+1;
							let pl = this.state.playList;
							if (this.state.nextSlide<= this.state.playList.length){
								if (this.state.totalSec > 1){
									// if there are total sec, count down by 1
									let newTotal = this.state.totalSec-1
									this.setState({
										totalSec: newTotal,
										minutes: parseInt(newTotal/60),
										second: parseInt(newTotal%60),
										title: pl[c-1].title,
										color: pl[c-1].color
									}, ()=>this.format())
									
									//totalSec = totalSec-1;
								} else if (this.state.totalSec <= 1){
									//next slide call									
									this.setState({
										title: pl[c].title,
										color: pl[c].color,
										minutes: pl[c].minutes,
										seconds: pl[c].seconds,
										lastSlide: c,
										currentSlide: c+1,
										nextSlide: n+1,
										totalSec: parseInt(pl[c].minutes*60)+parseInt(pl[c].seconds)
									}, ()=>this.format());
									console.log("Next Slide called")
									//totalSec = parseInt(pl[c].minutes*60)+parseInt(pl[c].seconds-1);
									//var newMin = parseInt(totalSec/60);
									//var newSec= totalSec%60;
								}
							}else if(this.state.nextSlide>this.state.playList.length){
								if(this.state.totalSec> 1){
									let newTotal = this.state.totalSec-1
									this.setState({
										totalSec: newTotal,
										minutes: parseInt(newTotal/60),
										second: parseInt(newTotal%60)
									}, ()=>this.format());
									
									//totalSec = totalSec-1
									console.log("loop coundown call")
								} else if (this.state.totalSec <= 1){
									if(this.state.loop === true){
										this.setState({
											title: pl[0].title,
											color: pl[0].color,
											minutes: pl[0].minutes,
											seconds: pl[0].seconds,
											lastSlide: 0,
											currentSlide: 1,
											nextSlide: 2,
											totalSec: parseInt(pl[0].minutes*60)+parseInt(pl[0].seconds)
										}, ()=>this.format());
										//totalSec = parseInt(pl[0].minutes*60)+parseInt(pl[0].seconds-1)
										console.log("loop reset call")
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

	


	render(){
		return(
			<div>
				<Fullscreen 
					enabled = {this.state.isFull}
					onChange={isFull => this.setState({isFull})}
				>
				<div  className= {this.state.isFull? ("isFull"):("centeredOnScreen") } style={{margin: "10px", backgroundColor: this.state.color}}>
					<h1> {this.state.title}: {this.state.formattedTime}</h1>
          			<img src={Logo}  className={this.state.isFull?("App-logo-big"):("App-logo-small")} alt="logo" />
				</div>
				</Fullscreen>
				<div>
					<p> The current workout loaded is: {this.state.currentWorkout.Title}</p>
				</div>
				<div className= "centered smallRow">
					<button onClick={(e)=>this.goFull(e)}> Fullscreen </button>					
					<button onClick={(e)=>this.startWorkout()}>{this.state.isRunning?("Pause"):("Start")}</button>
					<button onClick={(e)=>this.toggleLoop()}>{this.state.loop?("Loop"):("No Loop")}</button>
				</div>
				
			</div>
		)
	}

}

export default TimerDisplay;