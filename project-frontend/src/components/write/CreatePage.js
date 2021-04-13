import React, { useState } from 'react';
import axios from '../../axios';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './CreatePage.css';

function CreatePage(props) {
    const user = useSelector(state => state.user);

    const [content, setContent] = useState({
        title: '',
        description: '',
        site: ''
    });

    const [photos, setPhotos] = useState([]);

    const { title, description, site } = content;

    const onContentsChange = (e) => {
        const { value, name } = e.target;
        setContent({
            ...content,
            [name]: value
        });
    };

    const onSelectSite = e => {
        console.log(e.target.value);
        setContent({
            ...content,
            site: e.target.value
        });
    }

    const onUploadPhoto = (e) => {
        const file = e.target.files[0];
        console.log(file);

        setPhotos({
            ...photos, file
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const file_ = photos.file;
        console.log(file_);

        const formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", file_);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("userId", user.userData._id);
        formData.append("site", site);

        axios.post('/createPost', formData, config)
            .then(res => {
                console.log(res);
                if (res.data.success === true) {
                    props.history.push('/');
                }
            });
    }
    return (
        <div className="write">
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    className="write__title"
                    placeholder="타이틀"
                    name="title"
                    onChange={onContentsChange}
                    value={title}
                    required
                />
                <div className="photo__site">
                    <label>출사 장소: </label>
                    <select
                        className="select__site"
                        onChange={onSelectSite}
                        value={site}
                        required
                    >
                        <option value="">선택</option>
                        <option value="seoul">서울</option>
                        <option value="gg">경기</option>
                        <option value="gw">강원</option>
                        <option value="dj">대전</option>
                        <option value="dg">대구</option>
                        <option value="gn">경남</option>
                        <option value="busan">부산</option>
                        <option value="jeju">제주</option>
                    </select>

                    <input type="file" onChange={onUploadPhoto} required />
                </div>
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

export default withRouter(CreatePage);
