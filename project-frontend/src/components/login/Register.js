import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../modules/user';
import { withRouter } from 'react-router-dom';

import './Register.css'

function Register(props) {
    const dispatch = useDispatch();

    const [register, setRegister] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });

    const { email, password, name, confirmPassword } = register;

    const onChange = e => {
        const { value, name } = e.target;
        setRegister({
            ...register,
            [name]: value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(register.email);
        console.log(register.password);

        if (password !== confirmPassword) {
            return alert('비밀번호 달라달라~~');
        }

        const body = {
            email: register.email,
            password: register.password,
            name: register.name,
            confirmPassword: register.confirmPassword
        }

        dispatch(registerUser(body))
            .then(res => {
                if (res.payload.success) {
                    props.history.push('/login');
                }
                else {
                    alert('회원가입 실패');
                }
            });
    }

    return (
        <div className="register">
            <form className="register__form" onSubmit={onSubmit}>
                <label>이메일</label>
                <input
                    placeholder="email"
                    name="email"
                    type="email"
                    onChange={onChange}
                    value={email}
                />
                <label>이름</label>
                <input
                    placeholder="name"
                    name="name"
                    type="text"
                    onChange={onChange}
                    value={name}
                />
                <label>비밀번호</label>
                <input
                    placeholder="password"
                    name="password"
                    type="password"
                    onChange={onChange}
                    value={password}
                />
                <label>비밀번호 확인</label>
                <input
                    placeholder="password check"
                    name="confirmPassword"
                    type="password"
                    onChange={onChange}
                    value={confirmPassword}
                />

                <br />
                <button type="submit">회원가입</button>
            </form>
        </div>
    )
}

export default withRouter(Register);
