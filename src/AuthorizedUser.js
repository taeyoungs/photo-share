import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useMutation } from 'react-apollo';
import { ROOT_QUERY } from './App';

const GITHUB_AUTH_MUTATION = gql`
    mutation githubAuth($code: String!) {
        githubAuth(code: $code) {
            token
        }
    }
`;

const AuthorizedUser = (props) => {
    const [signingIn, setSigningIn] = useState(false);
    const { history } = props;
    const [githubAuthMutation] = useMutation(GITHUB_AUTH_MUTATION, {
        update(cache, { data }) {
            localStorage.setItem('token', data.githubAuth.token);
            history.replace('/');
            setSigningIn(false);
        },
        refetchQueries: [{ query: ROOT_QUERY }],
    });
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

    return (
        <button onClick={requestCode} disabled={signingIn}>
            깃허브로 로그인
        </button>
    );
};

export default withRouter(AuthorizedUser);
