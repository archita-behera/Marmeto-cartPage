const apiURL =
  "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

const loader = document.createElement("div");
loader.classList.add("loader");
loader.textContent = "Loading...";
document.body.appendChild(loader);

const cartItemsContainer = document.querySelector(".cart-items");
const subtotalElement = document.getElementById("subtotal");
const totalElement = document.getElementById("total");
let cart = [];

document.getElementById("hamburger").addEventListener("click", function () {
  const navbarCenter = document.querySelector(".navbar-center");
  navbarCenter.classList.toggle("show");
});


async function fetchCartData() {
  try {
    loader.style.display = "block";
    const response = await fetch(apiURL);
    const data = await response.json();
    cart = data.items.map((item) => ({
      ...item,
      line_price: item.price * item.quantity,
    }));
    renderCart();
  } catch (error) {
    console.error("Error fetching cart data:", error);
  } finally {
    loader.style.display = "none";
  }
}

function renderCart() {
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.line_price;
    const row = `
      <tr>
        <td><img src="${item.image}" alt="${
      item.title
    }" style="width: 96px; border-radius: 7px;"> </td>
         <td>${item.title}</td>
        <td>₹${(item.price / 100).toFixed(2)}</td>
        <td>
          <input type="number" value="${
            item.quantity
          }" min="1" class="quantity-input" data-index="${index}">
        </td>
        <td>₹${(item.line_price / 100).toFixed(2)}</td>
       <td>
  <button class="remove-item-btn" data-index="${index}">
    <i class="fas fa-trash-alt"></i>
  </button>
</td>

      </tr>`;
    cartItemsContainer.insertAdjacentHTML("beforeend", row);
  });

  updateTotals(subtotal);
  attachEventListeners();
}

function updateTotals(subtotal) {
  subtotalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
  totalElement.textContent = `₹${(subtotal / 100).toFixed(2)}`;
}

function attachEventListeners() {
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = e.target.dataset.index;
      const quantity = parseInt(e.target.value, 10);
      if (quantity > 0) {
        cart[index].quantity = quantity;
        cart[index].line_price = cart[index].price * quantity;
        renderCart();
      }
    });
  });

  document.querySelectorAll(".remove-item-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const confirmed = confirm("Are you sure you want to remove this item?");
      if (confirmed) {
        cart.splice(index, 1);
        renderCart();
      }
    });
  });

  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Proceeding to checkout!");
  });
}

fetchCartData();
