//Récupération de la valeur de l'iD des produits

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get("id")


// requête Api pour récupérer les détails des produits à partir de l'ID 
fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => addProductDetails(res))

// ajouter tous les détails des produits
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

//ajouter produit au panier

const button = document.querySelector("#addToCart")
button.addEventListener("click", (event) => {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value

    if(orderInvalid(color, quantity)) return

    createOrder(color, quantity)

    window.location.href = "cart.html"
}) 


function orderInvalid(color, quantity) {
    if (color === "" || quantity == 0) {
        alert("Choisissez une couleur et une quantité")
        return true
    }
}

function createOrder(color, quantity) {
    const data = {
        id: id,
        color: color,
        quantity: Number(quantity)   
    }
    localStorage.setItem(id, JSON.stringify(data))
}
