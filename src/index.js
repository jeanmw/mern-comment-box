import React from 'react';
import ReactDOM from 'react-dom';
import CommentBox from './CommentBox';

ReactDOM.render(
  <CommentBox
    url='/api/commments'
    pollInterval={2000} />,
  document.getElementById('root')
);
