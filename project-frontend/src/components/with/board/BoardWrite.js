import React, { useState } from 'react';
import axios from '../../../axios';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './BoardWrite.css'

function BoardWrite(props) {

    const user = useSelector(state => state.user);
    const [content, setContent] = useState({
        title: '',
        description: ''
    });

    const { title, description } = content;

    const onContentsChange = (e) => {
        const { value, name } = e.target;
        setContent({
            ...content,
            [name]: value
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const body = {
            userId: user.userData._id,
            title: title,
            description: description,
        }

        axios.post('/boardUpload', body)
            .then(res => {
                console.log(res);
                if (res.data.success === true) {
                    props.history.push('/with');
                }
            })
    }

    return (
        <div className="BoardWrite">
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    className="write__title"
                    placeholder="타이틀"
                    name="title"
                    onChange={onContentsChange}
                    value={title}
                />
                <textarea
                    className="write__content"
                    placeholder="본문 내용"
                    name="description"
                    onChange={onContentsChange}
                    value={description}
                />
                <div className="write__buttons">
                    <button onSubmit={onSubmit} className="write__button">글 작성하기</button>
                </div>
            </form>
        </div>
    )
}

export default withRouter(BoardWrite);
