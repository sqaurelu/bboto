import React from 'react';
import { NavLink, withRouter } from 'react-router-dom'; // 특정 주소에 특정 component를 보여주겠다.
import axios from '../../axios';

import './Header.css';

function Header(props) {

    const onClick = () => {
        axios.get(`/logout`, { withCredentials: true })
            .then(res => {
                // alert(userInfo.id);
                if (res.data.success) {
                    props.history.push('/login');
                } else {
                    alert('로그아웃 실패,,');
                }
            });
    }

    return (
        <div className="header">
            <NavLink to="/" className="header__item">📷뽀또📸</NavLink>
            <NavLink to="/write" className="header__item" activeClassName="item--active">게시글 작성</NavLink>
            <NavLink to="/find" className="header__item" activeClassName="item--active">지역별 출사지</NavLink>
            <NavLink to="/with" className="header__item" activeClassName="item--active">같이가요</NavLink>
            <NavLink to="/login" className="header__item" activeClassName="item--active">로그인</NavLink>
            <NavLink to="/register" className="header__item" activeClassName="item--active">회원가입</NavLink>
            {/* <NavLink to="/with/board" className="header__item" activeClassName="item--active">ㅇㅇㅇ</NavLink> */}
            <button className="header__item" onClick={onClick}>로그아웃</button>
            {/* <Logout userInfo={userInfo} onClick={onClick} /> */}
        </div>
    )
}

export default withRouter(Header);