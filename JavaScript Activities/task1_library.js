const prompt = require("prompt-sync")();

class Book {
  constructor(title, author, isbn, copies) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.availableCopies = copies;
  }

  borrow() {
    if (this.availableCopies > 0) {
      this.availableCopies--;
      return true;
    }
    return false;
  }

  returnBook() {
    this.availableCopies++;
  }
}

class Library {
  constructor() {
    this.books = new Map(); 
  }

  addBook(book) {
    this.books.set(book.isbn, book);
  }

  removeBook(isbn) {
    return this.books.delete(isbn);
  }

  searchByTitle(title) {
    for (let book of this.books.values()) {
      if (book.title.toLowerCase().includes(title.toLowerCase())) {
        console.log(book);
      }
    }
  }

  borrowBook(isbn) {
    const book = this.books.get(isbn);
    if (book && book.borrow()) {
      console.log("Book borrowed successfully");
    } else {
      console.log("Book unavailable");
    }
  }

  returnBook(isbn) {
    const book = this.books.get(isbn);
    if (book) {
      book.returnBook();
      console.log("Book returned");
    }
  }
}

const title = prompt("Enter book title:");
const author = prompt("Enter book author:");
const isbn = prompt("Enter book ISBN:");
const copies = parseInt(prompt("Enter number of copies:"), 10);

const book1 = new Book(title, author, isbn, copies);
const library = new Library();
library.addBook(book1);

library.searchByTitle(prompt("Search for a book by title:"));
