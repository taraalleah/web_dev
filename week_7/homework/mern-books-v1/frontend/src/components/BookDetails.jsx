import { useNavigate } from "react-router-dom";

const BookDetails = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    await fetch(`/api/books/${book._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    navigate("/login");
  };

  return (
    <div className="book-details">
      <h4>{book.title}</h4>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default BookDetails;
