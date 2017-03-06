import mongoose from 'mongoose';
import _ from 'lodash';
const User = mongoose.model('User');
const Company = mongoose.model('Company');
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';


const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return User.find({ 'companyId': parentValue.id })
          .exec((err, users) => {
            if(err) return err;
            else if(!users) return new Error(`Couldn\'t find users of company`);
            else {
              for(var i=0; i<users.length; i++) {
                users[i] = users[i].toObject();
                users[i].id = users[i]._id.toString();
                delete users[i]._id;
              }
              return users;
            }
          });
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    email: { type: GraphQLString },
    company: {
      type: CompanyType,
      resolve(parentValue) {
        return Company.findById(parentValue.companyId)
          .exec((err, company) => {
            if(err) return err;
            else if(!company) return new Error(`Couldn\'t find company of user`);
            else {
              company = company.toObject();
              company.id = company._id.toString();
              company
              return company;
            }
          });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, { _id }) {
        return User.findById(_id)
          .exec((err, user) => {
            if(err) return err;
            else if(!user) return new Error(`Couldn\'t find User with id ${_id}`);
            else {
              user = user.toObject();
              user.id = user._id.toString();
              delete user._id;
              return user;
            }
          });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: {},
      resolve(parentValue) {
        return User.find()
          .exec((err, users) => {
            if(err) return err;
            else {
              for(let i=0; i<users.length; i++) {
                users[i] = users[i].toObject();
                users[i].id = users[i]._id.toString();
                delete users[i]._id;
              }
              return users;
            }
          })
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, {_id}) {
        return Company.findById(id)
          .exec((err, company) => {
            if(err) return err;
            else if(!company) return new Error(`Couldn\'t find Company with id ${_id}`);
            else {
              company = company.toObject();
              company.id = company._id.toString();
              delete company._id;
              return company;
            }
          });
      }
    },
    companies: {
      type: new GraphQLList(CompanyType),
      args: {},
      resolve(parentValue) {
        return Company.find()
          .exec((err, companies) => {
            if(err) return err;
            else {
              for(let i=0; i<companies.length; i++) {
                companies[i] = companies[i].toObject();
                companies[i].id = companies[i]._id.toString();
                delete companies[i]._id;
              }
              return companies;
            }
          })
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLID }
      },
      resolve(parentValue, args) {
        let newUser = new User(args);
        return newUser.save()
          .then(() => {
            newUser = newUser.toObject();
            newUser.id = newUser._id.toString();
            delete newUser._id;
            return newUser;
          })
          .catch(err => err);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLID }
      },
      resolve(parentValue, args) {
        return User.findById(args.id)
          .exec((err, user) => {
            if(err) return err;
            else if(!user) return new Error('Invalid user id provided');
            else {
              delete args.id;
              user = _.merge(user, args);
              user.save()
              .then(() => {
                user = user.toObject();
                user.id = user._id.toString();
                delete user._id;
                return user;
              })
              .catch(err => err)
            }
          })
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parentValue, { id }) {
        return User.findByIdAndRemove(id)
          .exec((err, user) => {
            if(err) return err;
            else if(!user) return new Error('Invalid user id provided');
            else {
              user = user.toObject();
              user.id = user._id.toString();
              delete user._id;
              return user;
            }
          });
      }
    },
    addCompany: {
      type: CompanyType,
      args: {
        name: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        let newCompany = new Company(args);
        newCompany.save()
          .then(() => {
            newCompany = newCompany.toObject();
            newCompany.id = newCompany._id.toString();
            delete newCompany._id;
            return newCompany;
          });
      }
    }
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
