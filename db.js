import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

Faker.seed(100);

const Conn = new Sequelize(
  'postgres',
  'postgres',
  'mysecretpassword',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
);

//accesstoken
const Token = Conn.define('token', {
  uuid: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


/*
//acl
const Acl = Conn.define('acl', {
  resource: {
    type: Sequelize.STRING,
    allowNull: false
  },
  property: {
    type: Sequelize.STRING
  },
  accessType: {
    type: Sequelize.STRING
  },
  permission: {
    type: Sequelize.STRING
  },
  principalType: {
    type: Sequelize.STRING
  },
  principalId: {
    type: Sequlize.STRING
  }
}

*/

const RolePerson = Conn.define('RolePerson', {});

const Role = Conn.define('Role', {
  name: {
    type: Sequelize.STRING
  }
});

const RolePermission = Conn.define('RolePermission', {});

const Permission = Conn.define('Permission', {
  name: {
    type: Sequelize.STRING
  }
});

const Person = Conn.define('person', {
  email: {
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Travel = Conn.define('travel', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  destination: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


Person.hasMany(Travel, {onDelete: 'cascade', onUpdate: 'cascade'});
Travel.belongsTo(Person, {onUpdate: 'cascade'});
Person.hasMany(Token, {onDelete: 'cascade', onUpdate: 'cascade'});
Token.belongsTo(Person, {onUpdate: 'cascade'});

Person.belongsToMany(Role, { through: { model: RolePerson }})
Role.belongsToMany(Person, { through: { model: RolePerson }})

Role.belongsToMany(Permission, { through: { model: RolePermission }})
Permission.belongsToMany(Person, { through: { model: RolePermission }})


Conn.sync({ force: true }).then(()=> {
  _.times(1, ()=> {
    return Person.create({
      firstname: Faker.name.firstName(),
      email: Faker.internet.email()
    }).then(person => {
      _.times(3, ()=> {
        return person.createTravel({
          destination: `${Faker.address.country()}`,
          status: `${Faker.random.arrayElement(['full', 'dep.'])}`
        });
      });
    });
  });
});

export default Conn;
