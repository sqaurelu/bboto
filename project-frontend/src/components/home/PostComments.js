import React, { useState } from 'react';
import './PostComments.css';
import axios from '../../axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PostComments({ history, name, comment, commentId, commentWriterId }) {

    const user = useSelector(state => state.user);
    const onDeleteComment = () => {
        if (user.userData._id === commentWriterId) {
            axios.post('/board/postComment/delete', { commentId: commentId })
                .then(res => {
                    console.log(res);
                    if (res.data.success) {
                        history.push(`/`);
                    }
                })
        } else {
            alert('다른 사용자의 댓글을 지울 수 없습니다.');
        }

    }
    const [updateComment, setComment] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    const onCommentChange = (e) => {
        setComment(e.target.value);
    }
    // 댓글 수정 여부
    const onIsUpdateComment = () => {
        if (user.userData._id === commentWriterId) {
            setIsUpdate(true);
            setComment(comment);
        }
        else {
            alert('다른 사용자의 댓글을 수정할 수 없습니다.');
        }
    }


    // 댓글 수정 update
    const handleSubmit = (e) => {
        e.preventDefault();

        const commentBody = {
            userId: user.userData._id,
            comment: updateComment
        };

        axios.post('/board/postComment/update', commentBody)
            .then(res => {
                console.log(res);
                if (res.data.success === true) {
                    history.push(`/`);
                }
            });
    }
    return (
        <div className="postComments">
            <div className="postComments__name">{name}</div>
            {isUpdate ?
                <>
                    <div className="postComment">
                        <form>
                            <input
                                className="postComment__input"
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
                    <button className="postComments__delete" onClick={onDeleteComment}>삭제</button>
                    <button className="postComments__update" onClick={onIsUpdateComment}>수정</button>
                </>
            }
        </div>
    )
}

export default withRouter(PostComments);
