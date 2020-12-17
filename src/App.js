import React, { useEffect, useState } from 'react';
import User from './Users';
import { BrowserRouter } from 'react-router-dom';
import { HttpLink, ApolloClient, InMemoryCache, ApolloProvider, gql, ApolloLink, concat } from '@apollo/client';
import { usePersistCache } from './hooks';
import AuthorizedUser from './AuthorizedUser';

export const ROOT_QUERY = gql`
    query allUsers {
        totalUsers
        allUsers {
            ...userInfo
        }
        me {
            ...userInfo
        }
    }
    fragment userInfo on User {
        githubLogin
        name
        avatar
    }
`;

const App = () => {
    const [client, setClient] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { callback } = usePersistCache();
    useEffect(() => {
        const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });
        const authMiddleware = new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: {
                    authorization: localStorage.getItem('token') || null,
                },
            });

            return forward(operation);
        });
        const cache = new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        allUsers: {
                            merge(existing = [], incoming) {
                                return [...incoming];
                            },
                        },
                    },
                },
            },
        });
        const client = new ApolloClient({
            cache,
            link: concat(authMiddleware, httpLink),
        });
        callback(cache);
        setClient(client);
        setLoaded(true);
    }, []);
    return loaded ? (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <div>
                    <User />
                    <AuthorizedUser />
                </div>
            </BrowserRouter>
        </ApolloProvider>
    ) : (
        <div>loading ...</div>
    );
};

export default App;
