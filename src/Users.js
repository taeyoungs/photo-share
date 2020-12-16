import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { ROOT_QUERY } from './App';
import { gql } from 'apollo-boost';

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
                <Mutation mutation={ADD_FAKER_USERS_MUTATION} variables={{ count: 1 }} refetchQueries={[{ query: ROOT_QUERY }]}>
                    {(addFakeUsers) => <button onClick={addFakeUsers}>임시 사용자 추가</button>}
                </Mutation>
                <ul>
                    {users.map((user) => (
                        <UserListItem key={user.githubLogin} name={user.name} avatar={user.avatar} />
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <Query query={ROOT_QUERY}>
            {({ data, loading, refetch }) =>
                loading ? <p>사용자 불러오는 중 ...</p> : <UserList count={data.totalUsers} users={data.allUsers} refetchUsers={refetch} />
            }
        </Query>
    );
};

export default User;