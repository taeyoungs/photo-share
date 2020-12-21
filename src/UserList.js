import React, { useEffect } from 'react';

const UserList = ({ count, users, refetchUsers, subscribeToNewUsers, addFakeUsers }) => {
    useEffect(() => {
        subscribeToNewUsers();
    }, []);

    const UserListItem = ({ name, avatar }) => {
        return (
            <li>
                <img alt="avatar" src={avatar} width={48} height={48} />
                {name}
            </li>
        );
    };

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

export default UserList;
