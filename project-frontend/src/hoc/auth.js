import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../modules/user';

export default function Auth(SpecificComponent, option, adminRoute = null) {

    function AuthenticatioinCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(res => {
                if (!res.payload.isAuth) {
                    if (option) {
                        props.history.push('/');
                    }
                } else {
                    if (option === false) {
                        props.history.push('/');
                    }
                }
            })
        });

        return (
            <SpecificComponent />
        )
    }

    return AuthenticatioinCheck;
}