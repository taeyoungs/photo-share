import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { ROOT_QUERY } from './App';

const ADD_FAKER_USERS_MUTATION = gql`
    mutation addFakeUsers($count: Int!) {
        addFakeUsers(count: $count) {
            githubLogin
            name
            avatar
        }
    }
`;

const User = () => {
    const { loading, data, refetch } = useQuery(ROOT_QUERY);
    const [addFakeUsers] = useMutation(ADD_FAKER_USERS_MUTATION, {
        variables: { count: 1 },
        update(cache, { data: { addFakeUsers } }) {
            let data = cache.readQuery({ query: ROOT_QUERY });
            cache.writeQuery({
                query: ROOT_QUERY,
                data: {
                    allUsers: [...data.allUsers, ...addFakeUsers],
                    totalUsers: data.totalUsers + 1,
                },
            });
        },
    });

    const UserListItem = ({ name, avatar }) => {
        return (
            <li>
                <img alt="avatar" src={avatar} width={48} height={48} />
                {name}
            </li>
        );
    };

    const UserList = ({ count, users, refetchUsers }) => {
        return (
            <div>
                <p>{count} Users</p>
                <button onClick={() => refetchUsers()}>다시 가져오기</button>
                <button onClick={addFakeUsers}>임시 사용자 추가</button>
                <ul>
                    {users.map((user) => (
                        <UserListItem key={user.githubLogin} name={user.name} avatar={user.avatar} />
                    ))}
                </ul>
            </div>
        );
    };

    return loading ? <p>사용자 불러오는 중 ...</p> : <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />;
};

export default User;
