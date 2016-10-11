import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

Faker.seed(100);

const Conn = new Sequelize(
  'postgres',
  'postgres',
  process.env.POSTGRES_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.POSTGRES_PORT_5432_TCP_ADDR
  }
);

const Token = Conn.define('token', {
  uuid: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const RolePerson = Conn.define('rolePerson', {});

const Role = Conn.define('role', {
  name: {
    type: Sequelize.STRING
  }
});

const RolePermission = Conn.define('rolePermission', {});

const Permission = Conn.define('permission', {
  object: {
    primaryKey: true,
    type: Sequelize.STRING,
    allowNull: false,
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


const PersonGroup = Conn.define('personGroup', {});

const Group = Conn.define('group', {});

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


Person.belongsToMany(Group, { through: { model: PersonGroup }});
Group.belongsToMany(Person, { through: { model: PersonGroup }});


// you must have a travel to login
Group.hasMany(Travel, {onDelete: 'SET NULL', onUpdate: 'cascade'});
Travel.belongsTo(Group, {onUpdate: 'cascade'});

Person.hasMany(Token, {onDelete: 'cascade', onUpdate: 'cascade'});
Token.belongsTo(Person, {onUpdate: 'cascade'});

Person.belongsToMany(Role, { through: { model: RolePerson }});
Role.belongsToMany(Person, { through: { model: RolePerson }});

Role.belongsToMany(Permission, { through: { model: RolePermission }});
Permission.belongsToMany(Role, { through: { model: RolePermission }});


Conn.sync({ force: true }).then(()=> {
  _.times(1, ()=> {
    return Person.create({
      firstname: Faker.name.firstName(),
      email: Faker.internet.email()
    }).then(person => {
      _.times(1, ()=> {
        person.createToken({
          uuid: person.email
        })
      })

      _.times(1, ()=> {
        return person.createRole({
          name: 'traveler'
        }).then(role => {
          role.createPermission({
            object: 'travels'
          })

          role.createPermission({
            object: 'group'
          })

          role.createPermission({
            object: 'group:id/people'
          })

          role.createPermission({
            object: 'travel:id'
          })

          role.createPermission({
            object: 'travel:id/group'
          })

          role.createPermission({
            object: 'group:id/travels'
          })

          role.createPermission({
            object: 'person'
          })

          role.createPermission({
            object: 'person:id'
          })

          role.createPermission({
            object: 'person:id/group'
          })

        })
      })
      _.times(2, ()=> {
        return person.createGroup().then(group => {
          _.times(5, ()=> {
            return group.createTravel({
              destination: `${Faker.address.country()}`,
              status: `${Faker.random.arrayElement(['full', 'dep.'])}`
            })
          })
        })
      })
    });
  });
});

export default Conn;
