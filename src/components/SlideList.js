import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SlideList extends Component {
	constructor(props){
		super(props);
		this.state = {			
			minutes: 0,
			seconds: 0,
			title: '',
			id: 0,
			color: '',
			lastPlayed: this.props.firebase.database.ServerValue.TIMESTAMP,
			queue: [], 
			slideList: [],
			showTab: false,
		}
		this.SlidesRef = this.props.firebase.database().ref('Slides');
		this.createSlide = this.createSlide.bind(this);
	}

	componentDidMount(){
		console.log("Slide List Loaded");
		this.SlidesRef.on('child_added', snapshot =>{
	      const slides = snapshot.val();
	      slides.key = snapshot.key
	      this.setState({ slideList: this.state.slideList.concat(slides)});
	      console.log("slide List populated");
	    });
	    this.SlidesRef.on('child_removed', snapshot =>{
	      this.setState({slideList: this.state.slideList.filter(slide => slide.key !== snapshot.key)})
	    });
	}

	componentDidUpdate(){
		console.log("Slide List updated");
	}

	createSlide(newSlide){
		this.SlidesRef.push({
			title: this.state.title,
			minutes: this.state.minutes,
			seconds: this.state.seconds,
			color: this.state.color, 
			id: this.state.id,
			lastPlayed: this.state.lastPlayed, 
		});
		this.setState({ newSlide: ''});
		alert("Slide Sumbitted");
	}
	

	catchTitle(e){
		this.setState({title: e.target.value})
	}

	catchMinutes(e){
		this.setState({minutes: e.target.value})
	}

	catchSeconds(e){
		this.setState({seconds: e.target.value})
	}

	catchColor(e){
		this.setState({color: e.target.value})
	}


	addToWorkout(e){
		this.props.addToWorkout(e.target.innerText);
	}

	removeSlide(slide){
		this.SlidesRef.child(slide.key).remove();
	}

	




	render(){
		return(
			<div>
				<h2> Make New Slide </h2>
				<div className=" row">					
					<form onSubmit = {(e)=> {e.preventDefault(); this.createSlide(this.state.newSlide)}} >
						<formRow className = "smallRow ">					
						<legend>Title: </legend>
						<input type = "text" onChange={(e)=> this.catchTitle(e)}/>
						<legend>Color:</legend>
						<input type = "string" onChange={(e)=> this.catchColor(e)}/>  
						</formRow>
						<formRow className = "smallRow">
						<legend> Time: </legend>
						<input type="number"  placeholder="1" onChange={(e)=> this.catchMinutes(e)}/> 
						<input type = "number" placeholder="30" onChange={(e)=> this.catchSeconds(e)}/>  
						</formRow>
						<input type="submit" placeholder="save slide" />
					</form>
				</div>
				<h1> Slide List </h1>
				<p> click the ID to add the workout to the queue </p>

				<div>
					<div>
						<button> Green </button>
						<div className="slideList wrapRow sliverBack">
							{this.props.slideList.filter(slide => slide.color == "Green" ).map((slide, index)=>
								<div key={index} className="slideListEntry" >
									<p><strong>  {slide.title} </strong></p>
									<p> Color: {slide.color} </p>
									<p> ID: </p>
									<p onClick={(e)=> this.addToWorkout(e)} >{slide.key}  </p>
									<p> {slide.minutes}:{slide.seconds} </p>
									
									<button
										onClick = {(e)=>this.removeSlide(slide)}
									> Delete </button>

								</div>
							)}
						</div>
					</div>
					<div>
						<button> Yellow </button>
						<div className="slideList wrapRow sliverBack">
							{this.props.slideList.filter(slide => slide.color == "Yellow" ).map((slide, index)=>
								<div key={index} className="slideListEntry" >
									<p><strong>  {slide.title} </strong></p>
									<p> Color: {slide.color} </p>
									<p> ID: </p>
									<p onClick={(e)=> this.addToWorkout(e)} >{slide.key}  </p>
									<p> {slide.minutes}:{slide.seconds} </p>
									
									<button
										onClick = {(e)=>this.removeSlide(slide)}
									> Delete </button>

								</div>
							)}
						</div>
					</div>
					<div>
						<button> Red </button>
						<div className="slideList wrapRow sliverBack">
							{this.props.slideList.filter(slide => slide.color == "Red" ).map((slide, index)=>
								<div key={index} className="slideListEntry" >
									<p><strong>  {slide.title} </strong></p>
									<p> Color: {slide.color} </p>
									<p> ID: </p>
									<p onClick={(e)=> this.addToWorkout(e)} >{slide.key}  </p>
									<p> {slide.minutes}:{slide.seconds} </p>
									
									<button
										onClick = {(e)=>this.removeSlide(slide)}
									> Delete </button>

								</div>
							)}
						</div>
					</div>
					<div>
						<button> Other </button>
						<div className="slideList wrapRow">
							{this.props.slideList.filter(slide => 
								slide.color != "Green" && slide.color != "Yellow" && slide.color != "Red" )
								.map((slide, index)=>
								<div key={index} className="slideListEntry sliverBack" >
									<p><strong>  {slide.title} </strong></p>
									<p> Color: {slide.color} </p>
									<p> ID: </p>
									<p onClick={(e)=> this.addToWorkout(e)} >{slide.key}  </p>
									<p> {slide.minutes}:{slide.seconds} </p>
									
									<button
										onClick = {(e)=>this.removeSlide(slide)}
									> Delete </button>

								</div>
							)}
						</div>
					</div>
					
				</div>
				
			</div>
		)
	}
}

SlideList.protoTypes = {
	addToWorkout: PropTypes.func,
	SlideList: PropTypes.func,
}

export default SlideList;