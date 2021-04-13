import React from 'react';
import './Filter.css';
import { Link } from 'react-router-dom';

function Filter() {
    return (
        <div className="filter">
            <h1>원하는 지역을 골라주세요</h1>
            <div className="filter__cities_1">
                <Link to="/findCity/seoul" className="filter__city">
                    <div>서울</div>
                </Link>
                <Link to="/findCity/gg" className="filter__city">
                    <div>경기</div>
                </Link>
                <Link to="/findCity/gw" className="filter__city">
                    <div>강원</div>
                </Link>
                <Link to="/findCity/dj" className="filter__city">
                    <div>대전</div>
                </Link>
            </div>
            <div className="filter__cities_2">
                <Link to="/findCity/dg" className="filter__city">
                    <div>대구</div>
                </Link>
                <Link to="/findCity/gn" className="filter__city">
                    <div>경남</div>
                </Link>
                <Link to="/findCity/busan" className="filter__city">
                    <div>부산</div>
                </Link>
                <Link to="/findCity/jeju" className="filter__city">
                    <div>제주</div>
                </Link>
            </div>
        </div>
    );
}

export default Filter;