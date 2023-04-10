//afficher l'orderId
// vider le localStorage

displayOrderId();
clearLocalStorage();


function displayOrderId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("orderId");

    console.log(id);

    const orderId = document.getElementById("orderId");
    orderId.textContent = id;
}


function clearLocalStorage() {

    const localStorage = window.localStorage;
    localStorage.clear();

}