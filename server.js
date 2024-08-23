import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/all`);

    res.render("index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/post/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/post/${req.params.id}`);

    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/post", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/post`, req.body);

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/post/:id", async (req, res) => {
  try {
    const response = await axios.patch(
      `${API_URL}/post/${req.params.id}`,
      req.body
    );

    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/post/del/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/post/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
