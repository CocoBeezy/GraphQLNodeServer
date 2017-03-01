import mongoose from 'mongoose';
const User = mongoose.model('User');
const Company = mongoose.model('Company');

const resolvers = {
  Query: {
    user(parentValue, { _id }) {
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
    },
    company(parentValue, { _id }) {
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
  },
  Mutation: {
    addUser(parentValue, args) {
      const newUser = new User(args);
      return newUser.save()
        .then(() => newUser)
        .catch(err => err);
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
            company._id = company._id.toString();
            return company;
          }
        });
    }
  },
  Company: {
    users(parentValue) {
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
        })
    }
  }
}

export default resolvers;
