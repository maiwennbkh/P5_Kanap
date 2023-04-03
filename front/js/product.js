//Récupération de l'iD des produits à partir de l'url

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")


// requête Api pour récupérer les détails des produits à partir de l'ID 
fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => addProductDetails(res))

// ajouter tous les détails des produits, créer les differents elements html
function addProductDetails(kanap) {
    const altTxt = kanap.altTxt
    const imageUrl = kanap.imageUrl
    const name = kanap.name
    const price = kanap.price
    const description = kanap.description
    const colors = kanap.colors
    

    createImage(imageUrl, altTxt)
    createColors(colors)
    createTitle(name)
    createPrice(price)
    createDescription(description)
}

function createImage(imageUrl, altTxt) {
    const image = document.createElement('img')
    image.src = imageUrl
    image.alt = altTxt
    document.querySelector(`.item__img`)
    document.querySelector(`.item__img`).appendChild(image)

}
        
function createColors(colors) {

    for (let i = 0; i < colors.length; i++) {
    const option = document.createElement('option')
    option.value = colors[i]
    option.textContent = colors[i]
    
    document.querySelector('#colors')
    document.querySelector('#colors').appendChild(option)
}
}

function createTitle(name) {
    const h1 = document.querySelector('h1')
    h1.textContent = name
}

function createPrice(price) {
    const span = document.querySelector('#price')
    span.textContent = price
}

function createDescription(description) {
    const p = document.querySelector('#description')
    p.textContent = description
}

//écoute du bouton "Ajouter au panier" + récupèration de la couleur et de la quantité 
//vérification des choix de couleur et quantité, si ils sont valides créer la  commande et ajouter le produit au localStorage
//si l'un des choix est invalide, afficher une alerte et empêcher la commande 

const button = document.querySelector("#addToCart")
button.addEventListener("click", (event) => {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value

    if(orderInvalid(color, quantity)) return

    createOrder(color, quantity);

  //  window.location.href = "cart.html"
}) 


function orderInvalid(color, quantity) {
    if (color === "" || quantity == 0) {
        alert("Choisissez une couleur et une quantité")
        return true
    }
}

function createOrder(color, quantity) {
    let cart = [];
    if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // lire le localStorage pour récupérer le panier en cours
    //Si le panier n'exite pas (il est null) on initialise la variable cart avec un tableau vide
    if (cart == null) {
        cart = [];
    }
    // on crée une variable drapeau pour surveiller si on aura une mise à jour de quantité (donc si l'article ajouté existe déjà dans sa couleur)
    let flag = 0;
        //parcours le panier : pour chaque élément du panier :
        //tester si l'id et la couleur correspondent à l'article qu'on veut ajouter
        //si c'est le cas :
        //tester si on ne dépassera pas 100 quantités
        //mettre à jour la quantité de l'article dans le panier
        //passer le flag à 1 parce qu'on a trouvé et modifié l'article
    for (let i in cart) {
        if(cart[i]['id'] == id && cart[i]['color'] == color) {
            if (parseInt(quantity) + parseInt(cart[i]['quantity']) > 100) {
                alert("La quantité maximale est de 100.");
                return;
            }
            else {
                cart[i]['quantity'] = parseInt(quantity) + parseInt(cart[i]['quantity']);
            }
            console.log(cart[i]);
            flag = 1;
        }
    }
    //si on n'a pas trouvé l'article dans le panier (le flag est donc resté à 0)
    // on crée un article
    // on le pousse à la fin du tableau
    if (flag == 0) { 
        let data = {
            'id' : id,
            'color': color,
            'quantity': parseInt(quantity)
        }
        cart.push(data)
    } //on stocke tout le panier avec une seule clé 'cart'
    localStorage.setItem('cart', JSON.stringify(cart))
}
