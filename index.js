// Import library yang dibutuhkan
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { books, members, landings } from "./db.js";


// Definisikan skema GraphQL (type definitions)
const typeDefs = `#graphql
  # Ini adalah skema dasar
  type Query {
    books: [Book!]!
    book(id: ID!): Book
    
    members: [Member!]!
    member(id: ID!): Member

    landings: [Landing]
    landing(id: ID!): Landing
  }

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
