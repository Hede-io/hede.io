import React from 'react';
import { Rules } from '../components/Rules';

import './Rules.less';

export default props =>
  (<div className="main-panel rules-section">
    <div className="container text-center my-5">
      <h1>General Rules</h1>
      <div>
        <h2>
          Immediate Rejection
        </h2>
        <p>Not respecting one or more of the rules below will lead to direct rejection of your contribution.</p>
      </div>

      <div>
        <h2>
          Hard VS Soft Rules
        </h2>
        <p>Rules are implicitly marked as Hard rules. Soft rules are marked with the label <b>[SOFT]</b>.</p>
        <ul>
          <li>All the rules not marked as <b>[SOFT]</b> lead to immediate rejection.</li>
          <li>All the rules marked as <b>[SOFT]</b> may lead to rejection if you have been notified about the same mistake multiple times. In any other case the <b>Moderator will ask for a change but accept your contribution anyways</b>.</li>
        </ul>
      </div>

      <div>
        <h2>
          Editor Templates
        </h2>
        <p>When submitting a contribution you will find a standard template that you should follow when writing the details of your contribution.</p>
        <ul>
          <li>Templates are editable, as long as your contribution has a clear format. </li>
          <li>Templates can be extended.</li>
        </ul>
      </div>

      <div>
        <h2>
          Temporary / Lifetime Bans - Hede Downvote
        </h2>
        <p>
          Hede may ban your account temporarily or for the lifetime and may also proceed for a downvote in any of the following cases.
        </p>
        <li>
          Any user found harassing a member of the Hede Moderators or in general any member of the Hede teams.
        </li>
        <li>
          Using multiple accounts to clearly abuse the system.
        </li>
        <li>
          Keep contributing with low quality contributions even after being notified.
        </li>
        <li>
          Plagiarism.
        </li>
        <li>
          Using Licensed or commercial materials or Creative Commons without citing the source even after being notified.
        </li>
        <li>
          Tag spamming. <b>[SOFT]</b>
        </li>
      </div>

      <div>
        <h2>
          Commercial/Copyrighted Materials
        </h2>
        <p>No commercial or copyrighted material should ever be used in a contribution.</p>
        <ul>
          <li>
            Only Creative Commons for Images and Videos can be accepted and the source should be always cited.
          </li>
          <li>
            You retain full responsibility when using copyrighted or commercial materials without proper permission.
          </li>
        </ul>
      </div>

      <div>
        <h2>Contributions must be Formal and Professional</h2>
        <p>A moderator may reject a contribution if it is not written in a formal and professional style.</p>
        <ul>
          <li>
            The contributor should follow the templates provided in the editor for each category. <b>[SOFT]</b>
          </li>
          <li>
            The writing style should be formal never informal.
          </li>
          <li>
            The writing style should be professional.
          </li>
          <li>
            Sentences like: <em>Hello Hedes</em>, <em>Hello Steemians</em>, <em>Dear friends</em> and similar informal sentences may lead to rejection. <b>[SOFT]</b>
          </li>
          <li>Sentences like <em>resteem, follow, upvote</em> may lead to immediate rejection. <b>[SOFT]</b></li>
          <li>
            Quality of the images and videos used in the contribution should be high. Low res images and videos will be rejected. <b>[SOFT]</b>
          </li>
          <li>
            A contribution with bad grammar will be rejected if the contents may be really hard to understand. <b>[SOFT]</b>
          </li>
        </ul>
      </div>

      <div>
        <h2>Contributions must be Informative</h2>
        <p>
          The contribution must contain as much detail as possible and have some graphical content in it (images, charts, videos, etc) where applicable. The length of the body of the contribution should be enough to give every possible detail about the submitted contribution.
        </p>
      </div>

      <div>
        <h2>Contributions must be in English</h2>
        <p>Contents of the contributions (post content) must be in plain English and fully understandable.</p>
      </div>

      <div>
        <h2>Never Submitted Before</h2>
        <p>
          Contributions must be unique. Users must first check if the same or very similar contribution has been submitted before.</p>
        <ul>
          <li>Same contributions will never be accepted in Hede twice by the same or different user.</li>
          <li>Contents already shared on the Steem blockchain in general may still be rejected if submitted in Hede.</li>
          <li>Contents already shared anywhere else may still be rejected if submitted in Hede.</li>
          <li>Same contents already shared before in Hede or anywhere else by different users may still be rejected if a moderator recognises plagiarism.</li>
        </ul>
      </div>

      <div>
        <h2>Author of the Contribution</h2>
        <p>
          The contribution must provide as much detail as possible to verify the actual work done and that you are the author.
        </p>
        <li>If your Steem/Hede username does not match with the username used in an external platform, you must either edit the username in the external platform or provide an immediate way to verify you are the author.</li>
      </div>

      <div>
        <h2>Contributions Must Not Contain Spam</h2>
        <p>
          The contribution should not contain any clear attempt to profit solely from a commercial perspective, and should not be written in a way that suggests the contributor is looking to maximise the returns.
        </p>
        <li>The author may provide links to his social profiles in a way that does not disturb the reader.</li>
        <li>Links to commercial products are forbidden.</li>
        <li>Misusing the mentions by mentioning other Steem/Hede users without an obvious reason will lead to rejection. <b>[SOFT]</b></li>
      </div>

      <div>
        <h2>Contributions Must Not Contain Defamation</h2>
        <p>
          Contributions must not use namecalling directed at other users of the Steem blockchain. Contributions may not contain false information about another user that may be perceived as defamatory.
        </p>
      </div>

      <div>
        <h2>Contributions Should Not Solicit for Unrelated Activities</h2>
        <li>
          Contributors should not ask for Steem/Steemit related activities in their posts, such as upvotes, resteems and follows.  <b>[SOFT]</b>
        </li>
        <li>
          Contributors should not ask for Hede related activities in their posts, such as upvotes and follows.  <b>[SOFT]</b>
        </li>
        <li>
          Contributors should not solicit for any activity in general that it is not strictly accepted by the Hede Rules.
        </li>
        <li>
          Contributors should not ask for witness votes in their Hede posts. <b>[SOFT]</b>
        </li>
      </div>

      <div>
        <h2>
          Unvoting - Rejection After Approval
        </h2>
        <p>Hede can unvote or reject an accepted contribution if it is found out that the contribution did not meet the rules and had been upvoted by mistake. This decision considers cases such as attempts of plagiarism, copying work and ideas of others or other violation of the rules which would be obvious to see that the contribution does not deserve the reward.</p>
      </div>

     
      <div>
        <h1>Categories Rules</h1>
        <div><Rules inEditor={false} type="ideas" /></div>
        {/* <div><Rules inEditor={false} type="sub-projects" /></div>*/}
        <div><Rules inEditor={false} type="development" /></div>
        <div><Rules inEditor={false} type="bug-hunting" /></div>
        <div><Rules inEditor={false} type="translations" /></div>
        <div><Rules inEditor={false} type="graphics" /></div>
        <div><Rules inEditor={false} type="analysis" /></div>
        <div><Rules inEditor={false} type="social" /></div>
        <div><Rules inEditor={false} type="documentation" /></div>
        <div><Rules inEditor={false} type="tutorials" /></div>
        <div><Rules inEditor={false} type="video-tutorials" /></div>
        <div><Rules inEditor={false} type="copywriting" /></div>
        <div><Rules inEditor={false} type="blog" /></div>
      </div>

      <div>
        <br />
        <h1>Task Requests</h1>
        <li>Task requests are meant to be made by the project owner when looking for contributions.</li>
        <li>A task must be explained in great detail and provide all the necessary details for it to actually be completed. In one task request, there should not be more than one task; and if more, they must be related to the category where the task request is being submitted.</li>
        <li>Generic task requests, like "We are looking for contributors" won't be accepted.</li>
        <li>You should always provide contact details for the contributor to get in touch with you.</li>
        <li>You should always define a deadline. <b>[SOFT]</b> </li>

        
      </div>

      <div>
        <h1>Report a Moderation Issue</h1>
        <p>If you disagree with a moderator\'s decision or experience other moderation related issues, you can get in touch with us on Discord. You can mention <b>@Moderators</b> or <b>@Supervisors</b> in the <a href="https://discord.gg/KXpest">#review-discussion</a> channel. Mention Supervisors only in urgent situations.<br /><br /><b>Supervisors and Moderators are not required to and most likely will not respond to direct messages</b>.</p>
      </div>

      <div>
        <h1>Moderation</h1>
        <ul>
          <li>Hede Moderators/Supervisors have full rights to reject or accept a contribution.</li>
          <li>Supervisors may always revert an accepted/rejected contribution.</li>
        </ul>

        <div>
          <h2>Application as an Hede Moderator</h2>
          <ul>
            <li>You must be at least 18 years old.</li>
            <li>
              You must write a public Steemit post proposing your intentions, one or more related categories you would like to moderate, your fields of expertise and you should nominate one existing Supervisor. In order to nominate a Supervisor pick one from the <a target="_blank" href="https://docs.google.com/spreadsheets/u/1/d/11AqLQPgULU4F7fIwfArqYdAcexufSH3IBEY32yVVm4I/edit?usp=drive_web">official list</a>.
            </li>
            <li>
                You must <a href="https://docs.google.com/forms/d/1YAkcRyjBRCIrdLOizgO7E8mATAU6_ZSPjL2WCZrPn_4">complete our application form and pass the integrated test</a>.
            </li>
          </ul>
          <div>
            <h3>
              Related Categories
            </h3>
            <p>A moderator may only apply for one category or more as long as they have related know-how</p>
            <ul>
              <li>
                Suggestions - Visibility - Tasks for Thinkers - Tasks for Influencers
              </li>
              <li>
                Translations - Tasks for Translators
              </li>
              <li>
                Graphics - Tasks for Designers
              </li>
              <li>
                Development - Bug Hunting - Documentation - Tasks for Developers, Bug Hunters and Tech Writers
              </li>
              <li>
                Analysis - Tasks for Data Analysts
              </li>
              <li>
                Tutorials - Video Tutorials
              </li>
              <li>
                Copywriting - Blog Posts
              </li>
            </ul>
          </div>
          <div>
            <h3>Losing Moderation Rights</h3>
            <p>
              A Moderator will have to step back if the majority of the other Moderators/Supervisors/Advisors/Overseers believe the position should be left or if the Supervisor assigned to him opts for that.
            </p>
          </div>
        </div>

        <div>
          <h2>Application as an Hede Supervisor</h2>
          <ul>
            <li>Supervisors will only be accepted if they have moderated at least 600 contributions and being active since at least 2 months.</li>
            <li>Supervisors must have a proved strong general know-how of the Hede platform and its categories.</li>
            <li>Supervisors should always check the work of their teams and make sure work on other teams is proceeding correctly.</li>
            <li>Supervisors must have a weekly public review of the work of their teams.</li>
          </ul>
          <div>
            <h3>Losing Supervisor Rights</h3>
            <p>A Supervisor will have to step back if the majority of the other Supervisors/Advisors/Overseers believe the position should be left.</p>
          </div>
        </div>
      </div>

      <div>
        <h2>
          See our FAQ
        </h2>
        <p>
          Click <b><a href="/faq">here</a></b> to view our <em>Frequently Asked Questions</em> (FAQ) page, where we detail the most asked questions and their answers.
        </p>
      </div>

    </div>
  </div>);
