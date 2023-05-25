const { nanoid } = require('nanoid');

const books = [];

const saveBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    res.code(400);
    return res;
  } if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    res.code(400);
    return res;
  }

  const res = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  res.code(201);

  books.push(newBook);
  return res;
};

const getAllBooksHandler = (request, h) => {
  const { reading } = request.query;
  const { finished } = request.query;
  const { name } = request.query;

  if (reading === '1') {
    const booksBeingRead = books.filter((book) => book.reading === true);
    const simplifiedBooks = booksBeingRead.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      message: 'Buku telah ditemukan',
      data: { books: simplifiedBooks },
    });
    response.code(200);
    return response;
  } if (reading === '0') {
    const booksNotBeingRead = books.filter((book) => book.reading === false);
    const simplifiedBooks = booksNotBeingRead.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      message: 'Buku telah ditemukan',
      data: { books: simplifiedBooks },
    });
    response.code(200);
    return response;
  } if (finished === '1') {
    const readedBooks = books.filter((book) => book.finished === true);
    const simplifiedBooks = readedBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      message: 'Buku telah ditemukan',
      data: { books: simplifiedBooks },
    });
    response.code(200);
    return response;
  } if (finished === '0') {
    const unfinishedBooks = books.filter((book) => book.finished === false);
    const simplifiedBooks = unfinishedBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      message: 'Buku telah ditemukan',
      data: { books: simplifiedBooks },
    });
    response.code(200);
    return response;
  }

  if (name) {
    const booksFilter = (book) => (book.name.toLowerCase().includes(name.toLowerCase()));
    const booksBeingRead = books.filter(booksFilter);
    const simplifiedBooks = booksBeingRead.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = h.response({
      status: 'success',
      message: 'Buku telah ditemukan joss',
      data: { books: simplifiedBooks },
    });
    response.code(200);
    return response;
  }

  const simplifiedBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const res = h.response({
    status: 'success',
    data: { books: simplifiedBooks },
  });
  return res;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((item) => item.id === bookId)[0];

  if (book === undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    res.code(404);
    return res;
  }

  const res = h.response({
    status: 'success',
    message: 'Buku telah ditemukan',
    data: { book },
  });

  res.code(200);
  return res;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const book = books.filter((item) => item.id === bookId)[0];

  if (!name) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    res.code(400);
    return res;
  } if (readPage > pageCount) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    res.code(400);
    return res;
  } if (book === undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    res.code(404);
    return res;
  }

  const res = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  res.code(200);

  const index = books.findIndex((i) => i.id === bookId);
  const finished = (pageCount === readPage);
  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt,
  };

  return res;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((i) => i.id === bookId);
  const book = books.filter((item) => item.id === bookId)[0];

  if (book === undefined) {
    const res = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    res.code(404);
    return res;
  }

  books.splice(index, 1);
  const res = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });

  res.code(200);
  return res;
};

module.exports = {
  saveBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
