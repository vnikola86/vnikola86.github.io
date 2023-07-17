const addBookForm = document.getElementById('addBookForm');
const tbody = document.querySelector('.data tbody');

const editAuthor = document.getElementById('editAuthor');
const editTitle = document.getElementById('editTitle');
const editISBN = document.getElementById('editISBN');
const editRating = document.getElementById('editRating');
const editPrice = document.getElementById('editPrice');
const editForm = document.getElementById('editBookForm');

const searchBox = document.getElementById("search-box");
const searchBtn = document.getElementById("searchBtn");

const addBookModal = new bootstrap.Modal(document.getElementById("addBookModal"), {
  keyboard: false
})

const editModal = new bootstrap.Modal(document.getElementById('editBookModal'));

const exportBtn = document.getElementById('exportBtn');

const restoreDB = document.getElementById('restoreDB');


// Export the database by retrieving all books from the object store and saving them as a CSV file
const exportDatabase = () => {
  const transaction = db.transaction('books', 'readonly');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.getAll();

  request.onerror = () => {
    console.error('Error exporting database');
  };

  request.onsuccess = () => {
    const books = request.result;
    const csv = Papa.unparse(books, { encoding: 'utf8' });
    downloadFile(csv, 'database.csv', 'text/csv');
  };
};



// Import the database by reading a file, parsing its contents as CSV
const importDatabase = (file) => {
  const reader = new FileReader();

  reader.onload = (event) => {
    const contents = event.target.result;
    const result = Papa.parse(contents);
    const books = result.data.slice(1); // Remove the header row

    const transaction = db.transaction(['books'], 'readwrite');
    const objectStore = transaction.objectStore('books');

    // Clear existing data
    const clearRequest = objectStore.clear();

    clearRequest.onsuccess = () => {
      // Add imported books
      books.forEach((book) => {
        const [author, title, isbn, rating, price] = book;
        const request = objectStore.add({ author, title, isbn, rating, price });

        request.onerror = () => {
          console.error('Error importing book');
        };
      });

      transaction.oncomplete = () => {
        fetchBooks();
        console.log('Database imported successfully');
      };
    };

    clearRequest.onerror = () => {
      console.error('Error clearing existing data');
    };
  };

  reader.readAsText(file);
};


exportBtn.addEventListener('click', exportDatabase);

let db;

// Open database connection
const openDB = () => {
const request = indexedDB.open('library', 1);

request.onerror = () => {
  console.error('Error opening database');
};


request.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore = db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });

  objectStore.createIndex('author', 'author', { unique: false });
  objectStore.createIndex('title', 'title', { unique: false });
  objectStore.createIndex('isbn', 'isbn', { unique: true });

  // Insert sample books
  const books = [
    {
      author: "Petar II Petrović Njegoš",
      title: "Gorski vijenac",
      isbn: "978-1909669567",
      rating: 4.5,
      price: 20
    },
    {
      author: "Ivo Andrić",
      title: "Na Drini ćuprija",
      isbn: "978-8673600444",
      rating: 4.5,
      price: 20
    },
    {
      author: "Miguel de Cervantes",
      title: "Don Kihot",
      isbn: "978-8676742684",
      rating: 4.5,
      price: 20
    },
    {
      author: "William Shakespeare",
      title: "Hamlet",
      isbn: "978-8609008856",
      rating: 4.5,
      price: 20
    },
    {
      author: "Thomas Mann",
      title: "Čarobni brijeg",
      isbn: "978-8674461181",
      rating: 4.5,
      price: 20
    }
  ];
  

  books.forEach((book) => {
    const request = objectStore.add(book);

    request.onerror = () => {
      console.error('Error adding book');
    };
  });
};

request.onsuccess = () => {
  db = request.result;
  fetchBooks();
};
};

// Format table row
const formatRow = (row) => {

row.style.display = 'grid';
row.style.gridTemplateColumns = '5% 20% 20% 15% 10% 10% 20%';
row.style.width = '100%';
row.style.borderCollapse = 'collapse'

}


// Fetch all books from the database
const fetchBooks = () => {
  const transaction = db.transaction('books', 'readonly');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.getAll();

  request.onerror = () => {
    console.error('Error fetching books');
  };

  request.onsuccess = () => {
    renderBooks(request.result);
  };
};

// Render books in the table
const renderBooks = (books) => {
  tbody.innerHTML = '';

  books.forEach((book) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.author}</td>
      <td>${book.title}</td>
      <td>${book.isbn}</td>
      <td>${book.rating}</td>
      <td>${book.price}</td>
      <td>
        <button class="btn btn-primary btn-sm btn-edit" data-id="${book.id}" data-bs-toggle="modal" data-bs-target="#editBookModal">Edit</button>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${book.id}">Delete</button>
      </td>
    `;

    tbody.appendChild(row);

    tableRows = tbody.querySelectorAll('tr');

    tableRows.forEach( (row) => { formatRow(row) } )

  });

  // Add event listeners for edit buttons
  const editBtns = document.querySelectorAll('.btn-edit');
  editBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const bookId = parseInt(btn.getAttribute('data-id'));
      openEditModal(bookId);
    });
  });


  // Add event listeners for delete buttons
  const deleteBtns = document.querySelectorAll('.btn-delete');
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const bookId = parseInt(btn.getAttribute('data-id'));
      deleteBook(bookId);
    });
  });

};


// Searches for a book based on author's name or book title
const searchBooks = () => {
  const searchText = searchBox.value.toLowerCase().trim();

  if (searchText === '') {
    fetchBooks();

    return;
  }

  const transaction = db.transaction('books', 'readonly');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.getAll();

  request.onerror = () => {
    console.error('Error searching books');
  };

  request.onsuccess = () => {
    const books = request.result.filter((book) => {
    const fullName = `${book.author.toLowerCase()}`;
    const reversedFullName = fullName.split(' ').reverse().join(' ');
    const title = book.title.toLowerCase();

    return fullName.includes(searchText) || reversedFullName.includes(searchText) || title.includes(searchText);
    });

    renderBooks(books);
  };
};



// Add a book to the database
const addBook = (author, title, isbn, rating, price) => {
  const transaction = db.transaction('books', 'readwrite');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.add({ author, title, isbn, rating, price });

  request.onerror = () => {
    console.error('Error adding book');
  };

  request.onsuccess = () => {
    fetchBooks();
  };
};


// Delete a book from the database
const deleteBook = (id) => {
  const transaction = db.transaction('books', 'readwrite');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.delete(id);

  request.onerror = () => {
    console.error('Error deleting book');
  };

  request.onsuccess = () => {
    fetchBooks();
  };
};


// Open the edit book modal and populate the form with book details
const openEditModal = (bookId) => {
  const transaction = db.transaction('books', 'readonly');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.get(bookId);

  request.onerror = () => {
    console.error('Error retrieving book details');
  };

  request.onsuccess = () => {
    const book = request.result;
    if (book) {
      editForm.setAttribute('data-id', book.id);
      editAuthor.value = book.author;
      editTitle.value = book.title;
      editISBN.value = book.isbn;
      editRating.value = book.rating;
      editPrice.value = book.price;
    }
  };
};


// Update a book in the database
const updateBook = (id, author, title, isbn, rating, price) => {
  const transaction = db.transaction('books', 'readwrite');
  const objectStore = transaction.objectStore('books');
  const request = objectStore.get(id);

  request.onerror = () => {
    console.error('Error retrieving book details');
  };

  request.onsuccess = () => {
    const book = request.result;
    if (book) {
      book.author = author;
      book.title = title;
      book.isbn = isbn;
      book.rating = rating;
      book.price = price;
      const updateRequest = objectStore.put(book);

      updateRequest.onerror = () => {
        console.error('Error updating book');
      };

      updateRequest.onsuccess = () => {
        fetchBooks();
        editModal.hide();
      };
    }
  };
};


// Downloads a file by creating a temporary URL for the provided data
const downloadFile = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};


// Event listeners

searchBox.addEventListener('keyup', searchBooks);
searchBtn.addEventListener('click', searchBooks);

addBookForm.addEventListener('submit', (event) => {

  event.preventDefault();

  const author = document.getElementById('addAuthor').value;
  const title = document.getElementById('addTitle').value;
  const isbn = document.getElementById('addISBN').value;
  const rating = document.getElementById('addRating').value;
  const price = document.getElementById('addPrice').value;
  
  addBook(author, title, isbn, rating, price);

  addBookModal.hide();
  addBookForm.reset()
});


editForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const bookId = parseInt(editForm.getAttribute('data-id'));
  const author = editAuthor.value;
  const title = editTitle.value;
  const isbn = editISBN.value;
  const rating = editRating.value;
  const price = editPrice.value;
  updateBook(bookId, author, title, isbn, rating, price);
});


restoreDB.addEventListener('change', (event) => {
  const file = event.target.files[0];
  importDatabase(file);
  location.reload(); // Reload the page after importing the database
});


openDB();