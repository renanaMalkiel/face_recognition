import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import EntryTracking from './components/EntryTracking/EntryTracking';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


const app = new Clarifai.App({
 apiKey: '84e8b83dcec04443bb028626213fb9c8'
});

const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
};

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  calculateFaceLocation = (data) => {
      const faceBoundaries = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: faceBoundaries.left_col * width,
        topRow: faceBoundaries.top_row * height,
        rightCol: width - (faceBoundaries.right_col * width),
        bottomRow: height - (faceBoundaries.bottom_row * height)
      }
  }

  loadUser = (user) => {
    this.setState({user : {
      id: user.id,
      name: user.name,
      email: user.email,
      entries: user.entries,
      joined: user.joined
    }})
  } 

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if(route === 'home') {
      this.setState({isSignedIn: true})      
    }
    this.setState({route: route})
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict( Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
       <Particles className='particles'
        params={particlesOptions} 
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        { this.state.route === 'home' ? 
        <div>
          <Logo />
          <EntryTracking name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
        </div> :
        ( this.state.route === 'register' ?
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> :
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
      }
      </div>
    );
  }
}

export default App;
