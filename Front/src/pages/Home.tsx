import {IonContent, IonHeader, IonImg, IonInput, IonPage, IonToolbar,
  IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonCardContent, IonButton, IonAlert} from '@ionic/react';
import React, { useState  } from 'react';
import './Home.css';
import image from '../img/logoGana.png';
import { withRouter } from "react-router";
import {login} from '../services/Users.js'; 


const Home: React.SFC<any> = (props) => {

  const [state, setState] = useState();

  let getValuesForm = (e: any) =>{

    if(e.target.id === "username"){
      setState({
        ...state,
        username: e.target.value
      })
    }
    else if(e.target.id === "password"){
      setState({
        ...state,
        password: e.target.value
      })
    }
    else if(e.target.id === "host"){
      setState({
        ...state,
        host: e.target.value
      })
    }
  }

  const res = (value: any) =>{

    console.log(value);

    if(value.status === 200){
      //props.history.push("/MainView")
    }else{
      console.log("Credenciales inválidas");
    }
  }

  const validateUser = () =>{

    if(localStorage.getItem('host') === null){
      setState({
        ...state,
        show: true,
        header: "No se encontró un HOST",
        message: "No se encontró un host configurado. Debe agregar uno para continuar. válide la IP del servidor, agréguela e intente de nuevo"
      })
    }else{
      if(state){
        // Servicio de consulta de usuario;
        login(state.username, state.password, res);
      }else{
        setState({
          ...state,
          show: true,
          header: "Información incorrecta",
          message: "Válide que el formulario este completo y los datos ingresados sean los correctos"
        })
      }
    }   
  }

  const createHost = () =>{
    if(state){
      localStorage.setItem('host', state.host);
      setState({
        ...state,
        show: true,
        header: "Configuración creada",
        message: "Usted agrego el host: "+ state.host
      })
    }
  }

  const setShowAlert = () =>{
    setState({
      ...state,
      show: false
    })
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
          <IonCol size-md="2" size-sm="1" className="lateralHome"></IonCol>
          <IonCol size-md="8" size-sm="10" className="mainHome">
            <IonCard className="cardFormHome">
              <IonCardHeader>
                <IonCardTitle>Bienvenido a GANA</IonCardTitle>
                <IonCardSubtitle>Aplicación para consulta y pago de premios</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonInput placeholder="Nombre de Usuario" onIonChange={
                  (x) => getValuesForm(x)} id="username"></IonInput>
                <IonInput placeholder="Contraseña" type="password" id="password" onIonChange={(x) => getValuesForm(x)} ></IonInput>
                  <div id="containerButton"><IonButton color="default" onClick={validateUser}>Ingresar</IonButton></div>
                  <div><p>¿Olvidaste tu contraseña?, haz clic aquí para recuperarla</p></div>
              </IonCardContent>
            </IonCard>
            <p className="labelHost">Complete primero la información necesaria para la conexión con el servidor</p>
            <div className="containerHost">
              <IonInput placeholder="añadir host de conexión"  onIonChange={(x) => getValuesForm(x)} id="host"></IonInput>
              <IonButton color="default" onClick={createHost}>Confirmar</IonButton>
            </div>
          </IonCol>
          <IonCol size-md="2" size-sm="1" className="lateralHome"></IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Home);
