import React from 'react';
import {IonImg, IonItem, IonLabel } from '@ionic/react';
import axios from 'axios';

let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export let ipservices = localStorage.getItem('host');

export function getDate(){

    let today = new Date();
    let year = today.getFullYear();
    let newYear = year.toString().substr(2, 4);
    let newToday = today.getDate() <= 9 ? "0"+today.getDate(): today.getDate();
    let shortMonth = months[today.getMonth()].toString().substr(0,3).toUpperCase();
    let date = newToday+'-'+shortMonth+'-'+newYear;
    
    return date;
}


export function lastDate(){
    
    let dateActual = new Date();
    let yesterday = new Date(dateActual.getTime() - 24*60*60*1000);
    let newToday = yesterday.getDate() <= 9 ? "0"+yesterday.getDate(): yesterday.getDate();
    let year = yesterday.getFullYear();
    let newYear = year.toString().substr(2, 4);
    let shortMonth = months[dateActual.getMonth()].toString().substr(0,3).toUpperCase();
    let dateOld = newToday+'-'+shortMonth+'-'+newYear;

    return dateOld;
}


export function listLoteries(date){

    let getList = axios.get('http://'+ipservices+':8080/service-gana-app/loteries/getloteries?date='+date)
     .then(response => {
        let nameLoteries  = [];
        let onlylotery = response.data.map((x) =>{
            nameLoteries.push({description: x.response.description, idLotery: x.response.idLotery});

            return (
            <div className="cointainerLogos" key={x.response.idLotery}>
                <div className="cardLogos">
                <IonImg className="imgLogo" src={'http://'+ipservices+':8100/'+x.response.image} />
                </div>
            </div>
            )
        })
        return [onlylotery, nameLoteries];
    })
     .catch(error => {
       console.log(error);
    });

    return getList;
}


export function getLastLoteries(date){

    let listLastLoteries = axios.get('http://'+ipservices+':8080/service-gana-app/loteries/winnersdate?date='+date)
     .then(response => {
        let arrayItem = response.data.map(x => {

          if(x.response.idWinnerNumber > 0 && x.response.numberWinner > 0){
            return(
              <IonItem key={x.response.idWinnerNumber}>
                <div className="wonLoterie">
                    <IonImg className="imgLogo" src={'http://'+ipservices+':8100/'+x.response.imageLotery} />
                    <p>{x.response.numberWinner}</p>
                </div>
              </IonItem>
            )
          }else{
            return(
              <IonItem key={1}>
                <div className="wonLoterie" >
                    <p>No hay datos para mostrar</p>
                </div>
              </IonItem>
            )
          }          
        })
        return arrayItem;
      })
     .catch(error => {
       console.log(error);
     });
    return listLastLoteries;
}


function getLoteryNumbers(number, date){
  let getWinnersBet = axios.get('http://'+ipservices+':8080/service-gana-app/loteries/getnumberslotery?idLotery='+number+'&date='+date)
  .then(response => {
    if(response.data.length > 0){
        return getWinners(date, response.data);
    }else{
      let stringError = "No se encontraron números ganadores con la lotería cerrada";
      return stringError;
    }
  })
  .catch(error => {
    console.log(error);
  });

  return getWinnersBet;
}

export function closeLoteries(idLotery, date){

    let getNumbers = axios.put('http://'+ipservices+':8080/service-gana-app/loteries/closelotery/?id='+idLotery)
     .then(response => {
        if(response.data > 0){
          return getLoteryNumbers(response.data, date);
        }else{
          console.log("No hay loterías compradas para este número, no es posible realizar un escrutinio ");
        }
    })
    .catch(error => {
      console.log(error);
    });

    return getNumbers;
}

export function getColilla(number){

  let date = getDate();
  let generateInfoWinner = axios.get('http://'+ipservices+':8080/service-gana-app/loteries/winners?number='+number)
  .then(response => {

    let finalData = [];

    for(var i in response.data){
      let totalPrize = parseInt(response.data[i].response.price) * 200;
      let iva = totalPrize * 0.19;
      let netoPrize = totalPrize - iva;
      let fullName = response.data[i].response.name + " " + response.data[i].response.lastName;
      
      // eslint-disable-next-line no-loop-func
      let infoUser = () =>{return(
        <IonItem key={response.data[i].response.idColilla}>
          <IonLabel>
            <h2>Nombre: {fullName}</h2>
            <h3>Número colilla: {response.data[i].response.idColilla}</h3>
            <h3>Total a pagar: {netoPrize}</h3>
          </IonLabel>
        </IonItem>
      )};

      // eslint-disable-next-line no-loop-func
      let infoBet = () =>{return(
        <IonItem key={response.data[i].response.idColilla}>
          <IonLabel>
            <h2>Número Ganador: {response.data[i].response.numberResult}</h2>
            <h3>Total apuesta: ${response.data[i].response.price}</h3>
            <h3>Valor premio: ${netoPrize}</h3>
          </IonLabel>
        </IonItem>
       )};

      let obj ={
        infoUser: infoUser, infoBet: infoBet
      }

      finalData.push(obj);
      generatePrize (date, response.data[i].response.idColilla, totalPrize, netoPrize);
    }
    return finalData;
  })
  .catch(error => {
    console.log(error);
  });

  return generateInfoWinner;

}

export function getWinners(date, number){

    let arrayCollilla = [];

    for(let i in number){
      let colilla = axios.get('http://'+ipservices+':8080/service-gana-app/loteries/winnersnumbers?date='+date+'&number='+number[i].response.number)
      .then(response => {
       if(response.status === 200){
         return getColilla(number[i].response.number);
       }else{
         console.log("No hay números ganadores");
       }  
      })
      .catch(error => {
        console.log(error);
      });

      arrayCollilla.push(colilla)
    }
    return arrayCollilla;
}

export function generatePrize(dateBet, idCol, prize, totalPrice){

    axios.post('http://'+ipservices+':8080/service-gana-app/loteries/createprize?dateBet='+dateBet+"&idCol="+idCol+"&prize="+prize+"&totalPrice="+totalPrice)
     .then(response => {
       console.log(response.data);
     })
     .catch(error => {
       console.log(error);
     });
}







    



 


