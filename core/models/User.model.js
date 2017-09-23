"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sequelize = require("sequelize");
var bcrypt = require("bcrypt-nodejs");
function defineUser(sequelize) {
    var UserSchema = sequelize.define('User', {
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        passwordResetToken: Sequelize.STRING,
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
            getFullName: function () {
                return this.firstName + " " + this.lastName;
            }
        }
    });
    UserSchema.beforeCreate(function (user) {
        return new Promise(function (res, rej) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    console.error('Error while executing genSalt!');
                    return rej(err);
                }
                bcrypt.hash(user.password, salt, undefined, function (err, hash) {
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
exports.default = defineUser;
