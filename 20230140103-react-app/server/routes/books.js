// routes/books.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '..', 'books.json');

// Helper aman baca/tulis JSON
const readBooks = () => {
  try {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
    const raw = fs.readFileSync(filePath, 'utf-8').trim();
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('JSON error:', e.message);
    fs.writeFileSync(filePath, '[]'); // reset kalau korup
    return [];
  }
};

const writeBooks = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// GET /api/books
router.get('/', (req, res) => {
  res.json(readBooks());
});

// GET /api/books/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const book = readBooks().find((b) => b.id === id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// POST /api/books
router.post('/', (req, res) => {
  const { title, author } = req.body || {};
  if (!title || !author)
    return res.status(400).json({ message: 'Title and author are required' });

  const books = readBooks();
  const nextId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;

  const newBook = { id: nextId, title, author };
  books.push(newBook);
  writeBooks(books);
  res.status(201).json(newBook);
});

// PUT /api/books/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const { title, author } = req.body || {};
  if (!title || !author)
    return res.status(400).json({ message: 'Title and author are required' });

  const books = readBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return res.status(404).json({ message: 'Book not found' });

  books[index] = { ...books[index], title, author };
  writeBooks(books);
  res.json(books[index]);
});

// DELETE /api/books/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const books = readBooks();
  const filtered = books.filter((b) => b.id !== id);
  if (filtered.length === books.length)
    return res.status(404).json({ message: 'Book not found' });

  writeBooks(filtered);
  res.json({ message: 'Book deleted successfully' });
});

module.exports = router;
