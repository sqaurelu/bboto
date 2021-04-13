import React, { useState } from 'react';
import './BoardComments.css';
import axios from '../../../axios';
import { withRouter } from 'react-router-dom';

function BoardComments({ history, name, comment, commentId, boardId, userId, commentWriterId }) {
    const onDeleteComment = () => {
        if (userId === commentWriterId) {
            axios.post('/board/boardComment/delete', { commentId: commentId })
                .then(res => {
                    console.log(res);
                    if (res.data.success) {
                        history.push(`/withboard/${boardId}`);
                    }
                });
        }
        else {
            alert('다른 사용자의 댓글을 지울 수 없습니다.');
        }
    }

    const [updateComment, setUpdateComment] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    const onCommentChange = (e) => {
        setUpdateComment(e.target.value);
    }

    // 댓글 수정 여부
    const onIsUpdateComment = () => {
        if (userId === commentWriterId) {
            setIsUpdate(true);
            setUpdateComment(comment);
        }
        else {
            alert('다른 사용자의 댓글을 수정할 수 없습니다.');
        }
    }

    // 댓글 수정 update
    const handleSubmit = (e) => {
        e.preventDefault();

        const commentBody = {
            userId: userId,
            boardId: boardId,
            comment: updateComment
        };

        axios.post('/board/boardComment/update', commentBody)
            .then(res => {
                console.log(res);
                if (res.data.success === true) {
                    history.push(`/withboard/${boardId}`);
                }
            });
    }

    return (
        <div className="boardComments">
            <div className="boardComments__name">{name}</div>
            {isUpdate ?
                <>
                    <div className="boardComment">
                        <form>
                            <input
                                className="boardComment__input"
                                value={updateComment}
                                onChange={onCommentChange}
                            />
                            <button onClick={handleSubmit} type="submit">
                                Comment
                        </button>
                        </form>
                    </div>
                </>
                :
                <>
                    <div>{comment}</div>
                    <button className="boardComments__delete" onClick={onDeleteComment}>삭제</button>
                    <button className="boardComments__update" onClick={onIsUpdateComment}>수정</button>
                </>
            }
        </div>
    )
}

export default withRouter(BoardComments);
