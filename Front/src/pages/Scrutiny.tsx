import React, {useState} from 'react';
import { IonHeader, IonToolbar, IonPage, IonImg, IonContent, IonRow, IonCol, IonList, IonAlert} from '@ionic/react';
import { withRouter } from "react-router";
import image from '../img/logoGana.png';
import './Scrutiny.css';
import {closeLoteries} from '../services/Loteries.js'; 

const Scrutiny: React.FC<any> = (props) => {

  const [state, setState] = useState();

  if(state === undefined && props.location.state){

    let getAllWinners = closeLoteries(props.location.state.valueLotery, props.location.state.dateLotery);

    getAllWinners.then((value: any) =>{

      if(value && typeof value === 'object'){
        value[0].then((x: any) =>{
          let winnerInformation = [];
          let numberInformation = [];
          for(let i in x){
            winnerInformation.push(x[i].infoUser());
            numberInformation.push(x[i].infoBet()); 
          }
          setState({...state, winnerInformation: winnerInformation, numberInformation: numberInformation});
        });
      }else{
        setState({
          ...state,
          show: true,
          header: "Oops!",
          message: value
        })
      }
    })
  }

  let setShowAlert = () =>{
    setState({...state, show: false});
  }

  return (
    <IonPage>
      <IonAlert
        isOpen={state? state.show : false}
        onDidDismiss={() => setShowAlert()}
        header={state ? state.header: null}
        subHeader={''}
        message={state ? state.message : null}
        buttons={['OK']}
      />
      <IonHeader className="headerPage">
        <IonToolbar>
          <IonImg className="imgLogo" src={image} />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow>
          <IonCol size-md="2" size-sm="1" className="containerLat"></IonCol>
          <IonCol size-md="4" size-sm="5" className="containerInfo">
            <div className="contentFinal">PREMIO A ENTREGAR</div>
            <IonList>
              {state ? state.numberInformation : null}
            </IonList>
          </IonCol>
          <IonCol size-md="4" size-sm="1" className="containerInfo">
            <div className="contentFinal">GANADORES APUESTA</div>
            <IonList>
              {state ? state.winnerInformation : null}
            </IonList>
          </IonCol>
          <IonCol size-md="2" size-sm="1" className="containerLat"></IonCol>
        </IonRow>

      </IonContent>
    </IonPage>
  );
};

export default withRouter(Scrutiny);
