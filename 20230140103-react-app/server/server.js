const express = require('express');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const morgan = require("morgan");


const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const apiBookRoutes = require('./routes/books');
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");

console.log({
  apiBookRoutes:  typeof apiBookRoutes,
  presensiRoutes: typeof presensiRoutes,
  reportRoutes:   typeof reportRoutes,
  logger:         typeof logger,
  notFound:       typeof notFound,
  errorHandler:   typeof errorHandler,
  
});

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(logger);
app.use(express.static('public'));
app.use(morgan("dev"));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // pakai views/layout.ejs

app.get('/', (req, res) => res.redirect('/books'));

// ---------- UI pages ----------
const fs = require('fs');
const filePath = path.join(__dirname, 'books.json');
const readBooks = () => {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
  const raw = fs.readFileSync(filePath, 'utf-8').trim();
  return raw ? JSON.parse(raw) : [];
};
const writeBooks = (d) => fs.writeFileSync(filePath, JSON.stringify(d, null, 2));

app.get('/books', (req, res) => res.render('books/index', { title: 'Books', books: readBooks() }));
app.get('/books/new', (req, res) => res.render('books/form', { title: 'Tambah Buku', mode: 'create', book: { title:'', author:'' } }));
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).send('Title & author wajib');
  const books = readBooks();
  const nextId = books.length ? Math.max(...books.map(b=>b.id))+1 : 1;
  books.push({ id: nextId, title, author });
  writeBooks(books);
  res.redirect('/books');
});
app.get('/books/:id/edit', (req, res) => {
  const id = Number(req.params.id);
  const book = readBooks().find(b=>b.id===id);
  if (!book) return res.status(404).send('Not found');
  res.render('books/form', { title: 'Edit Buku', mode:'edit', book });
});
app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, author } = req.body;
  const books = readBooks();
  const i = books.findIndex(b=>b.id===id);
  if (i === -1) return res.status(404).send('Not found');
  if (!title || !author) return res.status(400).send('Title & author wajib');
  books[i] = { ...books[i], title, author };
  writeBooks(books);
  res.redirect('/books');
});
app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const books = readBooks();
  const filtered = books.filter(b=>b.id!==id);
  if (filtered.length === books.length) return res.status(404).send('Not found');
  writeBooks(filtered);
  res.redirect('/books');
});

// ---------- API tetap ----------s 
app.use('/api/books', apiBookRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'upsloads')));

// error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Express server running at http://localhost:${PORT}/`));
