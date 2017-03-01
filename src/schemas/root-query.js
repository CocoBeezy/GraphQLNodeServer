import UserType from './user';
import CompanyType from './company';

const RootQuery = `
   type Query {
    user(_id: String): User,
    company(_id: String): Company
  }

  type Mutation {
    addUser(firstName: String, lastName: String, age: Int, email: String!, companyId: String): User
  }

  schema {
    query: Query,
    mutation: Mutation
  }
`;
export default [RootQuery, UserType, CompanyType];
