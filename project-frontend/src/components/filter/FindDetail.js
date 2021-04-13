import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { withRouter } from 'react-router-dom';
import './FindDetail.css';


function FindDetail(props) {
    const sendCity = props.match.params.city;
    let city = '';

    if (sendCity === 'seoul') city = '서울';
    else if (sendCity === 'gg') city = '경기';
    else if (sendCity === 'gw') city = '강원';
    else if (sendCity === 'dj') city = '대전';
    else if (sendCity === 'dg') city = '대구';
    else if (sendCity === 'gn') city = '경남';
    else if (sendCity === 'busan') city = '부산';
    else if (sendCity === 'jeju') city = '제주';

    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        await axios.post('/filteredPost', { site: sendCity })
            .then(res => {
                if (res.data.success) {
                    console.log(res.data);
                    setPosts(res.data.filteredPost);

                } else {
                    alert('DB에서 post를 불러올 수 없음.');
                }
            });
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="findDetail">
            <h2>{city}</h2>
            <div className="findDetail__element">
                {posts.length ? posts.map((post, i) => {
                    return <div className="findDetail__post" key={i}>
                        <img src={`data:image/jpg;base64,${Buffer.from(post.upload.data).toString('base64')}`} alt="ddd" />
                        <div>{post.writer.name}</div>
                    </div>
                }) : <div className="findDetail__none">없어용 ㅠ,ㅠ</div>}
            </div>
        </div>
    )
}

export default withRouter(FindDetail);