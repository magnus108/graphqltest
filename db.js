//skal ikke bruge den her fil mere models ligger et andet sted
import Sequelize from 'sequelize';

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

export default Conn;
