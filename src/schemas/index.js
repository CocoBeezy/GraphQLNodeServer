import mongoose from 'mongoose';
const User = mongoose.model('User');
const Company = mongoose.model('Company');
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';


const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return User.find({ 'companyId': parentValue._id })
          .exec((err, users) => {
            if(err) return err;
            else if(!users) return new Error(`Couldn\'t find users of company`);
            else {
              for(var i=0; i<users.length; i++) {
                users[i] = users[i].toObject();
                users[i]._id = users[i]._id.toString();
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
    _id: { type: GraphQLString },
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
              company._id = company._id.toString();
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
      args: { _id: { type: GraphQLString } },
      resolve(parentValue, { _id }) {
        return User.findById(_id)
          .exec((err, user) => {
            if(err) return err;
            else if(!user) return new Error(`Couldn\'t find User with id ${_id}`);
            else {
              user = user.toObject();
              user._id = user._id.toString();
              return user;
            }
          });
      }
    },
    company: {
      type: CompanyType,
      args: { _id: { type: GraphQLString } },
      resolve(parentValue, {_id}) {
        return Company.findById(_id)
          .exec((err, company) => {
            if(err) return err;
            else if(!company) return new Error(`Couldn\'t find Company with id ${_id}`);
            else {
              company = company.toObject();
              company._id = company._id.toString();
              return company;
            }
          });
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
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        const newUser = new User(args);
        return newUser.save()
          .then(() => newUser)
          .catch(err => err);
      }
    },
  }
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
