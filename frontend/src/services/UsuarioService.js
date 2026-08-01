import BaseServices from "./BaseServices";

class UsuarioServices extends BaseServices{
    constructor(){
        super('/usuario');
    }
}

export default UsuarioServices;