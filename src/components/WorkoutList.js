import React, {Component} from 'react';

class WorkoutList extends Component{
	constructor(props){
		super(props);
		this.state = {
			workoutList: [], 
			workoutTitle: '',
			workoutDate: new Date(),
			workoutSlides: [],
		}
		this.WorkoutsRef = this.props.firebase.database().ref('Workouts');
		this.createWorkout = this.createWorkout.bind(this);
	}

	componentDidMount(){
		this.WorkoutsRef.on('child_added', snapshot =>{
			const workout = snapshot.val();
			workout.key = snapshot.key
			this.setState({ workoutList: this.state.workoutList.concat(workout)});
		});
		this.WorkoutsRef.on('child_removed', snapshot =>{
			this.setState({workoutList: this.state.workoutList.filter(workout => workout.key !== snapshot.key)});
		});
	}

	createWorkout(newWorkout){
		this.WorkoutsRef.push({
			Title: this.state.workoutTitle, // this wil be a string from an input
			date: this.state.workoutDate, //this will be a date from an input
			slides: this.state.workoutSlides, //
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

	pushToSlides(e){
		this.setState({ workoutSlides: [e.target.value]});
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



	render(){
		return(
			<div>
				<div>
					<form  onChange={(e)=>this.pushToSlides(e)}>
						<formTitle> Add to Workout</formTitle>
						<input type="text" placeholder="some ID" />
					</form>
					<div>
					 <h2> Slides to Add </h2>
					 <p> {this.displaySlides()} </p>
					</div>
					<form>
						<formTitle>  Create A Workout </formTitle>
						<formRow onSubmit = {(e)=>this.createWorkout(this.state.newWorkout)}>  
							<legend> Title </legend>
							<input type = "text" />
							<legend> Date of Workout </legend>
							<input type = "date" />
						</formRow>
						<input type="submit" />
					</form>
				</div>
				<h1> Workout List </h1>
				<div className = "workoutList">
					{this.state.workoutList.map((workout, index)=>
						<div key= {index} className = "workoutListEntry wrapRow sixWide">
							<div className= "smallRow">
								<p><strong>  Title: {workout.Title} </strong></p>
								<p> Date: {this.formatDate(workout.date)}</p>
								<p> id: {workout.key} </p>
							</div>
							<div className = "smallRow">
								<p > Slides: </p>
								{workout.Slides.map((Slide, index)=>
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