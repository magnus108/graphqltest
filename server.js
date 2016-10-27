import Express from 'express';
import GraphHTTP from 'express-graphql';
import Cors from 'cors';
import Schema from './schema';

const APP_PORT = 3000;

const app = Express();

app.use(Cors({origin: true, credentials: true, maxAge: 86400}));

app.use('/graphql', GraphHTTP({
  schema: Schema,
  graphiql: true
}));

app.listen(APP_PORT, ()=> {
  console.log(`App listening on port ${APP_PORT}`);
});
