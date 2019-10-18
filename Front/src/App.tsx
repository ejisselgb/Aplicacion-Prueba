import React, {useState} from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp
} from '@ionic/react';
import { IonReactRouter,  } from '@ionic/react-router';
import Home from './pages/Home';
import MainView from './pages/MainView';
import Scrutiny from './pages/Scrutiny';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

let auth = localStorage.getItem('user');

const App: React.FC = () => {

  const [state, setState] = useState();

  let authentication = (value: any) =>{
    setState({auth: value})
    localStorage.setItem('user', value);
  } 
  
  return(
    <IonApp>
    <IonReactRouter>
      <Route path="/home" component={() => <Home auth={authentication}/>} exact={true}/>
      <Route path="/mainview" render = {({history}) => (auth || state ?  (<MainView history={history} />) : (<Redirect to="/home" />))}/>
      <Route path="/scrutiny" render = {({history}) => (auth || state ?  (<Scrutiny history={history} />) : (<Redirect to="/home" />))}/>
      <Route exact path="/" render={() => <Redirect to="/home" />} />
    </IonReactRouter>
    </IonApp>
  );
}

export default App;
