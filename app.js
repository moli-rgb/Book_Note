import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

// static files
app.use(express.static("node_modules/bootstrap/dist"));
app.use("/aos", express.static("node_modules/aos/dist"));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

// ================= HOME PAGE =================
app.get("/", async (req, res) => {
  const sort = req.query.sort || "";

  let orderQuery = "";
  if (sort === "title") orderQuery = "ORDER BY c.title";
  else if (sort === "author") orderQuery = "ORDER BY c.author";
  else if (sort === "rating") orderQuery = "ORDER BY c.rating DESC";

  try {
    const result = await db.query(`
      SELECT c.id, c.title, c.author, c.image_url, c.rating, n.note
      FROM cover c
      LEFT JOIN note n ON c.id = n.cover_id
      ${orderQuery}
    `);

    const covers = result.rows;
    res.render("index", { covers, sort , page: "home"});
  } catch (err) {
    console.error(err);
    res.send("Error fetching covers.");
  }
});

// ================= ADD NEW BOOK PAGE =================
app.get("/new", (req, res) => {
  res.render("new.ejs"); // page to add a book
});

// ================= USER LIBRARY PAGE =================
app.get("/book", async (req, res) => {
  const sort = req.query.sort || "";
  let orderQuery = "ORDER BY id DESC"; // default

  if (sort === "title") orderQuery = "ORDER BY title";
  else if (sort === "author") orderQuery = "ORDER BY author";
  else if (sort === "rating") orderQuery = "ORDER BY rating DESC";

  try {
    const result = await db.query(`SELECT * FROM new_book ${orderQuery}`);
    res.render("book.ejs", { books: result.rows, sort, page: "book" });
  } catch (err) {
    console.error(err);
    res.render("book.ejs", { books: [], sort, page: "book" });
  }
});


// ================= HANDLE NEW BOOK SUBMIT =================
app.post("/new", async (req, res) => {
  const { title, author, rating, note, img_url } = req.body;

  try {
    await db.query(
      "INSERT INTO new_book (title, author, rating, note, img_url) VALUES ($1, $2, $3, $4, $5)",
      [title, author, rating, note, img_url || null]
    );

    // redirect to user's library after saving
    res.redirect("/book");
  } catch (err) {
    console.error(err);
    res.send("Error saving book");
  }
});

app.post("/delete/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    await db.query("DELETE FROM new_book WHERE id = $1", [bookId]);
    res.redirect("/book"); // يرجع يشوف المكتبة بعد الحذف
  } catch (err) {
    console.error(err);
    res.send("Error deleting book");
  }
});

// يجيب بيانات الكتاب ويعرضها في form للتعديل
app.get("/edit/:id", async (req, res) => {
  const bookId = req.params.id;
  try {
    const result = await db.query("SELECT * FROM new_book WHERE id = $1", [bookId]);
    res.render("edit.ejs", { book: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.send("Error loading book for edit");
  }
});

// يستقبل التعديل ويحفظه
app.post("/edit/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, author, rating, note, img_url } = req.body;

  try {
    await db.query(
      "UPDATE new_book SET title=$1, author=$2, rating=$3, note=$4, img_url=$5 WHERE id=$6",
      [title, author, rating, note, img_url, bookId]
    );
    res.redirect("/book");
  } catch (err) {
    console.error(err);
    res.send("Error updating book");
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
