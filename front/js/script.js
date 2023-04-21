//requêter l'Api pour récupérer la liste des produits

fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => addProducts(data))

//Inserer les produits dans la page d'accueil
function addProducts(data) { 

    for (let i = 0; i < data.length; i++) {

        const _id = data[i]._id
        const imageUrl = data[i].imageUrl
        const altTxt = data[i].altTxt
        const name = data[i].name
        const description = data[i].description


        const image = createImage(imageUrl, altTxt)
        const anchor = createAnchor(_id)
        const article = document.createElement('article')
        const h3 = createH3(name)
        const p = createParagraph(description)
            
        appendChildToArticle (article, image, h3,p)
        appendArticleToAnchor(anchor, article)
    }  
}

//créer les differents elements html (lien, article,image,titre,description)

function createAnchor(id) {
    const anchor = document.createElement('a')
    anchor.href = "./product.html?id=" + id
    return anchor
}


function createImage(imageUrl, altTxt) {
    const image = document.createElement('img')
    image.src = imageUrl
    image.alt = altTxt
    return image
}

function createH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    h3.classList.add("productName")
    return h3

}

function createParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p

}

function appendArticleToAnchor(anchor, article) {
    const items = document.querySelector("#items")
    items.appendChild(anchor)
    anchor.appendChild(article)
} 

function appendChildToArticle (article, image, h3,p) {
    article.appendChild(image)
    article.appendChild(h3)
    article.appendChild(p)
}
