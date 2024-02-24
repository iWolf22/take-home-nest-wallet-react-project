import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SinglePage(props) {

    var news = props.news;

    var newsDate = new Date(news.time * 1000);
    var utcString = newsDate.toUTCString();

    var [ result, setResult ] = useState([]);

    useEffect(() => {

        for (let i = 0; i < 10; i++) {
            axios.get('https://hacker-news.firebaseio.com/v0/item/' + news.kids[i] + '.json?print=pretty')
            .then((res) => {
                var temp = {result: res.data, depth: 0};
                result.push(temp);
                setResult(result);
                if (res.data.hasOwnProperty("kids")) {
                    for (let i = 0; i < res.data.kids.length; i++) {
                        recursive_kids(res.data.kids[i], 1);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }

        console.log(result);
	}, []);

    function recursive_kids(kid, depth) {
        axios.get('https://hacker-news.firebaseio.com/v0/item/' + kid + '.json?print=pretty')
        .then((res) => {
            var temp = {result: res.data, depth: depth + 1};
            result.push(temp);
            setResult(result);
            if (res.data.hasOwnProperty("kids")) {
                for (let i = 0; i < res.data.kids.length; i++) {
                    recursive_kids(res.data.kids[i], depth + 1);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <div>
            <h2 style={{paddingBottom: '0px', marginBottom: '0px'}}>{news.title}</h2>
            <p style={{paddingTop: '0px', marginTop: '0px', color: 'grey'}}>{news.score} points by {news.by} at {utcString} | {news.kids.length} comments</p>

            {result.map((comment, index) => {
                var commentDate = new Date(comment.result.time * 1000);
                var utcString = commentDate.toUTCString();

                return (
                    <div style={{paddingLeft: `${comment.depth * 50}px`}}>
                        <h5 style={{color: 'grey', paddingBottom: '0px', marginBottom: '0px'}}>{comment.result.by} - {utcString}</h5>
                        <p style={{paddingTop: '0px', marginTop: '0px'}}>{comment.result.text}</p>
                    </div>
                );
          })}
        </div>
    );
}

export default SinglePage;
