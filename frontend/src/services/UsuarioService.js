import BaseServices from "./BaseServices";

class UsuarioServices extends BaseServices{
    constructor(){
        super('/usuarios');
    }
}

export default UsuarioServices;