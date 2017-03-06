const RootQuery = `
  # A user in our app
  type User {
    id: ID,
    firstName: String,
    lastName: String,
    email: String,
    age: Int
    company: Company
  }

  # A company in our app
  type Company {
    id: ID,
    name: String,
    description: String,
    users: [User]
  }

   type Query {
    user(id: ID): User,
    users: [User],
    company(id: ID): Company,
    companies: [Company]
  }

  type Mutation {
    addUser(firstName: String, lastName: String, age: Int, email: String!, companyId: ID): User,
    editUser(firstName: String, lastName: String, age: Int, email: String!, companyId: ID): User,
    deleteUser(id: ID): User,
    addCompany(name: String, description: String): Company
  }

  schema {
    query: Query,
    mutation: Mutation
  }
`;
export default RootQuery;
