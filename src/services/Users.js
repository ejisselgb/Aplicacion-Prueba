import axios from 'axios';

export function login(nameUser, password, callback){

    let ipservices = localStorage.getItem('host');

    axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

    var param = {
        nombreUsuario: nameUser,
        clave: password
    }

    axios.post("http://"+ipservices+":8080/service-gana-app/users/login?nombreUsuario="+param.nombreUsuario+"&clave="+param.clave, { headers: {"Access-Control-Allow-Origin": "*"} })
    .then(response => {
        console.log();
        callback(response);
    })
    .catch(error => {
        console.log(error);
    });
}