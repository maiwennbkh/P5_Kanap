let cart = [];



async function getItemFromStorage() {
  const numberOfItems = localStorage.length;

  for (let i=0; i < numberOfItems; i++) {
  const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
  const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
  const data = await response.json();
  data.quantity = item.quantity;
  data.color = item.color;
  data.id = data._id;
  delete data._id;
  delete data.colors;
  cart.push(data)
  
}
cart.forEach(item => displayItem(item));
}
getItemFromStorage();


function displayItem(item) {
  const article = createArticle(item);
  const divImage = createImage(item);
  article.appendChild(divImage);
  
  const cartItemContent = createCartContent(item);
  article.appendChild(cartItemContent);
  displayArticle(article);

  displayTotalQuantity(item);
  displayTotalPrice(item);
}



function displayTotalQuantity(item) {
  let total = 0;
  const totalQuantity = document.querySelector("#totalQuantity");

  cart.forEach(item => {
      const totalUnitQuantity = item.quantity;
      total = total + totalUnitQuantity;
  })
  totalQuantity.textContent = total;
}

function displayTotalPrice(item) {
  let total = 0;
  const totalPrice = document.querySelector("#totalPrice");

  cart.forEach(item => {
      const totalUnitPrice = item.price * item.quantity;
      total = total + totalUnitPrice;
  })
  totalPrice.textContent = total;
}



function createCartContent (item) {
  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");

  const description = createDescription(item);
  const settings = createSettings(item);

  cartItemContent.appendChild(description);
  cartItemContent.appendChild(settings);
  return cartItemContent;

}

function createSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  addQuantityToSettings(settings, item);
  addDeleteToSettings(settings, item);
  return settings;
  
}

function addDeleteToSettings(settings, item) {
  const deleteItem = document.createElement("div");
  deleteItem.classList.add("cart__item__content__settings__delete");
  deleteItem.addEventListener("click", () => deleteProduct(item));

  const p = document.createElement("p");
  p.classList.add("deleteItem");
  p.textContent = "Supprimer";
 
  deleteItem.appendChild(p);
  settings.appendChild(deleteItem);
}

function deleteProduct(item) {
  const productToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color);
  cart.splice(productToDelete, 1);
  displayTotalPrice();
  displayTotalQuantity();
  deleteProductData(item);
  deleteArticle(item);
}


function deleteArticle(item) {
  const articleToDelete = document.querySelector(
    `article[data-id='${item.id}'][data-color='${item.color}']`
  );
  articleToDelete.remove();
}

function addQuantityToSettings(settings, item) {
  const quantity = document.createElement("div");
  quantity.classList.add("cart__item__content__settings__quantity");
  
  const p = document.createElement("p");
  p.textContent = "Qté : ";
  quantity.appendChild(p);

  const input = document.createElement("input");
  input.classList.add("itemQuantity");
  input.type = "number";
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;
  input.addEventListener('change', () => updateItemsInCart(item.id, input.value, item));
  
  quantity.appendChild(input);
  settings.appendChild(quantity);
  
}

function updateItemsInCart(id, newValue,item) {
  const itemToUpdate = cart.find(item => item.id === id); 
  itemToUpdate.quantity = parseInt(newValue);
  displayTotalPrice();
  displayTotalQuantity();
  saveToLocalStorage(item);
}
function deleteProductData(item) {
  const key = `${item.id}`;
  localStorage.removeItem(key);

}

function saveToLocalStorage(item) {
  const data = JSON.stringify(item);
  localStorage.setItem(item.id, data);
}

function createDescription(item) {
  const description = document.createElement('div');
  description.classList.add("cart__item__content__description");

  const h2 = document.createElement('h2');
  h2.textContent = item.name;

  const p = document.createElement ("p");
  p.textContent = item.color;

  const p2 = document.createElement ("p");
  p2.textContent = item.price + " €";

  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}


function displayArticle(article) {
  document.querySelector('#cart__items').appendChild(article);
}
function createImage(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__img');

  const image = document.createElement('img');
  image.setAttribute("src", item.imageUrl);
  image.setAttribute("alt", item.altTxt);
  div.appendChild(image);
  return div;

}

function createArticle(item) {
  const article = document.createElement('article');
  article.classList.add('cart__item');
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}