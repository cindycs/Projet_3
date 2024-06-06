
function login(){
    const formulaireLogin = document.querySelector(".form-login");
    formulaireLogin.addEventListener("submit", function(event){
        //On arrête le comportement par défaut de submit
        event.preventDefault();
        //Récupération des informations du formulaire
        const identifiant = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };
        //Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(identifiant);
        console.log(chargeUtile);

        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        })
        //response est l'objet renvoyé par la requête fetch qui contient les détails de la réponse
        .then(response => {
            //response.ok renvoi true si le statut HTTP est dans la plage 200-299
            if (!response.ok) {
                //si la réponse n'est pas ok nous lancçons une erreur, ce qui rejette la promesse et passe au bloc 'catch'
                throw new Error('Network response was not ok');
            }
            //si la réponse est ok, retourne une nouvelle promesse. Cette methode convertit le corps de la réponse en un objet JS qui est data
            return response.json();
        })
        .then(data => {  
            console.log('Success:', data.token);
            //Stockage du token d'authentification
            const token = data.token;
            localStorage.setItem('authToken',token);

            // Redirection vers la page index
            window.location.href = "index.html";
            alert('Connexion réussie !');
        })
        .catch((error) => {
            console.error('Error:', error);
            erreurAuthentification();        
        });
    });
}

login();

//Affichage d'un message sur la page login pour indiquer que les identifiants ne sont pas correct
function erreurAuthentification() {
    const messageErreur=  document.getElementById("incorrect");
    messageErreur.innerText = "Email ou mot de passe incorrect";
    
}