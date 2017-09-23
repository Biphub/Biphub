import * as Sequelize from 'sequelize'
import * as bcrypt from 'bcrypt-nodejs'

export interface UserInstance {
  id: number,
  createdAt: Date,
  updatedAt: Date,
  email: string,
  password: string,
  passwordResetToken: string,
  passwordResetExpires: Date,
  facebook: string,
  firstName: string,
  lastName: string,
  gender: string,
  location: string,
  website: string,
  picture: string,
}

export default function defineUser (sequelize: Sequelize.Sequelize) {
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
        return `${this.firstName} ${this.lastName}`
      }
    }
  })
  UserSchema.beforeCreate((user: any) => {
    return new Promise((res, rej) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error('Error while executing genSalt!')
          return rej(err)
        }
        bcrypt.hash(user.password, salt, undefined, (err, hash) => {
          if (err) {
            console.error('Error while exeucing password hash!')
          }
          user.password = hash
          return res(null)
        })
      })
    })
  })
  return UserSchema
}
