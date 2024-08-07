const bcrypt =require('bcryptjs');
const helpers ={};


helpers.encryptPassword = async (password) =>{   // Cifra la contraseña
    const salt = await bcrypt.genSalt(10); // Genera un "salt" con 10 rondas
    const hash = await bcrypt.hash(password,salt) // Cifra la contraseña con el "salt"
    return hash;
};

helpers.matchPassword = async (password, savePassword) => {  // Compara la contraseña ingresada con la almacenada
    try{ 
        return await bcrypt.compare(password,savePassword);  // Compara la contraseña en texto plano con el hash almacenado
    }catch(e) {
        console.log(e);
    }
        
};

module.exports =helpers;