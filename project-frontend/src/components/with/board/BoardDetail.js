import React, { useState, useEffect } from 'react';
import axios from '../../../axios';
import './BoardDetail.css';
import BoardComments from './BoardComments';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

function BoardDetail(props) {
    const user = useSelector(state => state.user);
    const boardId = props.match.params.id;

    const [board, setBoard] = useState([]);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [updateBoardPost, setUpdateBoardPost] = useState({
        title: '',
        description: ''
    });
    const [isUpdate, setIsUpdate] = useState(false);

    const onCommentChange = (e) => {
        setComment(e.target.value);
    }

    useEffect(() => {
        const boardBody = { boardId: boardId };
        axios.post('/board/getDetail', boardBody)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data);
                    setBoard(res.data.board)
                } else {
                    alert('포스트 데이터를 가져올 수 없습니다.');
                }
            });

        axios.post('/board/getboardComment', boardBody)
            .then(res => {
                console.log(res);
                setComments(res.data.boardComments);
            });
    }, [boardId]);

    // 댓글 submit
    const onCommentSubmit = (e) => {
        e.preventDefault();

        const commentBody = {
            userId: user.userData._id,
            boardId: boardId,
            comment: comment
        };

        axios.post('/board/boardComment', commentBody)
            .then(res => {
                console.log(res);
                if (res.data.success === true) {
                    props.history.push(`/withboard/${boardId}`);
                }
            });
    }

    // 글 삭제
    const onDeleteBoardPost = () => {
        if (user.userData._id === board.writer._id) {
            axios.post('/board/getDetail/delete', { boardId: boardId })
                .then(res => {
                    console.log(res);
                    if (res.data.success) {
                        props.history.push(`/with`);
                    }
                });
        }
        else {
            alert('다른 사용자의 글을 지울 수 없습니다.');
        }
    }

    // 글 수정 여부
    const onIsUpdateBoardPost = () => {
        if (user.userData._id === board.writer._id) {
            setIsUpdate(true);
            setUpdateBoardPost({
                title: board.title,
                description: board.description
            });
        }
        else {
            alert('다른 사용자의 글을 수정할 수 없습니다.');
        }
    }

    const onBoardPostChange = (e) => {
        const { value, name } = e.target;
        setUpdateBoardPost({
            ...updateBoardPost,
            [name]: value
        });
    }


    // 글 수정 update
    const onBoardPostSubmit = (e) => {
        e.preventDefault();

        console.log('여기여기');

        const commentBody = {
            boardId: boardId,
            title: updateBoardPost.title,
            description: updateBoardPost.description
        };

        console.log(commentBody);
        console.log(updateBoardPost);

        axios.post('/board/getDetail/update', commentBody)
            .then(res => {
                console.log(res);
                if (res.data.success === true) {
                    props.history.push(`/withboard/${boardId}`);
                }
            });
    }

    return (
        <div className="boardDetail">
            <div className="boarderDetail__box">
                {isUpdate ?
                    <>
                        <form onSubmit={onBoardPostSubmit} >
                            <input
                                type="text"
                                name="title"
                                className="board__title"
                                value={updateBoardPost.title}
                                onChange={onBoardPostChange}
                            />
                            <textarea
                                type="text"
                                name="description"
                                className="board__content"
                                value={updateBoardPost.description}
                                onChange={onBoardPostChange}
                            />
                            <div className="board__buttons">
                                <button onSubmit={onBoardPostSubmit} className="board__button">글 작성하기</button>
                            </div>
                        </form>
                    </>
                    :
                    <>
                        <h1 className="boardDetail__title">{board.title}</h1>
                        <div className="boardDetail__button">
                            <button className="board__delete" onClick={onDeleteBoardPost}>삭제</button>
                            <button className="board__update" onClick={onIsUpdateBoardPost}>수정</button>
                        </div>
                        <p className="boardDetail__description">{board.description}</p>
                        <div className="boardComment">
                            <form>
                                <label className="boardComment__label" >댓글</label>
                                <input
                                    className="boardComments__input"
                                    value={comment}
                                    onChange={onCommentChange}
                                />
                                <button onClick={onCommentSubmit} type="submit">
                                    Comment
                        </button>
                            </form>
                        </div>
                        <br />
                        {comments.map((comment, i) => {
                            return <BoardComments
                                name={comment.writer.name}
                                comment={comment.comment}
                                key={i}
                                commentId={comment._id}
                                boardId={boardId}
                                userId={user.userData._id}
                                commentWriterId={comment.writer._id} />
                        })
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default withRouter(BoardDetail);