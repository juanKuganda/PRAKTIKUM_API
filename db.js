// db.js
export const books = [
  {
    id: "1",
    title: "Harry Potter and The Chamber of Secret",
    author: "JK Rowling",
    published_add: "...", // Tanggal publikasi
    category: "Fantasy",
    total: 5, // Jumlah buku
  },
  {
    id: "2",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    published_add: "...",
    category: "Fantasy",
    total: 3,
  },
];

export const members = [
  {
    id: "1",
    name: "Afif Saifullah",
    email: "afif@mail.com",
    verified: true,
  },
];

export const landings = [
  {
    id: "land1",
    bookId: "1",
    memberId: "1",
    borrowAdd: "2024-06-28",
    returnAdd: "2024-07-28",
  },
  {
    id: "land2",
    bookId: "2",
    memberId: "1",
    borrowAdd: "2024-06-28",
    returnAdd: "2024-07-28",
  },
];