import React, { useEffect, useState } from "react";

function coverUrl(book, size = "L") {
  if (book.cover_i) return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
  if (book.isbn && book.isbn[0]) return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-${size}.jpg`;
  return "https://via.placeholder.com/200x300?text=No+Cover";
}

export default function BookModal({ book, onClose, onToggleFav, isFav }) {
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        // Attempt fetch work description via work key if available
        // docs often include "key" like "/works/OL...W"
        if (book.key) {
          const url = `https://openlibrary.org${book.key}.json`;
          const res = await fetch(url);
          if (res.ok) {
            const d = await res.json();
            setDetails(d);
          }
        }
      } catch (err) {
        // ignore
        console.error(err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [book]);

  const infoLink = book.key ? `https://openlibrary.org${book.key}` : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>✕</button>

        <div className="modal-inner">
          <img className="modal-cover" src={coverUrl(book)} alt={book.title} />

          <div className="modal-info">
            <h2>{book.title}</h2>
            <p className="muted">{book.author_name ? book.author_name.join(", ") : "Unknown author"}</p>
            <p><strong>First Published:</strong> {book.first_publish_year || "N/A"}</p>

            <div className="desc-block">
              {loadingDetails ? (
                <p className="muted">Loading description...</p>
              ) : details && (details.description || details.first_sentence) ? (
                <p>{(details.description && (typeof details.description === "string" ? details.description : details.description.value)) ||
                  (details.first_sentence && (typeof details.first_sentence === "string" ? details.first_sentence : details.first_sentence.value))
                }</p>
              ) : (
                <p className="muted">No detailed description available.</p>
              )}
            </div>

            <div className="modal-actions">
              {infoLink && (
                <a className="btn" href={infoLink} target="_blank" rel="noreferrer">View on OpenLibrary</a>
              )}
              <button
                className={`btn secondary ${isFav ? "danger" : ""}`}
                onClick={() => onToggleFav(book)}
              >
                {isFav ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
