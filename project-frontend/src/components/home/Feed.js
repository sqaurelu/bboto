import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import './Feed.css';
import { useSelector } from 'react-redux';
import Post from './Post';

function Feed() {
    const user = useSelector(state => state.user);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/postList')
            .then(res => {
                if (res.data.success) {
                    setPosts(res.data.posts);
                } else {
                    alert('DB에서 post를 불러올 수 없음.');
                }
            });
    }, []);
    return (
        <div className="feed">
            {posts.map((post, i) => {
                return <Post
                    className="feed__post"
                    name={post.writer.name}
                    email={post.writer.email}
                    title={post.title}
                    createdDate={post.createdAt}
                    description={post.description}
                    writerId={post.writer._id}
                    uploadImage={post.upload.data}
                    key={i}
                    postId={post._id}
                    userId={user.userData._id}
                    commentWriterId={post.writer._id}
                />
            })}
        </div>
    )
}

export default Feed;
