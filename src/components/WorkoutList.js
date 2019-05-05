import React, {Component} from 'react';

class WorkoutList extends Component{
	constructor(props){
		super(props);
		this.state = {
			workoutList: [], 
			workoutTitle: '',
			workoutDate: '',
			workoutSlides: [], 
			currentWorkout: '',
			user: this.props.user,
			currentDay: ''
		}
		this.WorkoutsRef = this.props.firebase.database().ref('Workouts');
		this.createWorkout = this.createWorkout.bind(this);
		this.removeWorkout = this.removeWorkout.bind(this);
	}

	componentDidMount(time){
		let today = new Date().toLocaleDateString()
		console.log(today)
		this.WorkoutsRef.on('child_added', snapshot =>{
			const workout = snapshot.val();
			workout.key = snapshot.key
			this.setState({ workoutList: this.state.workoutList.concat(workout)});
		});
		this.WorkoutsRef.on('child_removed', snapshot =>{
			this.setState({workoutList: this.state.workoutList.filter(workout => workout.key !== snapshot.key)});
		});
		this.state.workoutList.map((workout, date)=>{
			if (this.state.currentWorkout === ''){
				if(today === workout.date){
					this.props.currentWorkout = workout;
					console.log("auto Loader fired")
				}
			}
		})
	}

	componentDidUpdate(prevProps){
		if(this.props.user !== prevProps.user){
			console.log("user changed")
		}
	}

	createWorkout(newWorkout){
		this.WorkoutsRef.push({
			Title: this.state.workoutTitle, // this wil be a string from an input
			date: this.state.workoutDate, //this will be a date from an input
			slides: this.props.slideQueue, //
		});
		this.setState({ newWorkout: ''});
		alert("Workout submitted");
	}

	catchWorkoutTitle(e){
		this.setState({ workoutTitle: e.target.value});
	}

	catchWorkoutDate(e){
		this.setState({ workoutDate: e.target.value});
	}

	displaySlides(){
		let slides;
		for (var i = 0; i<this.state.workoutSlides.length; i++){
			slides = i
		}
		return slides;
	}

	formatDate(time){
		let date = new Date(time);
		let year = date.getFullYear();
		let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
		let month = months[date.getMonth()];
		let day = date.getDate();
		let timestamp = month + ' ' + day + ', ' + year + ' ';
		return timestamp
	}

	removeWorkout(workout){
		this.WorkoutsRef.child(workout.key).remove();
	}



	render(){
		return(
			<div>
				<div>
					{this.props.user?(
						<form onSubmit={(e)=>this.createWorkout(e)}>
						<formrow>
							<legend> Title </legend>
							<input type = "text" onChange={(e)=>this.catchWorkoutTitle(e)} />
							<legend> Date </legend>
							<input type = "date" onChange={(e)=>this.catchWorkoutDate(e)} />
						</formrow>
						<formrow>
							<legend> Slides to add to workout </legend>
							<div>
								<p> Slide Queue: {this.props.slideQueue.map((ID, index)=>
									 <p key = {index}> {ID} </p>
									)}
								</p>
							</div>
							<input type="submit" />
						</formrow>
					</form>
					):(<h1> Welcome to Body Lab! </h1>)}
					
				</div>
				<h1> Workout List </h1>
				<p> currentWorkout is {this.state.currentWorkout}</p>
				<div className = "workoutList">
					{this.state.workoutList.map((workout, index)=>
						<div key= {index} className = "workoutListEntry wrapRow sixWide">
							<div className= "smallRow">
								<p><strong>  Title: {workout.Title} </strong></p>
								<p> Date: {this.formatDate(workout.date)}</p>
								<p> id: {workout.key} </p>
								{this.props.user? (
									<div>
										<button onClick={(e)=>this.props.setCurrentWorkout(workout)}>
											Load 
										</button>
										<button onClick={(e)=>this.removeWorkout(workout)}>
											Delete
										</button>
									</div>
								) : (
									<button onClick={(e)=>this.props.setCurrentWorkout(workout)}>
										Load 
									</button>
								)}
								
							</div>
							<div className = "smallRow">
								<p > Slides: </p>
								{workout.slides.map((Slide, index)=>
									<div key={index} className = "slidesInWorkoutEntry">
										<p> ID: {Slide}, </p>
									</div>
								)}
							</div>
						</div>
						
					)}
				</div>
			</div>
		)
	}
}

export default WorkoutList;