import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, Link } from 'react-router-dom';
import SinglePage from './SinglePage';

function App() {

  var [ result, setResult ] = useState([]);

  useEffect(() => {
		axios.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
			.then((res1) => {
        for (let i = 0; i < 10; i++) {

          axios.get('https://hacker-news.firebaseio.com/v0/item/' + res1.data[i] + '.json?print=pretty')
          .then((res2) => {
            var temp = result;
            temp.push(res2.data);
            setResult(temp);
          })
          .catch((err2) => {
            console.log(err2);
          });
        }
        console.log(result);
			})
			.catch((err1) => {
				console.log(err1);
			});
	}, []);



  return (
    <div style={{margin: '0px 10% 0px 10%'}}>
      <div style={{backgroundColor: '#e67832'}}>
        <h1 style={{color: 'white', padding: '20px'}}>Hacker News</h1>
      </div>

      <Routes>
        <Route
        path={"/"}
        element={
          <div>
            {result.map((news, index) => {
            var newsDate = new Date(news.time * 1000);
            var utcString = newsDate.toUTCString();
            return (
              <Link style={{display: 'flex', gap: '20px', textDecoration: 'none', color: 'black'}}
                to={'/' + news.id}
              >
                <h2>{index + 1}.</h2>
                <div>
                  <h2 style={{paddingBottom: '0px', marginBottom: '0px'}}>{news.title}</h2>
                  <p style={{paddingTop: '0px', marginTop: '0px', color: 'grey'}}>{news.score} points by {news.by} at {utcString} {news.hasOwnProperty("kids") && <>| {news.kids.length} comments</>}</p>
                </div>
              </Link>
            );
          })}
          </div>
        }
        >
        </Route>
        {result.map((news, index) => {


          
          return (
            <Route
              path={"/" + news.id}
              key={index}
              element={
                <div>
                  <SinglePage news={news} />
                </div>
              }
            >
            </Route>
          )
        })}
      </Routes>

    </div>
  );
}

export default App;
