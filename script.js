document.addEventListener("DOMContentLoaded", function() {
  fetchThenRenderBooks();
});
//////////////////////////////
const baseURL = "http://localhost:3000/books/";
//////////////////////////////
function fetchBooks() {
  return fetch(baseURL).then(response => response.json());
}
//////////////////////////////
const booksCollection = document.getElementById("book-collection");
//////////////////////////////
function makeBookCard(book) {
  const div = document.createElement("div");
  div.className = "card";
  div.dataset.id = book.id;

  // EDIT BUTTON
  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.innerHTML = "edit";
  div.appendChild(editBtn);

  const h2 = document.createElement("h2");
  h2.innerHTML = `${book.title}`;
  div.appendChild(h2);

  const img = document.createElement("img");
  img.className = "book-image";
  img.src = `${book.image}`;
  div.appendChild(img);

  const author = document.createElement("p");
  author.innerHTML = `${book.author}`;
  div.appendChild(author);

  const price = document.createElement("h3");
  price.innerHTML = `£${book.price}`;
  div.appendChild(price);

  const button = document.createElement("button");
  button.className = "delete-btn";
  button.innerHTML = "x";
  button.dataset.id = book.id;
  div.appendChild(button);
  button.addEventListener("click", deleteBook);

  // Create Edit From
  const editContainer = document.createElement("div");
  editContainer.className = "edit-container";

  const editForm = document.createElement("form");
  editForm.className = "edit-book-form";
  editForm.dataset.id = book.id;
  editContainer.appendChild(editForm);

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "name";
  titleInput.value = "";
  titleInput.placeholder = `${book.title}`;
  titleInput.className = "input-text";
  editForm.appendChild(titleInput);

  const authorInput = document.createElement("input");
  authorInput.type = "text";
  authorInput.name = "author";
  authorInput.value = "";
  authorInput.placeholder = `${book.author}`;
  authorInput.className = "input-text";
  editForm.appendChild(authorInput);

  const priceInput = document.createElement("input");
  priceInput.type = "number";
  priceInput.step = "0.01";
  priceInput.name = "price";
  priceInput.value = "";
  priceInput.placeholder = `${book.price}`;
  priceInput.className = "input-text";
  editForm.appendChild(priceInput);

  const imageInput = document.createElement("input");
  imageInput.type = "text";
  imageInput.name = "image";
  imageInput.value = "";
  imageInput.placeholder = `${book.image}`;
  imageInput.className = "input-text";
  editForm.appendChild(imageInput);

  const editSubmit = document.createElement("input");
  editSubmit.type = "submit";
  editSubmit.name = "submit";
  editSubmit.value = "Update Book";
  editSubmit.className = "editSubmit";
  editForm.appendChild(editSubmit);

  let shown = false;

  editBtn.addEventListener("click", () => {
    if (shown) {
      div.appendChild(h2);
      div.appendChild(img);
      div.appendChild(author);
      div.appendChild(price);
      div.appendChild(button);
      div.removeChild(editForm);
      editBtn.innerText = "Edit";
      shown = false;
      editForm.removeEventListener("submit", editFormSubmit);
    } else {
      div.removeChild(h2);
      div.removeChild(img);
      div.removeChild(author);
      div.removeChild(price);
      div.removeChild(button);
      div.appendChild(editForm);
      editBtn.innerText = "Back";
      shown = true;
      editForm.addEventListener("submit", editFormSubmit);
    }
  });
  return div;
}
//////////////////////////////
// Here you want to sort objects before rendering them!!!
function renderBooks(json) {
  booksCollection.innerHTML = "";
  json.forEach(function(book) {
    booksCollection.appendChild(makeBookCard(book));
  });
}
//////////////////////////////
function fetchThenRenderBooks() {
  fetchBooks().then(renderBooks);
}
//////////////////////////////
function deleteBook(e) {
  const parent = e.target.parentElement;
  deleteBookFromServer(e.target.dataset.id).then(() => parent.remove());
}
//////////////////////////////
function deleteBookFromServer(id) {
  return fetch(baseURL + id, {
    method: "DELETE"
  });
}
//////////////////////////////
const form = document.querySelector(".add-book-form");
//////////////////////////////
form.addEventListener("submit", addBookToServer);
//////////////////////////////
function addBookToServer(e) {
  e.preventDefault();

  const book = {
    title: e.target[0].value,
    author: e.target[1].value,
    price: e.target[2].value,
    image: e.target[3].value
  };

  createBook(book).then(addBook(book));

  e.target.reset();
}
//////////////////////////////
function createBook(book) {
  return fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  });
}
//////////////////////////////
function addBook(book) {
  const bookCard = makeBookCard(book);
  bookCard.dataset.id = book.id;
  booksCollection.appendChild(bookCard);
}
//////////////////////////////
function displayBooksByTitle() {
  fetchBooks().then(json => {
    books = json.slice(0);
    books.sort(function(a, b) {
      let x = a.title.toLowerCase();
      let y = b.title.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });
    renderBooks(books);
  });
}
//////////////////////////////
function displayBooksByAuthor() {
  fetchBooks().then(json => {
    books = json.slice(0);
    books.sort(function(a, b) {
      let x = a.author.toLowerCase().split(" ")[1];
      let y = b.author.toLowerCase().split(" ")[1];
      return x < y ? -1 : x > y ? 1 : 0;
    });
    renderBooks(books);
  });
}
//////////////////////////////
function displayBooksByPrice() {
  fetchBooks().then(json => {
    books = json.slice(0);
    books.sort(function(a, b) {
      let x = Number(a.price);
      let y = Number(b.price);
      return x < y ? -1 : x > y ? 1 : 0;
    });
    renderBooks(books);
  });
}
//////////////////////////////
function sortBookData(value) {
  if (value === "Author") {
    displayBooksByAuthor();
  } else if (value === "Title") {
    displayBooksByTitle();
  } else {
    displayBooksByPrice();
  }
}
//////////////////////////////
function updateBookToServer(book, id) {
  return fetch(baseURL + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(book)
  }).then(fetchThenRenderBooks);
}
//////////////////////////////
function editFormSubmit(e) {
  e.preventDefault();
  id = e.target.dataset.id;
  if (e.target[0].value) {
    title = e.target[0].value;
  } else {
    title = e.target[0].placeholder;
  }
  if (e.target[1].value) {
    author = e.target[1].value;
  } else {
    author = e.target[1].placeholder;
  }
  if (e.target[2].value) {
    price = e.target[2].value;
  } else {
    price = e.target[2].placeholder;
  }
  if (e.target[3].value) {
    image = e.target[3].value;
  } else {
    image = e.target[3].placeholder;
  }
  book = {
    title: title,
    author: author,
    price: price,
    image: image,
    id: id
  };
  updateBookToServer(book, id);
  e.target.reset();
}
//////////////////////////////
