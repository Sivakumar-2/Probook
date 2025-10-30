import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import BookList from "./components/BookList";
import BookModal from "./components/BookModal";
import Favorites from "./components/Favorites";

const POPULAR_QUERIES = [
  { label: "Fiction", q: "fiction" },
  { label: "Science", q: "science" },
  { label: "History", q: "history" },
  { label: "Technology", q: "technology" },
  { label: "Business", q: "business" },
];

export default function App() {
  const [books, setBooks] = useState([]); // full fetched list (current page)
  const [query, setQuery] = useState("javascript"); // default search for page load
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewFavs, setViewFavs] = useState(false);
  const [theme, setTheme] = useState("light");
  const [pageStart, setPageStart] = useState(0); // used for "load more"
  const PAGE_SIZE = 20;

  // Load favorites & theme from localStorage
  useEffect(() => {
    const s = localStorage.getItem("probook_favs");
    if (s) setFavorites(JSON.parse(s));
    const t = localStorage.getItem("probook_theme");
    if (t) setTheme(t);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("probook_theme", theme);
  }, [theme]);

  // Fetch default books on page load
  useEffect(() => {
    fetchBooks(query, 0, true);
    // eslint-disable-next-line
  }, []);

  const fetchBooks = async (searchTerm, start = 0, replace = false) => {
    setLoading(true);
    setMessage("");
    try {
      // Open Library supports page via 'page' param, but we keep simple start using offset via 'page'
      // We'll request PAGE_SIZE results per "page" using `page` param
      const page = Math.floor(start / PAGE_SIZE) + 1;
      const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
        searchTerm
      )}&page=${page}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response not ok");
      const data = await res.json();
      const docs = data.docs || [];
      if (docs.length === 0 && start === 0) {
        setMessage("No results found.");
        setBooks([]);
      } else {
        if (replace) {
          setBooks(docs.slice(0, PAGE_SIZE));
          setPageStart(0);
        } else {
          // append for load more
          setBooks((prev) => [...prev, ...docs.slice(0, PAGE_SIZE)]);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch books. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    if (!term || term.trim() === "") {
      setMessage("Please enter a search term.");
      return;
    }
    setViewFavs(false);
    setQuery(term);
    setBooks([]);
    setPageStart(0);
    fetchBooks(term, 0, true);
  };

  const handleLoadMore = () => {
    const nextStart = pageStart + PAGE_SIZE;
    setPageStart(nextStart);
    fetchBooks(query, nextStart, false);
  };

  const toggleFavorite = (book) => {
    const exists = favorites.find((b) => b.key === book.key);
    let updated;
    if (exists) {
      updated = favorites.filter((b) => b.key !== book.key);
    } else {
      updated = [book, ...favorites];
    }
    setFavorites(updated);
    localStorage.setItem("probook_favs", JSON.stringify(updated));
  };

  const openDetails = (book) => {
    setSelectedBook(book);
  };

  const closeDetails = () => setSelectedBook(null);

  return (
    <div className="app">
      <Navbar
        onSearch={handleSearch}
        onShowFavs={() => setViewFavs((v) => !v)}
        favCount={favorites.length}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="main">
        <section className="hero">
          <h1>ProBook — Advanced Book Explorer</h1>
          <p className="subtitle">
            Explore books, view details, and save favorites. Start with popular
            categories or search anything.
          </p>

          <div className="categories">
            {POPULAR_QUERIES.map((c) => (
              <button
                key={c.q}
                className="chip"
                onClick={() => handleSearch(c.q)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>

        {viewFavs ? (
          <Favorites favorites={favorites} onOpen={openDetails} onToggle={toggleFavorite} />
        ) : (
          <>
            <div className="results-header">
              <h2>
                Results for <span className="query-text">"{query}"</span>
              </h2>
              <div className="meta">{loading ? "Loading..." : `${books.length} shown`}</div>
            </div>

            <BookList
              books={books}
              onOpen={openDetails}
              onToggleFav={toggleFavorite}
              favorites={favorites}
            />

            {message && <p className="info">{message}</p>}

            {!loading && books.length >= PAGE_SIZE && (
              <div className="load-more-wrap">
                <button className="btn load-more" onClick={handleLoadMore}>
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={closeDetails}
          onToggleFav={toggleFavorite}
          isFav={!!favorites.find((f) => f.key === selectedBook.key)}
        />
      )}

      <footer className="footer">
        <small>© {new Date().getFullYear()} Siva — ProBook (Demo)</small>
      </footer>
    </div>
  );
}
