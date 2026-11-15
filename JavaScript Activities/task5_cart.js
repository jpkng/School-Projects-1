const prompt = require("prompt-sync")();


class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  addProduct(product) {
    this.items.push(product);
  }

  removeProduct(id) {
    this.items = this.items.filter(item => item.id !== id);
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  listItems() {
    this.items.forEach(item => {
      console.log(`${item.name}: $${item.price}`);
    });
    console.log(`Total: $${this.getTotal()}`);
  }
}

const cart = new Cart();
const numberOfProducts = parseInt(prompt("Enter number of products:"), 10);

for (let i = 0; i < numberOfProducts; i++) {
  let id = parseInt(prompt(`Enter ID of product ${i + 1}:`), 10);
  let name = prompt(`Enter name of product ${i + 1}:`);
  let price = parseFloat(prompt(`Enter price of ${name}:`));

  cart.addProduct(new Product(id, name, price));
}

cart.listItems();
