import * as Sequelize from 'sequelize';
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';

export default function (sequelize: any) {
  const UserSchema = sequelize.define('User', {
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    passwordResetToken:  Sequelize.STRING,
    passwordResetExpires: Sequelize.DATE,

    facebook: Sequelize.STRING,
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    gender: Sequelize.STRING,
    location: Sequelize.STRING,
    website: Sequelize.STRING,
    picture: Sequelize.STRING
  }, {
    individualHooks: true,
    instanceMethods: {
      getFullName () {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  });
  UserSchema.beforeCreate((user: any) => {
    return new Promise((res, rej) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error('Error while executing genSalt!');
          return rej(err);
        }
        bcrypt.hash(user.password, salt, undefined, (err, hash) => {
          if (err) {
            console.error('Error while exeucing password hash!');
          }
          user.password = hash;
          return res(null);
        });
      });
    });
  });
  return UserSchema;
}
/*
import * as bcrypt from 'bcrypt-nodejs';
import * as crypto from 'crypto';
import * as mongoose from 'mongoose';

export type UserModel = mongoose.Document & {
  email: string,
  password: string,
  passwordResetToken: string,
  passwordResetExpires: Date,

  facebook: string,
  tokens: AuthToken[],

  profile: {
    name: string,
    gender: string,
    location: string,
    website: string,
    picture: string
  },

  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
  gravatar: (size: number) => string
};

export type AuthToken = {
  accessToken: string,
  kind: string
};

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  twitter: String,
  google: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  }
}, { timestamps: true });

userSchema.pre('save', function save(next) {
  const user = this;
  console.log('checking user! ', user);
  console.log('check is modified ', user.isModified('password'));
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  });
};

userSchema.methods.gravatar = function (size: number) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model('User', userSchema);
export default User;
*/