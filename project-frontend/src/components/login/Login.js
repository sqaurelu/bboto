import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../modules/user';
import { withRouter } from 'react-router-dom';
import './Login.css';

function LoginTemp(props) {

    const dispatch = useDispatch();

    const [login, setLogin] = useState({
        email: '',
        password: '',
    });

    const { email, password } = login;

    const onChange = e => {
        const { value, name } = e.target;
        setLogin({
            ...login,
            [name]: value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(login.email);
        console.log(login.password);

        const body = {
            email: login.email,
            password: login.password
        }

        dispatch(loginUser(body))
            .then(res => {
                if (res.payload.loginSuccess) {
                    props.history.push('/');
                }
                else {
                    alert('Error');
                }
            });
    }

    return (
        <div className="login">
            <form className="login__form" onSubmit={onSubmit}>
                <input
                    placeholder="email"
                    name="email"
                    type="email"
                    onChange={onChange}
                    value={email}
                />

                <input
                    placeholder="password"
                    name="password"
                    type="password"
                    onChange={onChange}
                    value={password}
                />

                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default withRouter(LoginTemp);
