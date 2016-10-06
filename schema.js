import {
  Kind,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} from 'graphql';

//at bruge token og slå op heletiden kan være lidt slow?

import Db from './db';

const astToJson = {
  [Kind.INT](ast) {
    return GraphQLInt.parseLiteral(ast);
  },
  [Kind.FLOAT](ast) {
    return GraphQLFloat.parseLiteral(ast);
  },
  [Kind.BOOLEAN](ast) {
    return GraphQLBoolean.parseLiteral(ast);
  },
  [Kind.STRING](ast) {
    return GraphQLString.parseLiteral(ast);
  },
  [Kind.ENUM](ast) {
    return String(ast.value);
  },
  [Kind.LIST](ast) {
    return ast.values.map(astItem => {
      return JSONType.parseLiteral(astItem);
    });
  },
  [Kind.OBJECT](ast) {
    let obj = {};
    ast.fields.forEach(field => {
      let value;
      switch(field.name.value){
          case "or":
            value = "$or"
            break;
        default:
          value = field.name.value
      }

      obj[value] = JSONType.parseLiteral(field.value);
    });
    return obj;
  }
};

const JSONType = new GraphQLScalarType({
  name: 'JSON',
  description: 'The `JSON` scalar type represents raw JSON as values.',
  serialize: value => value,
  parseValue: value => value,
  parseLiteral: ast => {
    const parser = astToJson[ast.kind];
    return parser ? parser.call(this, ast) : null;
  }
});

const Group = new GraphQLObjectType({
  name: 'Group',
  description: 'Describes a group',
  fields () {
    return {
      travels: {
        type: new GraphQLList(Travel),
        args:{
          uuid: {
            type: GraphQLString
          }
        },
        async resolve (group, args) {
          const {uuid} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'group:id/travels'){
                const travels = await group.getTravels();
                return travels;
              }
            }
            throw new Error('permissions not allowed')
          }
        }
      },
      people: {
        type: new GraphQLList(Person),
        args:{
          uuid: {
            type: GraphQLString
          }
        },
        async resolve (group, args) {
          const {uuid} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'group:id/people'){
                const people = await group.getPeople();
                return people;
              }
            }
            throw new Error('permissions not allowed')
          }
        }
      }
    }
  }
})

const Travel = new GraphQLObjectType({
  name: 'Travel',
  description: 'Describes a travel',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (travel) {
          return travel.id;
        }
      },
      destination: {
        type: GraphQLString,
        resolve (travel) {
          return travel.destination;
        }
      },
      status: {
        type: GraphQLString,
        resolve (travel) {
          return travel.status;
        }
      },
      group: {
        type: Group,
        args:{
          uuid: {
            type: GraphQLString
          }
        },
        async resolve (travel, args) {
          const {uuid} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'travel:id/group'){
                return travel.getGroup();
              }
            }
            throw new Error('permissions not allowed')
          }
        }
      }
    };
  }
});

const People = new GraphQLObjectType({
  name: 'People',
  description: 'This represents people',
  fields: () => {
    return {
      people: {
        type: new GraphQLList(Person),
        resolve (people) {
          return people.rows
        }
      },
      count: {
        type: GraphQLInt,
        resolve (people) {
          return people.count
        }
      }
    }
  }
});

const Count = new GraphQLObjectType({
  name: 'Count',
  description: 'This represents deleted rows',
  fields: () => {
    return {
      count: {
        type: GraphQLInt,
        resolve(count) {
          return count
        }
      }
    }
  }
});

const Token = new GraphQLObjectType({
  name: 'Token',
  description: 'This represents a Token',
  fields: () => {
    return {
      uuid: {
        type: GraphQLString,
        resolve (token) {
          return token.uuid
        }
      }
    }
  }
});

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'This represents a Person',
  fields: () => {
    return {
      email: {
        type: GraphQLString,
        resolve (person) {
          return person.email;
        }
      },
      firstname: {
        type: GraphQLString,
        resolve (person) {
          return person.firstname;
        }
      },
      groups: {
        type: new GraphQLList(Group),
        args: {
          limit: {
            type: GraphQLInt
          },
          offset: {
            type: GraphQLInt
          },
          order: {
            type: GraphQLString
          },
          where: {
            type: JSONType
          },
          uuid: {
            type: GraphQLString
          }
        },
        async resolve (person, args) {
          const {uuid} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'person:id/group'){
                return person.getGroups();
              }
            }
            throw new Error('permissions not allowed')
          }
        }
      }
    };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      groups: {
        type: new GraphQLList(Group),
        args: {
          uuid: {
            type: GraphQLString
          }
        },
        async resolve (root, args) {
          const {uuid} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'group'){
                return Db.models.group.findAll(args);
              }
            }
            throw new Error('permissions not allowed');
          }
        }
      },
      people: {
        type: new GraphQLList(Person),
        args: {
          limit: {
            type: GraphQLInt
          },
          offset: {
            type: GraphQLInt
          },
          order: {
            type: GraphQLString
          },
          where: {
            type: JSONType
          },
          uuid: {
            type: GraphQLString
          }
        },
        async resolve (root, args) {
          const {uuid} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'person'){
                return Db.models.person.findAll(args);
              }
            }
            throw new Error('permissions not allowed');
          }
        }
      },
      person: {
        type: Person,
        args: {
          uuid: {
            type: GraphQLString
          }
        },
        async resolve (root, args) {
          const {uuid} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'person:id'){
                return Db.models.person.findById(token.uuid);
              }
            }
            throw new Error('permissions not allowed');
          }
        }
      },
      travels: {
        type: new GraphQLList(Travel),
        args: {
          limit: {
            type: GraphQLInt
          },
          offset: {
            type: GraphQLInt
          },
          order: {
            type: GraphQLString
          },
          where: {
            type: JSONType
          },
          uuid: {
            type: GraphQLString
          }
        },
        async resolve (root, args) {
          const {uuid} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'travels'){
                return Db.models.travel.findAll(args);
              }
            }
            throw new Error('permissions not allowed');
          }
        }
      },
      travel: {
        type: Travel,
        args:{
          uuid: {
            type: GraphQLString
          },
          travelId: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve (group, args) {
          const {uuid, travelId} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'travel:id'){
                const travel = await Db.models.travel.findById(travelId);
                return travel;
              }
            }
            throw new Error('permissions not allowed')
          }
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {
      loginPerson: {
        type: Token,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString)
          },
          groupId: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve (source, args) {
          const {email, groupId} = args;
          const group = await Db.models.group.findById(groupId);
          const person = await group.getPeople({where: {email: email}});
          return Db.models.token.create({
            uuid: person[0].email
          })
        }
      },
      addPerson: {
        type: Person,
        args: {
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return Db.models.person.create({
            email: args.email.toLowerCase()
          });
        }
      },
      updatePerson: {
        type: Person,
        args: {
          values: {
            type: new GraphQLNonNull(JSONType)
          },
          uuid: {
            type: GraphQLString
          },
          personId: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        async resolve (source, args) {
          const {values, uuid, personId} = args;
          const token = await Db.models.token.findOne({where: {uuid: uuid}})
          const user = await Db.models.person.findOne({where: {email: token.uuid}})
          const roles = await user.getRoles();
          for( let role of roles ){
            const permissions = await role.getPermissions();
            for( let permission of permissions ){
              if(permission.object == 'person:id'){
                var person = await Db.models.person.findById(personId);
                //values should prolly not be defined like this but ok...
                person.update(values)

                return person;
              }
            }
            throw new Error('permissions not allowed')
          }
        }
      },
      updatePeople: {
        type: People,
        args: {
          values: {
            type: new GraphQLNonNull(JSONType)
          },
          options: {
            type: new GraphQLNonNull(JSONType)
          }
        },
        resolve (source, args) {
          return Db.models.person.update(
            args.values,
            args.options
          ).spread((count, rows) => {
            return { count: count,
              rows: rows
            }
          })
        }
      },
      deletePeople: {
        type: Count,
        args: {
          options: {
            type: new GraphQLNonNull(JSONType)
          }
        },
        resolve (source, args) {
          return Db.models.person.destroy(args.options)
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
