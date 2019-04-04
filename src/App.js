import React, { Component } from 'react';
import * as firebase from 'firebase';
import TimerDisplay from './components/TimerDisplay';
import SlideList from './components/SlideList';
import WorkoutList from './components/WorkoutList';
import Login from './components/Login';
import './App.css';
import fire from './components/config/fire';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      currentWorkout: '',
      nextSlide: '',
      lastSlide: '',
      queue: [],
      slideList: [],
      user: null,
    }
    this.SlidesRef = firebase.database().ref('Slides');
    this.createSlide = this.createSlide.bind(this);
    this.setCurrentWorkout = this.setCurrentWorkout.bind(this);
    this.authListener = this.authListener.bind(this);
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
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        localStorage.removeItem('user');
      }
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

  logout() {
      fire.auth().signOut();
  } 

  render() {
    return (
      <div className="App ">{this.state.user ? (
        <div>       
          <div className=" centered row threeBlueBack">
            <TimerDisplay 
              firebase={firebase}
              slideQueue = {this.state.queue}
              slideList = {this.state.slideList}
              currentWorkout = {this.state.currentWorkout}
            />
            <button onClick={(e)=>this.logout(e)}>
              Log Out
            </button>
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
        )         
        : (<Login />)}
      </div>
    
    );
  }
}


export default App;

