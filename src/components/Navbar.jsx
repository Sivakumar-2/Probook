import React, { useState } from "react";

export default function Navbar({ onSearch, onShowFavs, favCount, theme, setTheme }) {
  const [term, setTerm] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch(term || "");
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <div className="logo">📚 ProBook</div>
      </div>

      <form className="nav-search" onSubmit={submit}>
        <input
          placeholder="Search by title or author..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          aria-label="search"
        />
        <button type="submit" className="btn">Search</button>
      </form>

      <div className="nav-right">
        <button className="icon-btn" onClick={onShowFavs} title="Favorites">
          ❤️ <span className="fav-count">{favCount}</span>
        </button>

        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
