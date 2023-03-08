const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");


roles = [
  {
    id: 1,
    name: 'review'
  }, {
    id: 2,
    name: 'verify'
  }, {
    id: 3,
    name: 'admin'
  }
]

for (role of roles) {
  initializeRole(role)
}

exports.signupPage = async (request, response) => {
  try {
    let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/register.html`, 'utf-8');
    html = html.replaceAll('{server-environment}', process.env.environment)
    response.send(html);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
};

exports.signup = async (request, response) => {
  // Save User to Database
  try {
    const user = await User.create({
      username: request.body.username,
      email: request.body.email,
      password: bcrypt.hashSync(request.body.pass, 8),
    });

    // V1
    // if (request.body.role) {
    //   const roles = await Role.findAll({
    //     where: {
    //       name: {
    //         [Op.or]: request.body.role,
    //       },
    //     },
    //   });

    //   const result = user.setRoles(roles);
    //   if (result) response.send({ message: "User registered successfully!" });
    // }


    // V2
    // if (request.body.selectedRole) {
    //   const role = await Role.findOne({
    //     where: {
    //       name: request.body.selectedRole,
    //     },
    //   });
    
    //   const result = user.setRoles([role]);
    //   if (result) response.send({ message: "User registered successfully!" });

    // } else {
    //   // user has role = 1
    //   const result = user.setRoles([1]);
    //   if (result) response.send({ message: "User registered successfully!" });
    // }

    // V4
    // if (request.body.role) {
    //   Role.findOne({
    //     where: {
    //       name: request.body.role,
    //     },
    //   }).then(async (role) => {
    //     if (role) {
    //       const result = await user.setRole(role.id); setRole is not a function!
    //       if (result) {
    //         response.send({ message: "User registered successfully!" });
    //       }
    //     } else {
    //       response.status(404).send({ message: "Role not found!" });
    //     }
    //   }).catch((error) => {
    //     console.log(error);
    //     response.status(500).send({ message: "An error occurred while processing your request!" });
    //   });
    // }


    // V5
        // Assign Roles to User
        if (request.body.role && request.body.role.length > 0) {
          const roles = await Role.findAll({
            where: {
              name: request.body.role,
            },
          });
    
          const result = await user.setRoles(roles);
          if (result) response.status(200).send({ message: "User registered successfully!" });
        } else {
          // If no roles are selected, assign the 'user' role by default
          const userRole = await Role.findOne({ where: { name: "user" } });
          const result = await user.setRoles([userRole]);
          if (result) response.send({ message: "User registered successfully!" });
        }
    
    
    
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
};

exports.signInPage = async (request, response) => {
  try {
    let html = fs.readFileSync(`${process.env.srcPath}/resources/pouchSM/views/login.html`, 'utf-8');
    html = html.replaceAll('{server-environment}', process.env.environment)
    response.send(html);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
};

exports.signin = async (request, response) => {
  try {
    const user = await User.findOne({
      where: {
        username: request.body.username,
      },
    });

    if (!user) {
      return response.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      request.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return response.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    request.session.token = token;

    return response.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
  } catch (error) {
    return response.status(500).send({ message: error.message });
  }
};

exports.signout = async (request, response) => {
  try {
    request.session = null;
    return response.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};

async function initializeRole(pRole) {

  const role = await Role.findOne({
    where: {
      id: pRole.id,
    },
  });

  if (!role) {
    Role.create({
      id: pRole.id,
      name: pRole.name,
    });
  }

}
