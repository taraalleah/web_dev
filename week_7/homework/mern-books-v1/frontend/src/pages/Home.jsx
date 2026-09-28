import BookDetails from "../components/BookDetails";
import BookForm from "../components/BookForm";
import { useEffect, useState } from "react";

const Home = () => {
  const [bookArray, setBookArray] = useState([]);

  useEffect(() => {
    const getBooks = async () => {
      const response = await fetch("/api/books", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(data.error);
        setBookArray([]);
        return;
      }
      setBookArray(data);
    };
    getBooks();
  }, []);

  return (
    <div className="home">
      <div className="bookArray">
        {bookArray.length === 0 && <h2>No Books Found</h2>}
        {bookArray.map((book) => (
          <BookDetails key={book._id} book={book} />
        ))}
      </div>
      <BookForm />
    </div>
  );
};
export default Home;
