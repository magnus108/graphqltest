import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

const Conn = new Sequelize(
  'postgres',
  'postgres',
  'mysecretpassword',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
);

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

// Relations
Person.hasMany(Travel, {onDelete: 'cascade', onUpdate: 'cascade'});
Travel.belongsTo(Person, {onUpdate: 'cascade'});

Faker.seed(100);

Conn.sync({ force: true }).then(()=> {
  _.times(10, ()=> {
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
