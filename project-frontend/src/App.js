import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom'; // 특정 주소에 특정 component를 보여주겠다.

import Home from './components/home/Home';
import Filter from './components/filter/Filter';
import With from './components/with/With';
import Header from './components/header/Header';
import Login from './components/login/Login';
import Register from './components/login/Register';
import CreatePage from './components/write/CreatePage';
import BoardWrite from './components/with/board/BoardWrite';
import BoardDetail from './components/with/board/BoardDetail';
import FindDetail from './components/filter/FindDetail';

import Auth from './hoc/auth';

function App() {

  return (
    <div className="app">
      <Header />
      <Switch>
        <Route path="/" component={Auth(Home, null)} exact />
        <Route path="/write" component={Auth(CreatePage, true)} />
        <Route path="/find" component={Auth(Filter, true)} />
        <Route path="/findCity/:city" component={Auth(FindDetail, true)} />
        <Route path="/with" component={Auth(With, true)} />
        <Route path="/login" component={Auth(Login, false)} />
        <Route path="/register" component={Auth(Register, false)} />
        <Route path="/board" component={Auth(BoardWrite, true)} />
        <Route path="/withboard/:id" component={Auth(BoardDetail, true)} />
        <Route render={({ location }) => <div>
          <h2>이 페이지는 존재하지 않습니다.</h2>
          <p>{location.pathname}</p></div>} />
      </Switch>
    </div >
  )
}

export default withRouter(App);