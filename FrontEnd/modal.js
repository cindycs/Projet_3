
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
        target.style.display = null;
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
    
        const previousNone = document.querySelector(".js-modal-previous");
        previousNone.style.display = 'none';
        const navModal = document.querySelector(".nav-modal");
        navModal.style.justifyContent = 'flex-end';
        const modal = document.querySelector(".gallery-container");
        const titleModal = document.createElement("h3");
        titleModal.innerText = "Galerie photo";
        const galleryEdit = document.createElement("div");
        galleryEdit.className = "gallery-edit";
    
        modal.appendChild(titleModal);
        modal.appendChild(galleryEdit);
        
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
    
            //recuperation de l'id
            const idWork = work.id;
            
            //creation d'un écouteur pour supprimer le projet
            closeElement.addEventListener("click", () => {
                suppressionTravaux(idWork);
            });
        });
    
        const nextElement = document.querySelector(".btn-modal");
        nextElement.innerHTML = "Ajouter une photo";
        nextElement.addEventListener("click", genererTravauxModalStep2);
    }
    
    genererTravauxModal(works);
    
    async function suppressionTravaux(id){
        const token = localStorage.getItem('authToken');
        console.log(token);
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
        //previousNone.addEventListener("click", previousModal);
        previousNone.addEventListener("click", () => {
            clearModal();
            genererTravauxModal(works);
        }); 
        
        clearModal();
        genererFormModal();
    
        const nextElement = document.querySelector(".btn-modal");
        nextElement.innerHTML = "Valider";
    
        nextElement.addEventListener("click", genererTravauxModalStep2);
    }
    
    //genere le formulaire de la modal
    function genererFormModal(){
    
        const formModal = `
                    <h3>Ajout photo</h3>
                    <div class="form-image">
                        <i class="fa-regular fa-image"></i>
                        <label class="label-file" for="myFile">
                            + Ajouter photo
                            <input type="file" id="myFile" class="inputfile" name="filename" required >
                        </label>
                        <p>jpg, png : 4mo max</p>
                    </div>
                    <form action="" class="form-modal">
                        <label>Titre</label>
                        <input type="text" required />
                        <label for="categorie">Categorie</label>
                        <input list="categorie-list" id="categorie" required  />
                        <datalist id="categorie-list">               
                        </datalist>
                    </form>`;
        
        document.querySelector(".gallery-container").innerHTML = formModal;
    
        afficherCategorie(categories);
    }
    
    //Affiche les categories
    function afficherCategorie(categories){
        const datalistElement = document.getElementById('categorie-list')
    
        categories.forEach(categorie => {
            const categorieElement = categorie.name;
            const optionElement = document.createElement("option");
            optionElement.value = categorieElement;
            datalistElement.appendChild(optionElement);
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


