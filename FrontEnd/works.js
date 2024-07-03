//Récupération des travaux depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();


//Fonction pour afficher les différents travaux
function genererTravaux(works){
    
    works.forEach(work => {

        const workElement = document.createElement("figure");
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

//Affichage des travaux sur la page
genererTravaux(works);


//GESTION DES FILTRES

//On crée le premier filtre par défaut 
const filtre = document.getElementById("filtres");
const filtreDefaut = document.createElement('button');
filtreDefaut.className = "btn-filtre btn-defaut btn-active";
filtreDefaut.innerHTML = "Tous";
filtre.appendChild(filtreDefaut);

//On crée l'écouteur d'évenement pour afficher tous les travaux lors du click
const boutonDefaut = document.querySelector(".btn-defaut");
boutonDefaut.addEventListener("click", function () {
    clearGallery();
    genererTravaux(works);
    const boutons = document.querySelectorAll('.btn-filtre');
    boutons.forEach(btn => btn.classList.remove('btn-active'));
    filtreDefaut.classList.add('btn-active');
});

//Utilisation d'un set pour garder une trace des catégories déjà affichées. Il stocke des valeurs unique et évite les doublons
const shownCategories = new Set();

works.forEach(work => {
    const categoryName = work.category.name;
    const categoryId = work.category.id;
    
   //Si la catégorie n'a pas encore été affiché...
    if (!shownCategories.has(categoryName)) {
        //.. On l'ajoute au set
        shownCategories.add(categoryName);
        const filtreElement = document.createElement('button');
        filtreElement.classList.add('btn-filtre', 'btn-cat'+categoryId);
        filtreElement.innerText = categoryName;
        filtre.appendChild(filtreElement);

        let classfiltre = "btn-cat"+categoryId;

        let boutonFiltre = document.querySelector("."+classfiltre);
        boutonFiltre.addEventListener("click", function () {
            clearGallery();
            genererTravauxId(works, categoryId);
            activerBouton(boutonFiltre);
        });
    }
});   

//Fonction pour afficher les différents travaux par ID
function genererTravauxId(works, categoryId){
    clearGallery();

    works.forEach(work => {
        if (work.categoryId === categoryId){

            const workElement = document.createElement("figure");

            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            imageElement.alt = work.title;
            const figcaptionElement = document.createElement("figcaption");
            figcaptionElement.innerText = work.title;

            const gallery = document.querySelector(".gallery");

            gallery.appendChild(workElement);
            workElement.appendChild(imageElement);
            workElement.appendChild(figcaptionElement);
        }
    });
}

//Fonction pour afficher le filtre actif et désactiver les autres
function activerBouton(bouton){
    const boutons = document.querySelectorAll('.btn-filtre');
    boutons.forEach(btn => btn.classList.remove('btn-active'));
    bouton.classList.add('btn-active');
}

function clearGallery() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ''; 
}


