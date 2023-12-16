const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('year');
const isCompleteInput = document.getElementById('isComplete');
const searchInput = document.getElementById('search');
const unfinishedList = document.getElementById('unfinishedList');
const finishedList = document.getElementById('finishedList');

searchInput.addEventListener('input', function () {
  searchBook();
});

bookForm.addEventListener('submit', function (event) {
  event.preventDefault();
  addBook();
});

document.addEventListener('ondatasaved', () => {
  refreshDataFromBooks();
});

document.addEventListener('ondataloaded', () => {
  refreshDataFromBooks();
});

function searchBook() {
  const searchValue = searchInput.value.toLowerCase();
  const filteredBooks = books.filter((book) => {
    const bookTitle = book.title.toLowerCase();
    const bookAuthor = book.author.toLowerCase();
    return bookTitle.includes(searchValue) || bookAuthor.includes(searchValue);
  });

  refreshDataFromBooks(filteredBooks);
}

function addBook() {
  const title = titleInput.value;
  const author = authorInput.value;
  const year = parseInt(yearInput.value);
  const isComplete = isCompleteInput.checked;

  const newBook = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(newBook);
  updateDataToStorage();
  titleInput.value = '';
  authorInput.value = '';
  yearInput.value = '';
  isCompleteInput.checked = false;
}

function refreshDataFromBooks(filteredBooks = books) {
  const unfinishedShelf = document.getElementById('unfinishedList');
  const finishedShelf = document.getElementById('finishedList');

  unfinishedShelf.innerHTML = '';
  finishedShelf.innerHTML = '';

  for (const book of filteredBooks) {
    const newBook = makeBookElement(book);

    if (book.isComplete) {
      finishedShelf.appendChild(newBook);
    } else {
      unfinishedShelf.appendChild(newBook);
    }
  }
}

function makeBookElement(book) {
  const listItem = document.createElement('li');
  const moveButton = document.createElement('button');
  moveButton.innerText = book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca';
  moveButton.addEventListener('click', function () {
    moveBook(book.id);
  });

  listItem.innerText = `${book.title} - ${book.author} (${book.year})`;

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.addEventListener('click', function () {
    deleteBook(book.id);
  });

  const actionContainer = document.createElement('div');
  actionContainer.appendChild(moveButton);
  actionContainer.appendChild(document.createTextNode('\u00A0'));
  actionContainer.appendChild(deleteButton);

  listItem.appendChild(actionContainer);

  return listItem;
}

function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    updateDataToStorage();
  }
}

function moveBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    updateDataToStorage();
  }
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

function updateDataToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  document.dispatchEvent(new Event('ondatasaved'));
}

function loadDatafromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    books = data;
  }
  document.dispatchEvent(new Event('ondataloaded'));
}

loadDatafromStorage();