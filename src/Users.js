import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { ROOT_QUERY } from './App';
import UserList from './UserList';

const ADD_FAKER_USERS_MUTATION = gql`
    mutation addFakeUsers($count: Int!) {
        addFakeUsers(count: $count) {
            githubLogin
            name
            avatar
        }
    }
`;

const LISTEN_FOR_USERS = gql`
    subscription {
        newUser {
            githubLogin
            name
            avatar
        }
    }
`;

const User = () => {
    const { loading, data, refetch, subscribeToMore } = useQuery(ROOT_QUERY);
    const [addFakeUsers] = useMutation(ADD_FAKER_USERS_MUTATION, {
        variables: { count: 1 },
    });

    return loading ? (
        <p>사용자 불러오는 중 ...</p>
    ) : (
        <UserList
            count={data.totalUsers}
            users={data.allUsers}
            refetchUsers={refetch}
            addFakeUsers={addFakeUsers}
            subscribeToNewUsers={() =>
                subscribeToMore({
                    document: LISTEN_FOR_USERS,
                    updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        const newUser = subscriptionData.data.newUser;
                        return Object.assign({}, prev, {
                            totalUsers: prev.totalUsers + 1,
                            allUsers: [...prev.allUsers, newUser],
                        });
                    },
                })
            }
        />
    );
};

export default User;
