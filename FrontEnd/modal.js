
function hasToken(){
    return localStorage.getItem('authToken') !== null;
}

if(hasToken()){

    
    // affichage de la modification
    affichageEdition();
    //Récupération des travaux depuis l'API
    const reponse = await fetch("http://localhost:5678/api/works");
    const works = await reponse.json();
    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCategories.json();
    
    let modal = null;
    
    //fonction qui permet l'ouverture de la modal
    const openModal = function (event){
        event.preventDefault()
        const target = document.querySelector(event.target.getAttribute('href'))
        target.style.display = 'flex';
        modal = target
        modal.addEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    }
    
    //fonction de fermeture de modal
    const closeModal = function (event){
        if(modal === null) return
        event.preventDefault()
        modal.style.display = "none";
        modal.removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
        modal = null;
    }
    
    const stopPropagation = function (event){
        event.stopPropagation()
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

    //Fonction pour l'affichage de l'index dans son mode edition 
    function affichageEdition(){
        const affichageEdit = document.querySelector('.edit');
        affichageEdit.style.display = 'block';
        const affichageEditTop = document.querySelector('.edit-top');
        affichageEditTop.style.display = 'block';
        const affichageLogout = document.querySelector('.logout');
        affichageLogout.innerHTML = "logout";
        affichageLogout.addEventListener('click', logout);
    }
    
    
    /**
     * Fonction pour afficher les différents travaux
     * @param {*} works 
     */
    function genererTravauxModal(works){

        genererModal();
        
        works.forEach(work => {
            // Création de la balise html figure
            const workElement = document.createElement("figure");
            workElement.className = "work";
    
            // Création des différents éléments du travail
            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
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
    
    genererTravauxModal(works);

    function genererModal(){
        
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
        
    }
    
    async function suppressionTravaux(id){
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
    
        if (response.ok){
            window.location.href = "index.html";
            console.log('Élément supprimé avec succès');
        }
        else{
            console.error('Erreur lors de la suppression :', response.statusText);
        }
    }
    
    //genere la deuxieme étape de la modal
    function genererTravauxModalStep2(){
    
        const previousNone = document.querySelector(".js-modal-previous");
        previousNone.style.display = 'block';
        const navModal = document.querySelector(".nav-modal");
        navModal.style.justifyContent = 'space-between';
        const btnAjout = document.querySelector('.btn-ajout');

        const btnModalAjout = document.querySelector('.btn-ajout');
        btnModalAjout.style.display = 'none';

        previousNone.addEventListener("click", () => {
            clearModal();
            genererTravauxModal(works);
        }); 
        
        clearModal();
        genererFormModal();
        afficherImage();
        gestionFormulaire();
    }
    
    //genere le formulaire de la modal
    function genererFormModal(){

        const templateForm = document.getElementById('modal-form');
        const modalContain = document.querySelector(".gallery-container");
        const templateContent = document.importNode(templateForm.content, true);
        modalContain.appendChild(templateContent);
    
        afficherCategorie(categories);
    }
    
    //Affiche les categories
    function afficherCategorie(categories) {
        const datalistElement = document.getElementById('categorie-list');
    
        categories.forEach(categorie => {
            const categorieElement = categorie.name;
            const optionElement = document.createElement("option");
            optionElement.value = categorieElement;
            datalistElement.appendChild(optionElement);
        });
    }
    
    function gestionFormulaire() {
        const formModal = document.querySelector('.form-modal');
       
        formModal.addEventListener("submit", function(event){

            event.preventDefault();

            //Création d'un objet formData pour récupérer les données du formulaire
            const formData = new FormData(formModal);
            //Recupération des données du form
            /*const fileInput = document.getElementById('image');
            const file = fileInput.files[0];
            console.log(file);*/
           
        /* formData.append('image', formData.get(file));
            formData.append('title', formData.get('title'));
            formData.append('category', formData.get('category'))*/
            validationForm();
            ajoutTravail(formData);
        });
        //document.addEventListener
    }
    
    function validationForm() {
        let isValid = true;
        const form = document.querySelector('.form-modal');
        const inputs = form.querySelectorAll('input[required]');
        const btnForm = document.querySelector('.btn-submit');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            }
            else {
                input.classList.remove('error');
            }
        });

        if (isValid) {
            btnForm.classList.remove('inactif');
            btnForm.classList.add('actif');
        } else {
            btnForm.classList.remove('actif');
            btnForm.classList.add('inactif');
        }
        
        return isValid;
    }

    async function ajoutTravail(chargeUtile){
        const token = localStorage.getItem('authToken');
        console.log(token);
        const response = await fetch(`http://localhost:5678/api/works/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: chargeUtile,
        });
    
        if (response.ok){
            console.log('Élément ajouté avec succès');
        }
        else{
            console.error('Erreur lors de l\'ajout :', response.statusText);
        }
    }

    //fonction affichage de l'image

    function afficherImage() {
        const inputFile = document.getElementById('image');
        //const previewImage = document.getElementById('preview');
        
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
   


    //efface le contenu de la modal
    function clearModal(){
        const clear = document.querySelector(".gallery-container");
        clear.innerHTML = "";
    }

    // Déconnexion et suppression du token
    function logout() {
        const token = localStorage.getItem('authToken');
        console.log(token);
        localStorage.removeItem('authToken');
        window.location.href = "login.html";
        console.log(token);
    }
}


