let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            quantity: 1,
        });
    }

    updateCartCount();
    saveCart();
    alert(`${productName} added to cart!`);
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

function loadCart() {
    const cartItemsElement = document.getElementById("cart-items");
    const cartSummaryElement = document.getElementById("cart-summary");

    if (cart.length === 0) {
        cartItemsElement.innerHTML = "<p>Your cart is empty. Start adding items!</p>";
        cartSummaryElement.style.display = "none";
        return;
    }

    cartItemsElement.innerHTML = "";
    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        itemDiv.innerHTML = `
            <p><strong>${item.name}</strong> - $${item.price.toFixed(2)}</p>
            <p>Quantity: 
                <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                ${item.quantity}
                <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
            </p>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;

        cartItemsElement.appendChild(itemDiv);
    });

    updateCartSummary();
    cartSummaryElement.style.display = "block";

    document.querySelectorAll(".quantity-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));
            const action = button.getAttribute("data-action");
            updateItemQuantity(index, action);
        });
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));
            removeItem(index);
        });
    });
}

function updateItemQuantity(index, action) {
    if (action === "increase") {
        cart[index].quantity += 1;
    } else if (action === "decrease" && cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    }
    saveCart();
    loadCart();
    updateCartCount();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    loadCart();
    updateCartCount();
}

function updateCartSummary() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    document.getElementById("total-items").textContent = totalItems;
    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    if (document.getElementById("cart-items")) {
        loadCart();
    }

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-product-id");
            const productName = button.getAttribute("data-product-name");
            const productPrice = button.getAttribute("data-product-price");

            addToCart(productId, productName, productPrice);
        });
    });
});
