//Récupération des travaux depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();


//Fonction pour afficher les différents travaux
function genererTravaux(works){
    
    for (let i = 0; i < works.length; i++){
        //Initialisation de la variable figure qui prend en compte les travaux
        const figure = works[i];
        //Création de la balise html figure
        const workElement = document.createElement("figure");

        //Création des différents éléments du travail
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.alt = figure.title;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = figure.title;

        //Rattachement des éléments a son parent
        const gallery = document.querySelector(".gallery");
        //On rattache la balise figure à son parent
        gallery.appendChild(workElement);
        //Rattachement des éléments travaux à son parent
        workElement.appendChild(imageElement);
        workElement.appendChild(figcaptionElement);
    }
}

//Affichage des travaux sur la page
genererTravaux(works);


//GESTION DES FILTRES

//On crée le premier filtre par défaut 
const filtre = document.getElementById("filtres");
const filtreDefaut = document.createElement('button');
filtreDefaut.className = "btn-filtre btn-defaut";
filtreDefaut.innerHTML = "Tous";
filtre.appendChild(filtreDefaut);

//On crée l'écouteur d'évenement pour afficher tous les travaux lors du click
const boutonDefaut = document.querySelector(".btn-defaut");
boutonDefaut.addEventListener("click", function () {
    clearGallery();
    genererTravaux(works);
});

const shownCategories = new Set();

works.forEach(work => {
    const categoryName = work.category.name;
    const categoryId = work.category.id;
    
    if (!shownCategories.has(categoryName)) {
        shownCategories.add(categoryName);
        const filtreElement = document.createElement('button');
        filtreElement.className = categoryId;
        filtreElement.className = "btn-filtre btn-cat"+categoryId;
        filtreElement.innerText = categoryName;
        filtre.appendChild(filtreElement);

        let classfiltre = "btn-cat"+categoryId;

            //On crée l'écouteur d'évenement pour afficher tous les travaux lors du click
        let boutonFiltre = document.querySelector("."+classfiltre);
        boutonFiltre.addEventListener("click", function () {
            clearGallery()
            
            works.forEach(work => {
                console.log(categoryId);
                if (work.categoryId === categoryId){

                    //Initialisation de la variable figure qui prend en compte les travaux
                    //Création de la balise html figure
                    const workElement = document.createElement("figure");
        
                    //Création des différents éléments du travail
                    const imageElement = document.createElement("img");
                    imageElement.src = work.imageUrl;
                    imageElement.alt = work.title;
                    const figcaptionElement = document.createElement("figcaption");
                    figcaptionElement.innerText = work.title;
        
                    //Rattachement des éléments a son parent
                    const gallery = document.querySelector(".gallery");
                    //On rattache la balise figure à son parent
                    gallery.appendChild(workElement);
                    //Rattachement des éléments travaux à son parent
                    workElement.appendChild(imageElement);
                    workElement.appendChild(figcaptionElement);
                }
            });
        });
    }
    });   

//Fonction pour afficher les différents travaux par ID
function genererTravauxId(works){
    clearGallery();

    works.forEach(work => {
        if (work.categoryId === 1){
            console.log("categorie1");
            //Initialisation de la variable figure qui prend en compte les travaux
            //Création de la balise html figure
            const workElement = document.createElement("figure");

            //Création des différents éléments du travail
            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            imageElement.alt = work.title;
            const figcaptionElement = document.createElement("figcaption");
            figcaptionElement.innerText = work.title;

            //Rattachement des éléments a son parent
            const gallery = document.querySelector(".gallery");
            //On rattache la balise figure à son parent
            gallery.appendChild(workElement);
            //Rattachement des éléments travaux à son parent
            workElement.appendChild(imageElement);
            workElement.appendChild(figcaptionElement);
        }
    });
}

function clearGallery() {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ''; // Vider le contenu de la galerie
}


