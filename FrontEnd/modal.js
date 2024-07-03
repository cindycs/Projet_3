
function hasToken(){
    return localStorage.getItem('authToken') !== null;
}

if(hasToken()){
   

    affichageEdition();

    let reponse = await fetch("http://localhost:5678/api/works");
    let works = await reponse.json();

    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCategories.json();
    
    let modal = null;
    
    /**
     * fonction qui permet l'ouverture de la modal
     */
    const openModal = function (event) {
        event.preventDefault()
        const target = document.querySelector(event.target.getAttribute('href'))
        target.style.display = 'flex';
        modal = target
        modal.addEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
        genererModal();
    }
    
    /**
     * fonction qui permet la fermture de la modal
     * @param {} event 
     * @returns 
     */
    const closeModal = function (event) {
        if(modal === null) return
        event.preventDefault()
        modal.style.display = "none";
        modal.removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
        modal = null;
        clearModal();
    }
    
    const stopPropagation = function (event) {
        event.stopPropagation();
    }
    
    //pour chaque clique du bouton .js-modal l'écouteur execute la fonction openModal
    document.querySelectorAll('.js-modal').forEach(modal => {
        modal.addEventListener('click', openModal)
        
    })
    
    //permet la fermeture de la modal via la touche Echap
    window.addEventListener('keydown', function(event){
        if (event.key === "Escape" || event.key === "Esc"){
            closeModal(event)
        }
    })

    /**
     * Fonction pour afficher le site dans son mode "edition"
     */
    function affichageEdition() {
        const affichageEdit = document.querySelector('.edit');
        affichageEdit.style.display = 'block';
        const affichageEditTop = document.querySelector('.edit-top');
        affichageEditTop.style.display = 'block';
        const affichageLogout = document.querySelector('.logout');
        affichageLogout.innerHTML = "logout";
        affichageLogout.addEventListener('click', logout);
    }

    /**
     * Fonction pour générer la première fenêtre de modal
     */
    function genererModal() {
        
        const previousNone = document.querySelector(".js-modal-previous");
        previousNone.style.display = 'none';
        const navModal = document.querySelector(".nav-modal");
        navModal.style.justifyContent = 'flex-end';
        const modal = document.querySelector(".gallery-container");
        const titleModal = document.createElement("h3");
        titleModal.innerText = "Galerie photo";
        const galleryEdit = document.createElement("div");
        galleryEdit.className = "gallery-edit";
        const hrModal = document.createElement("hr");
        const btnModal = document.createElement("button");
        btnModal.classList.add('btn', 'btn-ajout');
        btnModal.innerText = "Ajouter une photo";

        modal.appendChild(titleModal);
        modal.appendChild(galleryEdit);
        modal.appendChild(hrModal);
        modal.appendChild(btnModal);

        genererTravauxModal(works);
        
    }
    
    /**
     * Fonction pour afficher les différents travaux
     * @param {*} works 
     */
    async function genererTravauxModal(works) {

        reponse = await fetch("http://localhost:5678/api/works");
        works = await reponse.json();
        
        works.forEach(work => {
            // Création de la balise html figure
            const workElement = document.createElement("figure");
            workElement.className = "work";
    
            // Création des différents éléments du travail
            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            imageElement.alt = work.title;
            const closeElement = document.createElement("button");
            closeElement.className = 'button-trash'; 
            const iconeElement = document.createElement("i");
            iconeElement.classList.add('fa-solid', 'fa-trash-can');
            const gallery = document.querySelector(".gallery-edit");

            gallery.appendChild(workElement);
            workElement.appendChild(imageElement);
            workElement.appendChild(closeElement);
            closeElement.appendChild(iconeElement);
    
            const idWork = work.id;
            
            //creation d'un écouteur pour supprimer le projet
            closeElement.addEventListener("click", () => {
                suppressionTravaux(idWork);
            });
        });
    
        const nextElement = document.querySelector(".btn-ajout");
        nextElement.addEventListener("click", genererTravauxModalStep2);
    }

    /**
     * Fonction pour supprimer les travaux un par un, selon l'id
     * @param {} id 
     */
    async function suppressionTravaux(id) {
        try{
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
        
            if (response.ok){
                console.log('Élément supprimé avec succès');
                clearModal();
                genererModal();
                genererTravaux(works);
            }
            else{
                console.error('Erreur lors de la suppression :', response.statusText);
            }
        }
        catch(e){
            console.error('Erreur:', e);    
        }
    }
    
    /**
     * Génere la deuxième fenetre de la modal
     */
    function genererTravauxModalStep2() {
    
        previousNone.style.display = 'block';
        const navModal = document.querySelector(".nav-modal");
        navModal.style.justifyContent = 'space-between';
        const btnModalAjout = document.querySelector('.btn-ajout');
        btnModalAjout.style.display = 'none';

        clearModal();
        genererFormModal();
        afficherImage();
        gestionFormulaire();
    }

    //Gère la fonction précédent de la modal présente dans la 2e fenêtre de la modal
    const previousNone = document.querySelector(".js-modal-previous");
    previousNone.addEventListener("click", () => {
        clearModal();
        genererModal();
    }); 
    
    /**
     * Génere le formulaire le modal
     */
    function genererFormModal() {

        const templateForm = document.getElementById('modal-form');
        const modalContain = document.querySelector(".gallery-container");
        const templateContent = document.importNode(templateForm.content, true);
        modalContain.appendChild(templateContent);
    
        afficherCategorie(categories);

        const btnForm = document.querySelector('.btn-submit');
        btnForm.disabled  = true;
    }
    
    /**
     * Fonction qui affiche les différentes catégories des travaux
     * @param {*} categories 
     */
    function afficherCategorie(categories) {
        const datalistElement = document.getElementById('categorie-list');
    
        categories.forEach(categorie => {
            const categorieElement = categorie.name;
            const categorieId = categorie.id;
            const optionElement = document.createElement("option");
            optionElement.value = categorieId;
            optionElement.innerText = categorieElement;
            datalistElement.appendChild(optionElement);
        });
    }

    /**
     *  Fonction qui traite les données du formulaire
     */
    function gestionFormulaire() {
        const formModal = document.querySelector('.form-modal');

        boutonValidation();
       
        formModal.addEventListener("submit", function(event){

            event.preventDefault();
            //Création d'un objet formData pour récupérer les données du formulaire
            const formData = new FormData(formModal);
            
            if(validerTailleImage()) {
                ajoutTravail(formData);
            }
        });
    }
   
    /**
     * Fonction pour activer ou désactiver le bouton valider selon le remplissage des champs du formulaire
     */
    function boutonValidation() {
        const inputImage = document.getElementById('image');
        const inputTitre = document.getElementById('title');
        const inputCategorie = document.getElementById('categorie-list');
        const btnForm = document.querySelector('.btn-submit');
        let imageValid, categorieValid, titreValid = false;

        inputTitre.addEventListener('input', function() {
            titreValid  = inputTitre.value !== '';
            btnForm.disabled = !(imageValid && categorieValid && titreValid);
        });

        inputImage.addEventListener('change', function() {
            imageValid  = inputImage.value != null;
            btnForm.disabled = !(imageValid && categorieValid && titreValid);
        });

        inputCategorie.addEventListener('change', function() {
            categorieValid  = inputCategorie.value !== '';
            btnForm.disabled = !(imageValid && categorieValid && titreValid);
        });
    }

    /**
     * Fonction qui ajoute un travail
     * @param {*} chargeUtile 
     */
    async function ajoutTravail(chargeUtile) {
        const token = localStorage.getItem('authToken');
        console.log(token);
        try {
            const response = await fetch(`http://localhost:5678/api/works/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: chargeUtile,
            });
        
            if (response.ok){
                console.log('Élément ajouté avec succès');
                clearModal();
                genererFormModal();
            }
            else{
                console.error('Erreur lors de l\'ajout :', response.statusText);
            }
        }
        
        catch(e){
            console.error('Erreur:', e);
        }
    }

    /**
     * Fonction qui vérifie que la taille de l'image ne dépasse pas les 4Mo
     */
    function validerTailleImage() {
        const input = document.getElementById('image');
        const file = input.files[0];
        const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
        let tailleVerif = true;
    
        if (file.size > maxSize) {
            alert('La taille du fichier ne doit pas dépasser 4 Mo.');
            clearModal();
            genererFormModal();
            tailleVerif = false;
        }
        return tailleVerif;
    }

    /**
     * Fonction qui affiche l'image upload dans la modal
     */
    function afficherImage() {
        const inputFile = document.getElementById('image');
        
        inputFile.addEventListener('change', function(event) {
            const file = event.target.files[0];    
            if (file) {
                const clear = document.querySelector(".hidden");
                clear.style.display = "none";
                const reader = new FileReader();
    
                reader.onload = function(event) {
                    const previewImage= document.createElement('img');
                    previewImage.src = event.target.result;
                    previewImage.style.display = 'block';
                    previewImage.style.maxWidth = '100%'; 
                    previewImage.style.maxHeight = '100%';      
                    const image = document.querySelector('.form-image');
                    image.appendChild(previewImage);
                }
    
                reader.readAsDataURL(file);
            } else {
                previewImage.src = '#';
                previewImage.style.display = 'none';
            }
        });
    }


    /**
     * Fonction qui efface le contenu de la modal
     */
    function clearModal() {
        const clear = document.querySelector(".gallery-container");
        clear.innerHTML = "";
    }

    /**
     * Fonction qui permet de se déconnecter 
     */
    function logout() {
        const token = localStorage.getItem('authToken');
        localStorage.removeItem('authToken');
        window.location.href = "login.html";
    }
}

/**
 * Fonction qui permet d'afficher les travaux sur la page du site
 * @param {*} works 
 */
async function genererTravaux(works) {

    reponse = await fetch("http://localhost:5678/api/works");
    works = await reponse.json();
        
    works.forEach(work => {
        const workElement = document.createElement("figure");

        //Création des différents éléments du travail
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = work.title;
        const gallery = document.querySelector(".gallery");
    
        gallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(figcaptionElement);
    });
}


