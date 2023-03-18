const cart = JSON.parse(localStorage.getItem('cart'));


//récupération des éléments du localStorage et ajout au panier
async function getItemFromStorage() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  //vider la section id cart__items pour éviter d'afficher le panier en doublon
  for (let item of cart) {
  console.log(item)
  
  const response = await fetch(`http://localhost:3000/api/products/${item.id}`);
  const data = await response.json();

  // const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
  // const response = await fetch(`http://localhost:3000/api/products/${item.id}`);

  // const data = await response.json();
  // data.quantity = item.quantity;
  // data.color = item.color;
  // data.id = data._id;
  // delete data._id;
  // delete data.colors;
  item['imageUrl'] = data.imageUrl;
  item['price'] = data.price;
  item['name'] = data.name;
  displayItem(item);
  
}
}
getItemFromStorage();



//pour chaque item du panier, créer les éléments pour afficher image, description, prix, quantité des articles
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


//calcul et affichage de la quantité totale d'articles dans le panier
function displayTotalQuantity(item) {
  let total = 0;
  const totalQuantity = document.querySelector("#totalQuantity");

  cart.forEach(item => {
      const totalUnitQuantity = item.quantity;
      total = total + totalUnitQuantity;
  })
  totalQuantity.textContent = total;
}

//calcul et affichage du prix total des articles dans le panier
function displayTotalPrice(item) {
  let total = 0;
  const totalPrice = document.querySelector("#totalPrice");

  cart.forEach(item => {
      const totalUnitPrice = item.price * item.quantity;
      total = total + totalUnitPrice;
  })
  totalPrice.textContent = total;
}


//creation d'un element qui contient la description et les paramètres de chaque article du panier
function createCartContent (item) {
  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");

  const description = createDescription(item);
  const settings = createSettings(item);

  cartItemContent.appendChild(description);
  cartItemContent.appendChild(settings);
  return cartItemContent;

}

//creation d'un element pour contenir les differents boutons (ajuster la quantité et supprimer)
function createSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  addQuantityToSettings(settings, item);
  addDeleteToSettings(settings, item);
  return settings;
  
}

//creation du bouton supprimer permettant de supprimer l'article au clic
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

//trouver l'article a supprimer dans le panier, supprimer les données du localstorage + mise a jour des totaux
function deleteProduct(item) {
  const productToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color);
  cart.splice(productToDelete, 1);
  displayTotalPrice();
  displayTotalQuantity();
  deleteProductData(item);
  deleteArticle(item);
}

//supprimer l'élément html correspondant à l'article supprimé du panier
function deleteArticle(item) {
  const articleToDelete = document.querySelector(
    `article[data-id='${item.id}'][data-color='${item.color}']`
  );
  articleToDelete.remove();
}

//creation du champ de saisie pour ajuster la quantité d'articles dans le panier 
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

//trouver l'article à mettre a jour dans le panier + mise a jour des totaux + sauvegarde des données dans le localStorage
function updateItemsInCart(id, newValue,item) {
  const itemToUpdate = cart.find(item => item.id === id); 
  itemToUpdate.quantity = parseInt(newValue);
  displayTotalPrice();
  displayTotalQuantity();
  saveToLocalStorage(item);
}

//supprimer données du localStorage
function deleteProductData(item) {
  const key = `${item.id}`;
  //cart.splice("supprimer l'item fourni")
  // const cart = JSON.stringify(cart);
  localStorage.setItem('cart', cart);

}

//sauvegarder données dans le localStorage
function saveToLocalStorage(item) {
  for(let index in cart) {
    if (cart[index]['id'] == item.id && color) {
      cart[index]['quantity'] = item.quantity;
    }
  }
  const cart = JSON.stringify(cart);
  localStorage.setItem('cart', cart);
}

//creation element html pour la description des produits
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

//creation element html image
function createImage(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__img');

  const image = document.createElement('img');
  image.setAttribute("src", item.imageUrl);
  image.setAttribute("alt", item.altTxt);
  div.appendChild(image);
  return div;

}

//creation element html article
function createArticle(item) {
  const article = document.createElement('article');
  article.classList.add('cart__item');
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}


const form = document.querySelector(".cart__order__form");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;

  console.log(firstName, lastName, email);

  const contact = {
    firstName: firstName,
    lastName: lastName,
    address: address,
    city: city,
    email: email
  };
  console.log(contact);
});
