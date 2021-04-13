import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import './With.css';
import { Link } from 'react-router-dom';

function With() {

    const [boards, setBoards] = useState([]);

    useEffect(() => {
        axios.get('/boardList')
            .then(res => {
                if (res.data.success) {
                    console.log(res);
                    setBoards(res.data.boards);
                } else {
                    alert('DB에서 post를 불러올 수 없음.');
                }
            });
    }, []);

    const boardList = boards.map((board, i) => {
        return (
            <div className="boardList" key={i}>
                <div className="boardList__name">{board.writer.name}</div>
                <div className="boardList__title"><Link to={`/withboard/${board._id}`} style={{ all: 'unset' }}>{board.title}</Link></div>
                <div className="boardList__date">{board.createdAt.substring(0, 10)}</div>
            </div>
        )
    })
    return (
        <div className="with">
            <div className="with__div">
                <div className="boardList__head">
                    <div className="boardList__head__name">작성자</div>
                    <div className="boardList__head__title">제목</div>
                    <div className="boardList__head__date">날짜</div>
                </div>
                {boardList}
            </div>
            <div className="with__write">
                <Link to="/board" style={{ all: 'unset', color: 'black' }}>글 작성하기</Link>
            </div>
        </div>
    );
}
export default With;