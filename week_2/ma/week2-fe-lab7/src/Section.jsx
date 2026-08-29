// Section.jsx
import React from 'react';

function Section(props) {
  return (
    <section>
      <h2>{props.heading}</h2>
      <p>{props.content}</p>
    </section>
  );
}

export default Section;