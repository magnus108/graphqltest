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

const Token = Conn.define('token', {
  uuid: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Permission = Conn.define('permission', {});

const Group = Conn.define('group' {});



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

Permission.belongTo(Group, {onUpdate: 'cascade'});
Group.hasMany(Permission, {onDelete: 'cascade', onUpdate: 'cascade'});

Group.


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
