//afficher l'orderId

displayOrderId();

function displayOrderId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("orderId");

    const orderId = document.getElementById("orderId");
    orderId.textContent = id;
}

