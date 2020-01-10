
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './store'
import './App.css'

import Main from './components/Main'
import Pets from './components/Pets'
import UploadPet from './components/UploadPet'


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Main>
              <Switch>
                <Route exact path="/" component={Pets} />
                <Route exact path="/uploadPet" component={UploadPet} />
              </Switch>
            </Main>
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App

