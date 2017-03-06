import mongoose from 'mongoose';
const User = mongoose.model('User');
const Company = mongoose.model('Company');

const resolvers = {
  Query: {
    user(parentValue, { id }) {
      return User.findById(id)
        .exec((err, user) => {
          if(err) return err;
          else if(!user) return new Error(`Couldn\'t find User with id ${id}`);
          else {
            user = user.toObject();
            user.id = user._id.toString();
            delete user._id;
            return user;
          }
        });
    },
    users(parentValue) {
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
        });
    },
    company(parentValue, { id }) {
      return Company.findById(id)
        .exec((err, company) => {
          if(err) return err;
          else if(!company) return new Error(`Couldn\'t find Company with id ${id}`);
          else {
            company = company.toObject();
            company.id = company._id.toString();
            delete company._id;
            return company;
          }
        });
    },
    companies(parentValue) {
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
        });
    }
  },
  Mutation: {
    addUser(parentValue, args) {
      let newUser = new User(args);
      return newUser.save()
        .then(() => {
          newUser = newUser.toObject();
          newUser.id = newUser._id.toString();
          delete newUser._id;
          return newUser;
        })
        .catch(err => err);
    },
    editUser(parentValue, args) {
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
        });
    },
    deleteUser(parentValue, { id }) {
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
    },
    addCompany(parentValue, args) {
      let newCompany = new Company(args);
      newCompany.save()
        .then(() => {
          newCompany = newCompany.toObject();
          newCompany.id = newCompany._id.toString();
          delete newCompany._id;
          return newCompany;
        });
    }
  },
  User: {
    company(parentValue) {
      return Company.findById(parentValue.companyId)
        .exec((err, company) => {
          if(err) return err;
          else if(!company) return new Error(`Couldn\'t find company of user`);
          else {
            company = company.toObject();
            company.id = company._id.toString();
            return company;
          }
        });
    }
  },
  Company: {
    users(parentValue) {
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
        })
    }
  }
}

export default resolvers;
