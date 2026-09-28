import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in");
      return;
    }

    const book = { title, author, genre };
    const response = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify(book),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }
    if (response.ok) {
      setTitle("");
      setAuthor("");
      setGenre("");
      setError(null);
      navigate("/login");
    }
  };
  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Book</h3>

      <label>Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label>Author:</label>
      <input
        type="text"
        onChange={(e) => setAuthor(e.target.value)}
        value={author}
      />
      <label>Genre:</label>
      <input
        type="text"
        onChange={(e) => setGenre(e.target.value)}
        value={genre}
      />

      <button>Add Book</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
export default BookForm;
