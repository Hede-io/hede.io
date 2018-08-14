import React from 'react';
import CategoryIcon from './CategoriesIcons';
import Action from './Button/Action';

const AcceptRules = ({acceptRules}) => (
  <Action
    className="accept-rules-btn"
    primary
    text={'I understand. Proceed'}
    onClick={e => {
      e.preventDefault();
      acceptRules();
    }}
  />
);


export const Rules = ({type, acceptRules, inEditor}) => {
  switch(type) {

    case 'entry':
    return (
      <div className="Editor__rules">
        <h2><CategoryIcon from="from-rules"  type="entry"/> Entry Rules</h2>
        {inEditor ? <p><small><a href="https://hede.io/rules" target="_blank"></a></small></p> : null}
        <ul>
          <li>✅ Please describe the topic in the first sentence.</li>
          <li>✅ Please share your personal knowledge directly about the topic.</li>
          <li>✅ Write for a large audience. Lots of people will read this so give background information.</li>
          <li>🚫 Don't duplicate another entry's content if you will not add more value into it.</li>
          <li>🚫 Don't respond or comment to another user's entry in your's. To do so, open that entry and write your comment under it.</li>
          <li>🚫 Don't ask questions or request information in the entry.</li>
          <li>🚫 Don't describe sub-topics in long. Instead, add a link to that topic.</li>


        </ul>
        <p>Not respecting the guidelines might result in lower votes.</p>
        {inEditor ? <AcceptRules acceptRules={acceptRules} />  : null}
      </div>
    )
   
  }
};
