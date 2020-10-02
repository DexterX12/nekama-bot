const utils = require('../utils/utils.js');
const HelpDetailsJSON = require('../collections/helpDetailsCollection.json');

class HelpDetails {
    constructor(msg) {


    }






}

module.exports = HelpDetails;

/*
La idea que tengo es la siguiente
Usando este Js como plantilla, el cual será rellenado
con la información que hay en el JSON de acuerdo al comando

En este JS estará el embedBase

Título: Ayuda del comando <comando>
Descripción: info del JSON
Field1: ¿Como se usa?
DescField1: Info del JSON
Field2: Ejemplo de Uso:
DescField2: Info del JSON
Footer: <> = obligatorio | [] = opcional. | No incluir estos símbolos en el comando.

*/