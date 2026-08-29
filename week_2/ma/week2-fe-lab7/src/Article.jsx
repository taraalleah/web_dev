// Article.jsx
import React from 'react';

function Article(props) {
  return (
    <article>
      <h3>{props.title}</h3>
      <p>{props.text}</p>
    </article>
  );
}

export default Article;