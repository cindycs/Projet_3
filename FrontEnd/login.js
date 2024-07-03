/**
 * fonction pour récupérer les données du formulaire
 */
function recupForm() {
    const formulaireLogin = document.querySelector(".form-login");
    formulaireLogin.addEventListener("submit", function(event){
        event.preventDefault();
        //Récupération des informations du formulaire
        const identifiant = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        //Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(identifiant);
        console.log(chargeUtile);

        login(chargeUtile);
    });
}

recupForm();

/**
 * Fonction de login
 * @param {*} chargeUtile 
 */
async function login(chargeUtile) {
    try{
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: chargeUtile
        });
        
        if (response.ok) {
            const data = await response.json();
            // Stocker le token dans le localStorage
            localStorage.setItem('authToken', data.token);
            // Redirection vers la page index
            window.location.href = "index.html";
        } else {
            erreurAuthentification();
        }
    }
    catch(e){
        console.error('Erreur:', e);    
    }
}

/**
 * fonction qui affiche un message sur la page login pour indique les identifiants ne sont pas correct
 */
function erreurAuthentification() {
    const messageErreur =  document.getElementById("incorrect");
    messageErreur.innerText = "Email ou mot de passe incorrect";
}



