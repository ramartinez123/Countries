const bcrypt =require('bcryptjs');
const helpers ={};


helpers.encryptPassword = async (password) =>{   //cifrar
    const salt = await bcrypt.genSalt(10); //generar hash
    const hash = await bcrypt.hash(password,salt)
    return hash;
};

helpers.matchPassword = async (password, savePassword) => {  //comparar
    try{ 
        return await bcrypt.compare(password,savePassword);
    }catch(e) {
        console.log(e);
    }
        
};

module.exports =helpers;