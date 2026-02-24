// Import library yang dibutuhkan
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { books, members, landings } from "./db.js";

// Definisikan skema GraphQL (type definitions)
const typeDefs = `#graphql

  type Landing {
    id: ID!
    book: Book!
    member: Member!
    borrowAdd: String!
    returnAdd: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    published_add: String!
    category: String!
    total: Int!
    landings: [Landing]
  }

  type Member {
    id: ID!
    name: String!
    email: String!
    verified: Boolean!
    landings: [Landing]
  }

  # --- Input untuk Create/Update ---
  input BookInput {
    title: String!
    author: String!
    year: Int
  }

  input MemberInput {
    name: String!
    email: String!
  }

  # Entry point untuk semua query
  type Query {
    books: [Book!]!
    book(id: ID!): Book
    landings: [Landing]
    landing(id: ID!): Landing

    members: [Member!]!
    member(id: ID!): Member
  }

  # --- Mutation CRUD sederhana ---
  type Mutation {
    addBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookInput!): Book
    deleteBook(id: ID!): Boolean!

    addMember(input: MemberInput!): Member!
    updateMember(id: ID!, input: MemberInput!): Member
    deleteMember(id: ID!): Boolean!
  }
`;

// Buat resolver untuk menjalankan query
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, args) => {
      return books.find((book) => book.id === args.id);
    },

    members: () => members,
    member: (parent, args) => {
      return members.find((member) => member.id === args.id);
    },

    landings: () => landings,
    landing: (parent, args) =>
      landings.find((landing) => landing.id === args.id),
  },
  Book: {
    landings: (parent) => {
      return landings.filter((landing) => landing.bookId === parent.id);
    },
  },
  Member: {
    landings: (parent) => {
      return landings.filter((landing) => landing.memberId === parent.id);
    },
  },
  Landing: {
    book: (parent) => {
      return books.find((book) => book.id === parent.bookId);
    },
    member: (parent) => {
      return members.find((member) => member.id === parent.memberId);
    },
  },

  Mutation: {
    // --- CRUD untuk Book ---
    addBook: (_, { input }) => {
      const newId = (books.length + 1).toString();
      const newBook = { id: newId, ...input };
      books.push(newBook);
      return newBook;
    },
    updateBook: (_, { id, input }) => {
      const i = books.findIndex((b) => b.id === id);
      if (i === -1) return null;
      books[i] = { ...books[i], ...input };
      return books[i];
    },
    deleteBook: (_, { id }) => {
      const i = books.findIndex((b) => b.id === id);
      if (i === -1) return false;
      books.splice(i, 1);
      return true;
    },

    // --- CRUD untuk Member ---
    addMember: (_, { input }) => {
      const newId = (members.length + 1).toString();
      const newMember = { id: newId, ...input };
      members.push(newMember);
      return newMember;
    },
    updateMember: (_, { id, input }) => {
      const i = members.findIndex((m) => m.id === id);
      if (i === -1) return null;
      members[i] = { ...members[i], ...input };
      return members[i];
    },
    deleteMember: (_, { id }) => {
      const i = members.findIndex((m) => m.id === id);
      if (i === -1) return false;
      members.splice(i, 1);
      return true;
    },
  },
};

// Buat instance dari ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Jalankan server pada port 4000
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server siap di ${url}`);
