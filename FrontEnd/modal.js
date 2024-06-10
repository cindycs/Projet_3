//Récupération des travaux depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

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

//Fonction pour afficher les différents travaux
function genererTravauxModal(works){

    const modal = document.querySelector(".gallery-container");
    const titleModal = document.createElement("h3");
    titleModal.innerText = "Galerie photo";
    const galleryEdit = document.createElement("div");
    galleryEdit.className = "gallery-edit";

    modal.appendChild(titleModal);
    modal.appendChild(galleryEdit);
    
    works.forEach(work => {
        //Initialisation de la variable figure qui prend en compte les travaux
        //Création de la balise html figure
        const workElement = document.createElement("figure");
        workElement.className = "work";

        //Création des différents éléments du travail
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;

        const closeElement = document.createElement("button");
        closeElement.className = 'button-trash';

        const iconeElement = document.createElement("i");
        iconeElement.classList.add('fa-solid', 'fa-trash-can');

        //Rattachement des éléments a son parent
        const gallery = document.querySelector(".gallery-edit");
        //On rattache la balise work à son parent
        gallery.appendChild(workElement);
        //Rattachement des éléments travaux à son parent
        workElement.appendChild(imageElement);
        workElement.appendChild(closeElement);
        closeElement.appendChild(iconeElement);

    });

    const separateur = document.createElement("hr");
    const nextElement = document.createElement("button");
    nextElement.className = "btn-modal";
    nextElement.innerHTML = "Ajouter une photo";

    modal.appendChild(separateur);
    modal.appendChild(nextElement);

    //nextElement.addEventListener("click", genererTravauxModalStep2);
}

