import React from "react";

const BookModal = ({ book, onClose }) => {
  if (!book) return null;

  const info = book.volumeInfo;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="modal-body">
          <img
            src={info.imageLinks?.thumbnail || "https://via.placeholder.com/200"}
            alt={info.title}
            className="modal-img"
          />
          <div className="modal-text">
            <h2>{info.title}</h2>
            <p><strong>Author:</strong> {info.authors?.join(", ") || "Unknown"}</p>
            <p><strong>Published:</strong> {info.publishedDate || "N/A"}</p>
            <p className="desc">
              {info.description
                ? info.description.slice(0, 300) + "..."
                : "No description available."}
            </p>
            {info.infoLink && (
              <a
                href={info.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-btn"
              >
                Buy / View Book
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
