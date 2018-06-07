import React from 'react';
import {sc2} from '../sc2';

import './Help.less';

export default (props) =>
  (<div className="main-panel help-section">
    <div className="container text-center my-5">
      {props.mustAuthenticate && <div
        className="MustLogin"
      >
        You must login to access that page. <a href={sc2.getLoginURL(window.location.pathname.length > 1 ? window.location.pathname : '')}>Log in</a>
        {' '}
        or <a target="_blank" rel="noopener noreferrer" href="https://steemit.com/pick_account">Sign up with Steemit</a>
      </div>
      }

      <h2 id="utopian">
        What is Hede?
      </h2>
      <p>
        Hede rewards Open Source contributors by allowing them to create <b>Contributor Reports</b>. The Contributor
        Reports are voted by the Hede community members. The contributor receives <a href="https://steem.io" target="_blank"> Steem </a>
        cryptocurrency as a reward based on the amount of votes received and the impact of each single vote (rank of the
        voting user in the platform). Hede uses the <a href="https://steem.io" target="_blank">Steem</a> blockchain
        to store, retrieve data and to reward its community members.
      </p>
      <h2 id="steem">
        What is Steem?
      </h2>
      <p>
        <a href="https://steemit.com" target="_blank">Steemit</a> is a social media
        platform where everyone gets paid for creating and curating content. It leverages a robust digital points
        system, called <a href="https://steem.io" target="_blank">Steem</a>, that supports real value for digital
        rewards through market price discovery and liquidity.
      </p>
      <p>
        <iframe className="steem-video" width="560" height="315" src="https://www.youtube.com/embed/xZmpCAqD7hs" frameBorder="0" allowFullScreen></iframe>
      </p>
      <h2 id="contributor-report">What is a Contributor Report?</h2>
      <p>A Contributor Report or Contribution Report is exactly the same as a blog post where Open Source contributors
        can share their work for a particular Open Source project they are contributing to.</p>
      <br />
      <p>When creating a Contributor Report you have to specify the most meaningful contributions you made to a specific
        Open Source project, the reasons why are you contributing to it and the full story behind your
        contributions.</p>
      <br />
      <p>Contributing is not only about coding, but it's also about graphic design, documentation, spreading the word and much more.</p>
      <br />
      <p>Contribution Reports are not intended to be cold reports of your work. They must tell a story, be personal and meaningful. Contributions must be verifiable and trustworthy.</p>
      <br />
      <p>
        <b>You are requested to add:</b>
        <li>- Links to pull requests/branches/forks if you are contributing to the development.</li>
        <li>- Proof of social engagement if you have contributed by sharing on social media.</li>
        <li>- Any other verifiable proof of your contributions.</li>
      </p>
      <br />
      <p>
        The Hede community will vote and reward you for your contributions.
      </p>
      <p>
        Contributors are invited to <b>never post contributions already posted</b> in previous Contribution Reports.
      </p>
      <br />
      <p>
        Read the very first Contribution Report of the Hede platform: <a
        href="https://hede.io/hede-io/@elear/utopian-my-contribution-to-the-open-source-world">Hede: My
        Contribution to the Open Source World.</a>
      </p>
      <h2 id="steem-signup">Why do I have to signup with Steemit?</h2>
      <p>Hede is based on <a href="https://steem.io" target="_blank">Steem</a>. Hede does not have a separate
        signup system since it uses <a href="https://steemit.com" target="_blank">Steemit</a> and the <a
          href="https://steem.io" target="_blank">Steem</a> blockchain to store and retrieve data.
        <a href="https://steem.io" target="_blank"> Steem</a> is also the cryptocurrency used to reward the Open Source
        contributors when their Contribution Reports are upvoted by the Hede community. <em>The registration verification
          process in Steemit may take a few days.</em>
      </p>

      <h2 id="rewards">When do I get my rewards?</h2>
      <p>Rewards are managed by the <a href="https://steemit.com" target="_blank">Steemit</a> platform and released
        after 7 days you have submitted and being upvoted for a Contributor Report.</p>

      <h2 id="convert-steem">How do I convert Steem to real money?</h2>

      <p>You can access your <a href="https://steemit.com" target="_blank">Steemit</a> wallet directly from the
        Steemit.com website and transfer your Steem funds into a standard currency.</p>


    </div>
  </div>);
