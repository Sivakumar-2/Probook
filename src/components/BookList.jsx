import React from "react";
import BookCard from "./BookCard";

export default function BookList({ books, onOpen, onToggleFav, favorites }) {
  if (!books || books.length === 0) {
    return <p className="info">No books to display.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((b, idx) => (
        <BookCard
          key={b.key || b.cover_edition_key || idx}
          book={b}
          onOpen={() => onOpen(b)}
          onToggleFav={() => onToggleFav(b)}
          isFav={!!favorites.find((f) => f.key === b.key)}
        />
      ))}
    </div>
  );
}
