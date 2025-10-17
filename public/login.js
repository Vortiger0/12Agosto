//el ingresar es un evento onclick que está en el boton de enviar el formulario
//de login.hbs
//se obtiene el valor de los inputs y se crea un objeto persona
//luego se hace un fetch a /login enviando el objeto persona como JSON
//el servidor recibe el JSON y lo muestra en consola
const ingresar = async() => {
    const correo = document.getElementById('form2Example18').value;
    const contra = document.getElementById('form2Example28').value;

    let persona = { correo, contra };

    await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(persona)
    })
} 