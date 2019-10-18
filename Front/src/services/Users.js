import axios from 'axios';

export function login(nameUser, password, callback){

    let ipservices = localStorage.getItem('host');

    axios.post('http://'+ipservices+':8080/service-gana-app/users/login?nombreUsuario='+nameUser+'&clave='+password)
     .then(response => {
        if(response.data === ""){
           callback(200);
        }else{
            callback(400);
        }
      })
     .catch(error => {
       console.log(error);
     });
}