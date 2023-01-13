let cart = [];



async function getItemFromStorage() {
  const numberOfItems = localStorage.length
  // console.log(localStorage)

  for (let i=0; i < numberOfItems; i++) {
  const item = JSON.parse(localStorage.getItem(localStorage.key(i)))
  const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
  const data = await response.json();
  data.quantity = item.quantity;
  cart.push(data)
  
}
cart.forEach(item => displayItem(item))
}
getItemFromStorage();



function displayItem(item) {
  const article = createArticle(item);

  console.log(item);
  const divImage = createImage(item);
  console.log(divImage);
  article.appendChild(divImage)
  
  const cartItemContent = createCartContent(item)
  article.appendChild(cartItemContent)
  displayArticle(article)
  displayTotalQuantity(item)
}

function displayTotalQuantity(item) {
  let total = 0
  const totalQuantity = document.querySelector("#totalQuantity")

  cart.forEach(item => {
      const totalUnitQuantity = item.quantity
      total = total + totalUnitQuantity
  })
  totalQuantity.textContent = total
}



function createCartContent (item) {
  const cartItemContent = document.createElement("div")
  cartItemContent.classList.add("cart__item__content")

  const description = createDescription(item) 
  const settings = createSettings(item)

  cartItemContent.appendChild(description)
  cartItemContent.appendChild(settings)
  return cartItemContent

}

function createSettings(item) {
  const settings = document.createElement("div")
  settings.classList.add("cart__item__content__settings")

  addQuantityToSettings(settings, item)
  addDeleteToSettings(settings)
  return settings
  
}

function addDeleteToSettings(settings) {
  const deleteItem = document.createElement("div")
  deleteItem.classList.add("cart__item__content__settings__delete")
  const p = document.createElement("p")
  p.classList.add("deleteItem")
  p.textContent = "Supprimer"

  deleteItem.appendChild(p)
  settings.appendChild(deleteItem)
}

function addQuantityToSettings(settings, item) {
  const quantity = document.createElement("div")
  quantity.classList.add("cart__item__content__settings__quantity")
  
  const p = document.createElement("p")
  p.textContent = "Qté : "
  quantity.appendChild(p)

  const input = document.createElement("input")
  input.classList.add("itemQuantity")
  input.type = "number"
  input.name = "itemQuantity"
  input.min = "1"
  input.max = "100"
  input.value = item.quantity

  quantity.appendChild(input)
  settings.appendChild(quantity)

}

function createDescription(item) {
  const description = document.createElement('div')
  description.classList.add("cart__item__content__description")

  const h2 = document.createElement('h2')
  h2.textContent = item.name

  const p = document.createElement ("p")
  p.textContent = item.color

  const p2 = document.createElement ("p")
  p2.textContent = item.price + " €"

  description.appendChild(h2)
  description.appendChild(p)
  description.appendChild(p2)
  return description
}


function displayArticle(article) {
  document.querySelector('#cart__items').appendChild(article)
}
function createImage(item) {
  const div = document.createElement('div')
  div.classList.add('cart__item__img')

  const image = document.createElement('img')
  image.setAttribute("src", item.imageUrl);
  image.setAttribute("alt", item.altTxt);
  console.log(image);
  div.appendChild(image)
  return div

}

function createArticle(item) {
  const article = document.createElement('article')
  article.classList.add('cart__item')
  article.dataset.id = item.id
  article.dataset.color = item.color
  return article

}


