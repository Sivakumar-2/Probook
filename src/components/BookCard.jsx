import React from "react";

function coverUrl(book, size = "M") {
  if (book.cover_i) return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
  // fallback use edition key if available
  if (book.isbn && book.isbn[0]) return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`;
  return "https://via.placeholder.com/150x220?text=No+Cover";
}

export default function BookCard({ book, onOpen, onToggleFav, isFav }) {
  return (
    <div className="card" onClick={onOpen} role="button" tabIndex={0}>
      <div className="cover-wrap">
        <img src={coverUrl(book)} alt={book.title} />
      </div>
      <div className="card-body">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author_name ? book.author_name.join(", ") : "Unknown"}</p>
        <div className="card-footer">
          <small>{book.first_publish_year || "N/A"}</small>
          <button
            className={`fav-btn ${isFav ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav();
            }}
            title={isFav ? "Remove favorite" : "Add to favorites"}
          >
            {isFav ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
}
