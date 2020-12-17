import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery, useApolloClient, gql } from '@apollo/client';
import { ROOT_QUERY } from './App';
// import { useQuery, useMutation } from '@apollo/client';

const GITHUB_AUTH_MUTATION = gql`
    mutation githubAuth($code: String!) {
        githubAuth(code: $code) {
            token
        }
    }
`;

const AuthorizedUser = () => {
    const [signingIn, setSigningIn] = useState(false);
    const history = useHistory();
    const client = useApolloClient();
    const [githubAuthMutation] = useMutation(GITHUB_AUTH_MUTATION, {
        update(cache, { data }) {
            localStorage.setItem('token', data.githubAuth.token);
            history.replace('/');
            setSigningIn(false);
        },
        refetchQueries: [{ query: ROOT_QUERY }],
    });
    const { loading, data } = useQuery(ROOT_QUERY);

    useEffect(() => {
        if (window.location.search.match(/code=/)) {
            setSigningIn(true);
            const code = window.location.search.replace('?code=', '');
            githubAuthMutation({ variables: { code } });
        }
    }, []);

    const requestCode = () => {
        const clientID = '5a0e37336fd58ec70ac8';
        window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
    };

    const logout = () => {
        localStorage.removeItem('token');
        client.writeQuery({ query: ROOT_QUERY, data: { me: null } });
    };

    const CurrentUser = ({ name, avatar, logout }) => {
        return (
            <div>
                <img src={avatar} width={48} height={48} alt="" />
                <h1>{name}</h1>
                <button onClick={logout}>로그아웃</button>
            </div>
        );
    };

    const Me = () => {
        return (
            <>
                {loading ? (
                    <p>loading ...</p>
                ) : data && data.me ? (
                    <CurrentUser {...data.me} logout={logout} />
                ) : (
                    <button onClick={requestCode} disabled={signingIn}>
                        깃허브로 로그인
                    </button>
                )}
            </>
        );
    };

    return <Me />;
};

export default AuthorizedUser;
