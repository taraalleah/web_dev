import useFetch from "../hooks/useFetch";
import BookListings from "../components/BookListings";

const Home = () => {
   const { data: books, loading, error } = useFetch("/api/books");

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {loading && <div>Loading...</div>}
      {books && <BookListings books={books} />}
    </div>
  );
};

export default Home;

