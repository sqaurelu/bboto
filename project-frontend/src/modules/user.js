import axios from '../axios';

// action type
const LOGIN_USER = 'LOGIN_USER';
const REGISTER_USER = 'REGISTER_USER';
const AUTH_USER = 'AUTH_USER';

// action 생성함수
export function loginUser(data) {
    const req = axios.post('/login', data, { withCredentials: true })
        .then(res => res.data);
    return ({ type: LOGIN_USER, payload: req });
};

export function registerUser(data) {
    const req = axios.post('/register', data, { withCredentials: true })
        .then(res => res.data);

    return ({ type: REGISTER_USER, payload: req });
}

export function auth() {
    const req = axios.get('/auth', { withCredentials: true })
        .then(res => res.data);

    return ({ type: AUTH_USER, payload: req });
}

// reducer에서 관리할 초기 상태
const initialState = {

};

// reducer
export default function user(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                loginSuccess: action.payload
            }
        case REGISTER_USER:
            return {
                ...state,
                register: action.payload
            }
        case AUTH_USER:
            return {
                ...state,
                userData: action.payload
            }
        default:
            return state;
    }
}