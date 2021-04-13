import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostComments from './PostComments';
import './Post.css';


function Post({ history, name, email, title, createdDate, description, writerId, uploadImage, postId }) {

    const user = useSelector(state => state.user);

    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const onCommentChange = (e) => {
        setComment(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const commentBody = {
            userId: user.userData._id,
            postId: postId,
            comment: comment
        };

        axios.post('/postList/postComment', commentBody)
            .then(res => {
                console.log(res);
                if (res.data.success === true) {
                    console.log(res.data);
                    history.push('/');
                }
            });
        setComment('');
    }

    useEffect(() => {
        const postBody = { postId: postId };
        axios.post('/postList/getPostComment', postBody)
            .then(res => {
                if (res.data.success) {
                    setComments(res.data.postComments)
                } else {
                    alert('포스트 데이터를 가져올 수 없습니다.');
                }
            });
    }, [postId]);

    // 글 삭제
    const onDeletePost = () => {
        if (user.userData._id === writerId) {
            axios.post('/postList/delete', { postId: postId })
                .then(res => {
                    console.log(res);
                    if (res.data.success) {
                        history.push(`/`);
                    }
                });
        }
        else {
            alert('다른 사용자의 글을 지울 수 없습니다.');
        }
    }

    return (
        <div className="post__body">
            <div className="post__info">
                <div className="post__title"> {title} </div>
                <div className="post__user">{name}({email})</div>
                <div className="post__createdDate">{createdDate.substring(0, 10)}</div>
            </div>
            <div className="post__img">
                <img src={`data:image/jpg;base64,${Buffer.from(uploadImage).toString('base64')}`} alt="ddd" />
            </div>

            <p>{description}</p>
            <div>
                <button className="post__delete" onClick={onDeletePost}>삭제</button>
            </div>
            <div className="postComment">
                <form>
                    <label className="postComment__label" >댓글</label>
                    <input
                        className="postComment__input"
                        value={comment}
                        onChange={onCommentChange}
                    />
                    <button onClick={handleSubmit} type="submit">
                        Comment
                    </button>
                </form>
            </div>
            {comments.map((comment, i) => {
                return <PostComments
                    name={comment.writer.name}
                    comment={comment.comment}
                    key={i}
                    commentId={comment._id}
                    commentWriterId={comment.writer._id}
                />
            })
            }
        </div>
    );
}

export default withRouter(Post);
