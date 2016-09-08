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
      person: {
        type: Person,
        resolve (travel) {
          return travel.getPerson();
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
          }
        },
        resolve (person, args) {
          return person.getTravels(args);
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
        },
        resolve (root, args) {
          return Db.models.person.findAll(args);
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
        },
        resolve (root, args) {
          return Db.models.travel.findAll(args);
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
          travelId: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        async resolve (source, args) {
          const {email, travelId} = args;
          const travel = await Db.models.travel.findById(travelId);
          const person = await travel.getPerson({where: {email: email}});
          return Db.models.token.create({
            uuid: person.email
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
