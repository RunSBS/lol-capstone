import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];

  for (let i = 0; i < totalPages; i++) {
    pages.push(
      <button
        key={i}
        disabled={i === currentPage}
        onClick={() => onPageChange(i)}
        style={{ marginRight: 4 }}
      >
        {i + 1}
      </button>
    );
  }

  return <div>{pages}</div>;
}

export default Pagination;
