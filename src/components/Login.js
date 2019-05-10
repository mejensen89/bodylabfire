import React, { Component } from 'react';
import fire from './config/fire';

class Login extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    //this.signup = this.signup.bind(this);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).catch((error) => {
        console.log(error);
      });
  }

  //sign up function removed to make it so only users put in by a human being can log in. 
  //That is the simplest security feature I could think of and since its for a small scale application, I think its an ok solution. 

  /*signup(e){
    e.preventDefault();
    fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    }).then((u)=>{console.log(u)})
    .catch((error) => {
        console.log(error);
      })

      ///Here's the sign up button if we need it again. 
      //<button onClick={this.signup} style={{marginLeft: '25px'}} className="btn btn-success">Signup</button>

  }*/

  render() {
    return (
       <div className="sixWide">

           <form className= "blackOut threeGrayBack">
            <div>
              <div>
                <small>If you're having trouble logging in, please contact the admin</small>
              </div>
             <label for="exampleInputEmail1">Email address</label>
             <input value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
            
             <div >
            <label for="exampleInputPassword1">Password</label>
            <input value={this.state.password} onChange={this.handleChange} type="password" name="password" classname="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <button type="submit" onClick={this.login} >Login</button>
          </form>
       
       </div>
      );
  }
}
export default Login;
