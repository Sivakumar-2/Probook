import React from "react";

export default function Favorites({ favorites, onOpen, onToggle }) {
  return (
    <section>
      <h2>Your Favorites</h2>
      {favorites.length === 0 ? (
        <p className="info">No favorites yet. Click ♥ on any book to add it.</p>
      ) : (
        <div className="book-grid">
          {favorites.map((b, i) => (
            <div key={b.key || i} className="card" onClick={() => onOpen(b)}>
              <div className="cover-wrap">
                <img
                  src={
                    b.cover_i
                      ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`
                      : "https://via.placeholder.com/150"
                  }
                  alt={b.title}
                />
              </div>
              <div className="card-body">
                <h3 className="book-title">{b.title}</h3>
                <p className="book-author">{b.author_name?.join(", ") || "Unknown"}</p>
                <div className="card-footer">
                  <small>{b.first_publish_year || "N/A"}</small>
                  <button
                    className="fav-btn active"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(b);
                    }}
                    title="Remove favorite"
                  >
                    ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
