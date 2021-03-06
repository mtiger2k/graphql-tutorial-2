import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { toIdValue } from 'apollo-utilities';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import logo from './logo.svg';
import NotFound from './components/NotFound';
import ChannelDetails from './components/ChannelDetails';
import ChannelsListWithData from './components/ChannelsListWithData';

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store'
import { ReduxCache } from 'apollo-cache-redux';

import MainApp from './containers/app'

// Styles
// CoreUI Icons Set
import '@coreui/icons/css/coreui-icons.min.css';
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'
//import './App.css';

// Containers
import { DefaultLayout } from './layout';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';

const PORT = 4000;

function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

//const cache = new InMemoryCache({
const cache = new ReduxCache({ store,
  dataIdFromObject,
  cacheResolvers: {
    Query: {
      channel: (_, args) => {
        return toIdValue(
          cache.config.dataIdFromObject({
            __typename: 'Channel',
            id: args.id
          })
        );
      }
    }
  }
});

// Create an http link:
const httpLink = new HttpLink({
  uri: `http://localhost:${PORT}/graphql`
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://localhost:${PORT}/subscriptions`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache
});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <ApolloProvider client={client}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/register" name="Register Page" component={Register} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <Route path="/" name="Home" component={DefaultLayout} />
          </Switch>
        </ConnectedRouter>
      </ApolloProvider>
      </Provider>
    );
  }
}

class App_graphql extends Component {
  render() {
    return (
      <Provider store={store}>
      <ApolloProvider client={client}>
        <ConnectedRouter history={history}>
          <div className="App">
            <Link to="/" className="navbar">
              React + GraphQL Tutorial
            </Link>
            <Switch>
              <Route exact path="/" component={ChannelsListWithData} />
              <Route path="/channel/:channelId" component={ChannelDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </ConnectedRouter>
      </ApolloProvider>
      </Provider>
    );
  }
}

class App_redux extends Component {
  render() {
    return (
        <Provider store={store}>
          <ApolloProvider client={client}>
            <ConnectedRouter history={history}>
              <div>
                <MainApp />
              </div>
            </ConnectedRouter>
          </ApolloProvider>
        </Provider>
    );
  }
}

export default App;
