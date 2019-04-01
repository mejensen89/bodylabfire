import React, { Component } from 'react';
import * as firebase from 'firebase';
import TimerDisplay from './components/TimerDisplay';
import SlideList from './components/SlideList';
import WorkoutList from './components/WorkoutList';
import './App.css';

var config = {
    apiKey: "AIzaSyD2phjazBJ11tnYm3WcLVBLlfU8ZV4LQkg",
    authDomain: "bodylabfire.firebaseapp.com",
    databaseURL: "https://bodylabfire.firebaseio.com",
    projectId: "bodylabfire",
    storageBucket: "bodylabfire.appspot.com",
    messagingSenderId: "298581608652"
  };
firebase.initializeApp(config);

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      currentWorkout: '',
      nextSlide: '',
      lastSlide: '',
      queue: [],
      slideList: [],
    }
    this.SlidesRef = firebase.database().ref('Slides');
    this.createSlide = this.createSlide.bind(this);
    this.setCurrentWorkout = this.setCurrentWorkout.bind(this);
  }

  componentDidMount(){
    this.SlidesRef.on('child_added', snapshot =>{
      const message = snapshot.val();
      message.key = snapshot.key
      this.setState({ slideList: this.state.slideList.concat(message)});
      console.log("slide List populated");
    });
    this.SlidesRef.on('child_removed', snapshot =>{
      this.setState({slideList: this.state.slideList.filter(slide => slide.key !== snapshot.key)})
    });
  }

  slidesToWorkout(slideID){
    this.setState({ queue: [...this.state.queue, slideID]});
  }

  createSlide(newSlide){
    this.SlidesRef.push({
      minutes: this.state.minutes,
      seconds: this.state.seconds,
      title: this.state.title,
      id: this.state.id,
      color: this.state.color,
      lastPlayed: this.state.lastPlayed
    });
    this.setState({newSlide: ''});
    alert("Slide submitted");
  }

  updateId(e){
    let newId = 0;
    for (var i=0; i<this.state.slideList.index; i++){
      newId++;
    };
    this.setState({ id: newId});
  }


  removeSlide(slide){
    this.SlidesRef.child(slide.key).remove();
  }

  setCurrentWorkout(workout){
    this.setState({currentWorkout: workout})
  }  

  render() {
    return (
      <div className="App ">
        <div className=" centered row threeBlueBack">
          <TimerDisplay 
            firebase={firebase}
            slideQueue = {this.state.queue}
            slideList = {this.state.slideList}
            currentWorkout = {this.state.currentWorkout}
          />
        </div>
        <div className="row">
          <div className = "threeWide">
            <SlideList 
              firebase= {firebase}
              addToWorkout = {this.slidesToWorkout.bind(this)}
              slideList = {this.state.slideList}
            />
          </div>
          <div className = "threeWide">
            <WorkoutList
              firebase = {firebase}
              slideQueue = {this.state.queue}
              setCurrentWorkout = {this.setCurrentWorkout}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default App;

