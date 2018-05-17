import { merge } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import { 
  schema as Channel, 
  resolvers as channelResolvers,
} from './channel.js';

import { 
  schema as User, 
  resolvers as userResolvers,
} from './user.js';

const Query = `
  type Query {
  	_empty: String
  }
`;

const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [ Query, Channel, User ],
  resolvers: merge(resolvers, channelResolvers, userResolvers),
});

export default schema;