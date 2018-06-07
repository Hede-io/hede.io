import React from 'react';
import { FormattedMessage } from 'react-intl';
import './WelcomeModerator.less';

export default () =>
  (<div className="main-panel">
    <div className="mt-5 text-center">
      <h1>
        <center>Welcome, Moderator!</center>
      </h1>
      <h4>
          <center>Here's what you need to know.</center>
          </h4>
      <p className="container pb-5">
        <h2>
        Moderation Functionalities
            </h2>
            Now that you're a moderator, when you go to the <a href="https://hede.io/all/review">moderation page</a>, you will see <b>new functionalities.</b>

            &nbsp;When you open a post for review, you will see 3 new buttons at the top:<br/>
            <ul className="Welcome__ul">
            <li><b className="Welcome__verified">Verified</b> - Marking the post as verified means that the post follows all of the Hede Rules precisely. 
            The user will not be able to change the repository or contribution category after you verify their contribution.</li>
            <li><b className="Welcome__pending">Pending Review</b> - Click this button when you're close to verifying the post but it's not quite there.
            Make sure to click this when you have requested changes from the user and you are still waiting for them.</li>
            <li><b className="Welcome__hide">Hide Forever</b> - Click this only in dire cases, if the post has no way of being accepted (for example, it is spam, plagiarism, or doesn't make sense).
            You may also click this if the user has not made your requested changes within 48 hours.</li>
            </ul>
            <br/>
            
            Also, make sure to join our Discord Server if you haven't already:<br/>
            <center><b><a class="Welcome__bigButton" href="https://discord.gg/5geMSSZ">Join Hede on Discord</a></b></center>
            <br/>You'll be able to meet many friendly moderators and users there. Not only will you be able to make many friends, but you will also be kept up-to-date on moderator issues and Hede updates.
            It is mandatory for all moderators to be on the Discord Server. Once you join, please tell everyone your STEEM username and that you are a moderator.
            <br/><h3>
                Comment Templates
                </h3>
            After you click one of the three buttons to mark a post, you should see a dialog pop up asking you to write a "Moderation Comment".

            If you verified the post, the dialog should already have a pre-made comment ready for you to accept. Press <code className="Welcome__code">Comment</code> and the dialog will disappear, and you're done!<br/>

            However, if you flagged a post or marked it as pending review, the dialog will have at least five pre-made <b>templates</b> you will have to choose from.
            This will usually be self-explanatory, for example if it's in the wrong repository click <code className="Welcome__code">Wrong Repository</code> and so on.
            <br/>
            Never <b>accept/verify</b> or <b>flag</b> a contribution without providing a moderator comment. You should also comment if you marked it as pending, but this isn't completely mandatory.
            <br/>
            Lastly, before you start working on reviewing a post, place the link on the <code className="Welcome__code">#i-am-on-it</code> channel in the Hede Discord server. 
            This is to make sure that nobody else works on your post while you're working on it, and that you don't work on a post someone else is already working on.
            <br/><h2>
                The Rules
                </h2>
            As a Moderator, one of your biggest duties is upholding the <b><a href="https://hede.io/rules">Hede Rules.</a></b><br/><br/>

            You need to know the rules <em>very well</em> and whenever you review a contribution, you need to figure out if it follows all the rules.
            If it doesn't, know which rule it does not follow. <br/>

            <h3>
                The Golden Rule
                </h3>
            The Hede Golden Rule is:
            <center><em><blockquote className="Welcome__blockquote">
            Help the community to grow and to do better, and never frustrate anyone.
            </blockquote></em></center>
            <br/>
            Be very mindful of the rules, but if the user made a small typo somewhere don't be too stringent.<br/>
            <ul className="Welcome__ul">

            <li>Tags are a soft rule, and if you see tag spamming, ask the user for removal but that shouldn't be reason to not accept or flag their post.</li><br/>

            <li>Banners or large images advertising the user at the bottom of the post are not allowed.</li><br/>

            <li>Posts must be professional and strictly related to the contribution. Posts must relate to an open-source project or to the open-source movement. </li><br/>
            </ul>

            <h3>
                Thank You
                </h3>
                Thanks for being a moderator. You can check your rewards/payout <a href="https://hede.io/moderators">here.</a> <br/><br/>

                <em>Document Last Modified November 20th, 2017</em><br/><br/>
            
            <br className="Welcome__bigbreak"/>
            
      </p>
      
    </div>
  </div>);
