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
			queue: []
		}
	}

	componentDidMount(){
		
	}

	componentDidUpdate(){
		console.log("Times they are a changing");
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



	render(){
		return(
			<div>
				<h2> Make New Slide </h2>
				<div className=" row">
					
					<form onSubmit = {(e)=> {e.preventDefault(); this.createSlide(this.state.newSlide); this.updateId(e)}} >
						<formRow className = "smallRow">					
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
				<div className="slideList wrapRow">
					{this.props.slideList.map((slide, index)=>
						<div key={index} className="slideListEntry">
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
		)
	}
}

SlideList.protoTypes = {
	addToWorkout: PropTypes.func,
	SlideList: PropTypes.func,
}

export default SlideList;