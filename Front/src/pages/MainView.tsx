import React, {useState} from 'react';
import { IonContent, IonHeader, IonSelect, IonSelectOption, IonPage, IonImg, IonToolbar, IonRow, IonCol, IonButton, IonList, IonAlert } from '@ionic/react';
import image from '../img/logoGana.png';
import './MainView.css';
import {getDate, listLoteries, lastDate, getLastLoteries} from '../services/Loteries.js'; 

const MainView: React.FC<any> = (props) => {

  const [state, setState] = useState();
  
  let dateLotery = getDate();
  let loteryList = listLoteries(dateLotery);
  let lastLoteryDate = lastDate();

  let generateLoteries = () =>{
    let resultList = loteryList.then(list =>{
      let copyArray : any;
      let arrayDescription = [];

      if(Array.isArray(list) === true){
        copyArray = list;
      }

      if(copyArray){
        arrayDescription.push(copyArray[1].map((x:any) =>{
          return(<IonSelectOption value={x.idLotery} key={x.idLotery} id={x.idLotery}>{x.description}</IonSelectOption>);
        })); 
      }
      return [copyArray[0], arrayDescription]
    });
    return resultList;
  }

  
  if(state === undefined){
    getLastLoteries(lastLoteryDate).then(x=>{
      generateLoteries().then(v=>{
        setState({...state, arrayLoteries: v[0], arrayDescription: v[1], loteryLast: x});
      })
    })
  }
  
  let findWons = () => {
    props.history.push({
      pathname: '/scrutiny',
      state: { valueLotery: state.valueLotery, dateLotery: dateLotery }
    })
  }
  
  const setShowAlert = () =>{
    setState({...state, show: false})
  }

  let closeLotery = (e: any) =>{
    setState({...state, valueLotery: e.target.value})
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
          <IonCol size="2"></IonCol>
          <IonCol size="8" className="loteriesAvailable">
            <div>Loterías Disponibles, sorteo del {dateLotery}</div>
            <div className="dinamicLogo">
              {state ? state.arrayLoteries : null}
            </div>
          </IonCol>
          <IonCol size="2"></IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="2"></IonCol>
          <IonCol size="8" className="winsContainer">
            <p>Números ganadores sorteo: {lastLoteryDate}</p>
            {state ? state.loteryLast : null}
            <IonList>
              <IonSelectOption value="all">Todas las loterías</IonSelectOption>
            </IonList>
          </IonCol>
          <IonCol size="2"></IonCol>
          </IonRow>
          <IonRow>
          <IonCol size="2"></IonCol>
          <IonCol size="8" className="containerFinish">
            <div className="finishBet">
            <p>Finalizar un sorteo de hoy</p> 
            <IonSelect okText="Seleccionar" cancelText="Cancelar" placeholder="Seleccionar una Lotería"
            onIonChange ={(x) => closeLotery(x)}>
              {state ? state.arrayDescription : null}
            </IonSelect>
            </div>
            <div className="findWon">
              <p>Realizar Escrutinio: {state ? state.valueLotery : ""}</p>
              <IonButton color="default" onClick={findWons}>Escrutinio</IonButton>
            </div>
          </IonCol>
          <IonCol size="2"></IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default MainView;