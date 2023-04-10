let cart = JSON.parse(localStorage.getItem('cart'));

//récupération des éléments du localStorage et ajout au panier
async function getItemFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));
  let totalQuantity = 0;
  let totalPrice = 0;
  //vider la section id cart__items pour éviter d'afficher le panier en doublon
  document.querySelector('#cart__items').innerHTML = '';

  for (let item of cart) {
  // console.log(item)
  
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
  
  totalQuantity = totalQuantity + item.quantity;
  totalPrice = totalPrice + (item.quantity * item.price);
}
displayTotalQuantity(totalQuantity);
displayTotalPrice(totalPrice);

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
}

//calcul et affichage de la quantité totale d'articles dans le panier
function displayTotalQuantity(item) {  
  const totalQuantity = document.querySelector("#totalQuantity");
  totalQuantity.textContent = item;
}

//calcul et affichage du prix total des articles dans le panier
function displayTotalPrice(item) {
  
  const totalPrice = document.querySelector("#totalPrice");
  // console.log(item)

  
  totalPrice.textContent = item;
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
  
  input.addEventListener('change', () => updateItemsInCart(item, input.value));

  quantity.appendChild(input);
  settings.appendChild(quantity);
  
}

//trouver l'article à mettre a jour dans le panier + mise a jour des totaux + sauvegarde des données dans le localStorage
function updateItemsInCart(item, itemNewQuantity) {
  //  const itemToUpdate = cart.find(item => item.id === id); 
  //  itemToUpdate.quantity = parseInt(newValue);
  console.log(itemNewQuantity);

  if(checkQuantity(item,itemNewQuantity)) return
  
  for(let index in cart) {
    if (cart[index]['id'] == item.id && cart[index]['color'] == item.color) {
      cart[index]['quantity'] = parseInt(itemNewQuantity);
    }
  }

  saveToLocalStorage(cart);
}

function checkQuantity(item,itemNewQuantity) {
  if (itemNewQuantity > 100) {
    alert("Ne pas dépasser la quantité maximale de 100 unités")
    return true
  }
}

//supprimer données du localStorage
function deleteProductData(item) {
  const key = `${item.id}`;
  localStorage.removeItem(key)
  let updatedCart = JSON.stringify(cart);
  localStorage.setItem('cart', updatedCart);
  getItemFromStorage();

}

//sauvegarder données dans le localStorage
function saveToLocalStorage(cart) {
  cart = JSON.stringify(cart);
  localStorage.setItem('cart', cart);
  getItemFromStorage();
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


const orderFormButton = document.querySelector("#order");

function checkCart() {
  if (cart.length === 0) { 
    alert("Le panier est vide, ajouter des produits au panier")
    return false;
   }
   return true;
}


orderFormButton.addEventListener("click", function(event) {
  event.preventDefault();

  
  const form = document.querySelector(".cart__order__form");

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;

  const formData = { 
    contact : {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email
    },
    products : getProductsId()
  };

  //si le panier est plein et si le formulaire est bien rempli
  //alors j'envoie la requête au serveur

  if(checkForm()) return;

  if (checkCart() && checkEmail(email) && checkFirstName(firstName) && checkLastName(lastName) && checkCity(city) && checkAddress(address)) {
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"}
    })
    .then(response => response.json())
    .then((data) => {
      const orderId = data.orderId
      console.log(orderId)
      clearLocalStorage();
      window.location.href = "/front/html/confirmation.html" + "?orderId=" + orderId
    })
        //rediriger sur la page de confirmation avec l'orderId dans l'URL

  }

});

function clearLocalStorage() {

  const localStorage = window.localStorage;
  localStorage.clear();

}

function checkForm() {
  const form = document.querySelector(".cart__order__form");
  const inputs = form.querySelectorAll("input");

  inputs.forEach((input) => {
    if (input.value === "") {
      alert("Veuillez renseigner tous les champs")
      return true
    }
    return false
  });
  
}

function checkEmail(email) { 
  let regex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;

  if(regex.test(email) === false) {
    document.querySelector("#emailErrorMsg").textContent = "Renseigner une adresse email valide"
    return false;
  }
  return true;
}

function checkCity(city) {
  let regex = /^[A-Za-z\-]+$/;

  if(regex.test(city) === false) {
    document.querySelector("#cityErrorMsg").textContent = "Renseigner une ville valide"
    return false;
  }
  return true;
}

function checkAddress(address) {
  let regex = /^(\d{1,5})?(\s*[\w-àéèêôûùïñ]+)+$/;

  if(regex.test(address) === false) {
    document.querySelector("#addressErrorMsg").textContent = "Renseigner une adresse valide"
    return false;
  }
  return true;
}

// const listAddressesToTest = [
//   '7 rue victor hugo',
//   'rue victor hugo',
//   '123456 avenud du foiñ'
// ]
// function testCheckAddress(listAddressesToTest) {
//   for (let address of listAddressesToTest) {
//     if (checkAddress(address)) {
//       console.log('test de ladresse' + address + ' ok !')
//     }
//     else {
//       console.log('test de ladresse' + address + ' failed !!!')
//       exit(1)
//     }
//   }
// }

function checkLastName(lastName) {
  let regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ-]+$/;

  if(regex.test(lastName) === false) {
    document.querySelector("#lastNameErrorMsg").textContent = "Renseigner un nom valide"
    return false;
  }
  return true;
}

function checkFirstName(firstName) {
  let regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ-]+$/;

  if(regex.test(firstName) === false) {
    document.querySelector("#firstNameErrorMsg").textContent = "Renseigner un prénom valide"
    return false;
  }
  return true;

}



function getProductsId() {

  let productsInCart = cart.length;

  const ids = [];
  for(let i = 0; i < productsInCart; i++) {
    const key = cart[i]['id'];
    ids.push(key)
  }
  return ids; 
}