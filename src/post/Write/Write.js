import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import kebabCase from 'lodash/kebabCase';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import 'url-search-params-polyfill';
import { injectIntl } from 'react-intl';
import size from 'lodash/size'
import {
  getAuthenticatedUser,
  getDraftPosts,
  getIsEditorLoading,
  getIsEditorSaving,
} from '../../reducers';

import * as Actions from '../../actions/constants';
import { createPost, saveDraft, newPost } from './editorActions';
import { notify } from '../../app/Notification/notificationActions';
import Editor from '../../components/Editor/Editor';
import Affix from '../../components/Utils/Affix';
import BannedScreen from '../../statics/BannedScreen';

import { httpRegex } from '../../helpers/regexHelpers';

const version = require('../../../package.json').version;

// @HEDE
import Modal from 'antd/lib/modal';  
import Icon  from 'antd/lib/icon';  

import { getBeneficiaries } from '../../actions/beneficiaries';
//import { getStats } from '../../actions/stats';
import { getTitles } from '../../actions/titles';

import {removeHedeReference, removeHedeReference2 } from '../../helpers/regexHelpers';

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];

@injectIntl
@withRouter
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    draftPosts: getDraftPosts(state),
    loading: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    submitting: state.submitting,
  }),
  {
    createPost,
    saveDraft,
    newPost,
    notify,
    getBeneficiaries,
    //getStats,
    //getUser,
    getTitles
  },
)
class Write extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    draftPosts: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    saving: PropTypes.bool,
    location: PropTypes.shape().isRequired,
    newPost: PropTypes.func,
    createPost: PropTypes.func,
    saveDraft: PropTypes.func,
    notify: PropTypes.func,
    title: PropTypes.shape(),
  };

  static defaultProps = {
    saving: false,
    newPost: () => {},
    createPost: () => {},
    saveDraft: () => {},
    notify: () => {},
    title: {},
    submitting: false
  };

  constructor(props) {
    super(props);

    this.state = {
      initialTitle: '',
      initialTopics: [],
      initialReward: '50',
      initialType: 'entry',
      initialBody: '',
      initialParentAuthor: '',
      initialPullRequests: [],
      isUpdating: false,
      warningModal: false,
      //parsedPostData: null,
      banned: false,
      warningProblem: false,
      problemText:'',
      showTitleInput: true,
      initialContentType: null,
      initialLanguage: null,
      initialTheme: null,
      formData: null,
      initialTitleSteem: '',
    };

    this.title = "";
    this.titleId = 0;
    this.titleObj = null;
    this.originalAuthor = null;
  }


  componentDidMount() {
    this.props.newPost();
    const { draftPosts, location: { search }, user, getTitles} = this.props;

    var draftPostJsonMetadata, draftPostPermlink, draftPostOriginalBody, draftPostTags;
    const draftId = new URLSearchParams(search).get('draft');
    const draftPost = draftPosts[draftId];


    const titleStr = new URLSearchParams(search).get('t');
    const titleStrQ = new URLSearchParams(search).get('q');

    if(titleStr && titleStr.length > 0){
      let titleArray = titleStr.split('--')
      this.titleId = titleArray.length>1 ? titleArray[titleArray.length-1] : 0
      this.title = titleArray.length>1 ? titleArray[0] : ""

      //console.log("it is an available title", titleStr);


      getTitles({
        skip:0,
        limit:1,
        section: 'all',
        sortBy: 'created',
        titleId: this.titleId,
        reset: false,
      }).then(res=>{
        this.titleObj = res.response.results[0];
        this.title = this.titleObj.name;
        //console.log("titleObj", this.titleObj);
        //console.log("titleName:", this.title);

        this.setState({
          initialTitle: this.title,
          initialTitleId: this.titleId,
          initialSteemTitle: this.title,
          showTitleInput: true
        });

      });


   }else if(titleStrQ && titleStrQ.length>0){

     this.title = titleStrQ.trim().replace("İ", "i").toLowerCase();

     this.setState({
        initialTitle: this.title,
        initialSteemTitle: this.title,
        initialTitleId: 0,
        showTitleInput: false
      });
 
   }else if (draftPost) {
      const { jsonMetadata, isUpdating } = draftPost;
      let tags = [];
      if (isArray(jsonMetadata.tags)) {
        tags = jsonMetadata.tags;
      }

      if (draftPost.permlink) {
        this.draftPostPermlink = draftPost.permlink;
        this.permlink = draftPost.permlink;
      }

      if (draftPost.originalBody) {
        this.originalBody = draftPost.originalBody;
      }

      this.originalAuthor = draftPost.author;

      this.titleId = draftPost.hede_title;
      this.title = draftPost.title;
   
      //console.log("draftPost body:", draftPost.body);

      // eslint-disable-next-line
      this.setState({
        initialTitle: jsonMetadata.title,
        initialTitleId: draftPost.hede_title,
        initialSteemTitle: draftPost.title,
        initialParentAuthor: draftPost.parent_author,
        initialTopics: tags || [],
        initialReward: draftPost.reward || '50',
        initialType: jsonMetadata.type || process.env.DEFAULT_CATEGORY,
        initialContentType: jsonMetadata.contentType,
        initialLanguage: jsonMetadata.lang,
        initialTheme: jsonMetadata.theme,
        initialBody: draftPost.body || '',
        isReviewed: draftPost.reviewed || false,
        isUpdating: isUpdating || false,
        showTitleInput: false

      });
    }

  }

  componentWillUpdate(nextProps){
    /*const oldValue = omitBy(this.props, (v, k) => nextProps[k] === v)
    const newValue = Object.keys(oldValue).reduce((a, b) => { a[b] = nextProps[b]; return a;}, {})

    console.log("changed values: ", newValue);
*/

  }


  componentWillReceiveProps (nextProps) {
    const draftId = new URLSearchParams(nextProps.location.search).get('draft');
   
    if(draftId){
      //console.log("there is draftId. will not update title.")
      return;
    }

    const titleStrQ = new URLSearchParams(nextProps.location.search).get('q');

   if(nextProps.title && size(nextProps.title)>0){
    const {title} = nextProps;
    this.titleObj = title;
    this.title = title.name;
    this.titleId = title._id;


    this.setState({
      initialTitle: this.title,
      initialTitleId: this.titleId,
      initialSteemTitle: this.title,
      showTitleInput: false
    });


    }
    else if(titleStrQ && titleStrQ.length>0){

      this.title = titleStrQ.trim().replace("İ", "i").toLowerCase();
      this.titleId = 0;
      this.titleObj = null;

      this.setState({
         initialTitle: this.title,
         initialTitleId: 0,
         initialSteemTitle: this.title,
         showTitleInput: false
       });
  
    }
 
  }

  proceedSubmit = (data) => {
    const { getBeneficiaries } = this.props;
    //const data = this.state.parsedPostData;
    const { location: { search } } = this.props;
    //const id = new URLSearchParams(search).get('t');
    //if (id) {
    data.draftId = this.titleId;
    //};

    if(this.state.warningModal)
      this.setState({warningModal : false});

    const extensions = [[0, {
      beneficiaries: [
        {
          account: 'hede',
          weight: 0
        }
      ]
    }]];

    const entryData = {
      ...data,
      extensions
    };

    //console.log("ENTRY DATA", entryData);

    this.props.createPost(entryData);

   
  };

  onSubmit = (form) => {
    //const { getStats } = this.props;
    const data = this.getNewPostData(form);
    const { location: { search } } = this.props;
    const id = new URLSearchParams(search).get('t');
    if (id) {
      data.draftId = id;
    };

    //this.setState({parsedPostData: data})

    //this.proceedSubmit(data);

    const bodyLength = data.body.length;

    if (bodyLength + 150 < 300) {
      this.setState({warningModal : true, formData: data});
    } else {
      this.proceedSubmit(data);
    }
    
  };

  getParentPermLinkForHedeEntries = ()=>{
    const dt = new Date();
    const nameOfMonth = monthNames[dt.getMonth()].toLowerCase();
    const year = dt.getUTCFullYear();
    return `hede-entries-for-${nameOfMonth}-${year}`;
  }
  getNewPostData = (form) => {
 
    const titleWithUrl = form.titleModerator || form.title || this.title;
    
    const data = {
      body: form.body,
      title: form.titleSteem || titleWithUrl,
      reward: form.reward,
    };

    const formContentType = form.contentType || "general";
    const formTheme = form.theme || "general";
    const formLanguage = form.language || "auto";

    //check if author wants to create a new post on Steem
    const parentAuthor = form.createSteemPost ? '' : process.env.HEDE_ENTRIES_ACCOUNT;
    const parentPermLink = form.createSteemPost ? (process.env.HEDE_CATEGORY || 'test-category'): this.getParentPermLinkForHedeEntries() ;

    data.parentAuthor = parentAuthor;
    data.parentPermlink = parentPermLink;


    data.author =  this.originalAuthor || this.props.user.name;

    let firstTag = process.env.HEDE_CATEGORY ||'test-category';

    if(parentAuthor === process.env.HEDE_ENTRIES_ACCOUNT)
      firstTag = process.env.HEDE_ENTRIES_TAG;

    let tags = [firstTag];

    if(formContentType !== "general")
      tags = [...tags, formContentType]

    if(formTheme !== "general")
      tags = [...tags, formTheme]
    
    if(formLanguage !== "auto")
      tags = [...tags, formLanguage]
    
    tags =[...tags,  ...(form.topics || [])];

    const users = [];
    const userRegex = /@([a-zA-Z.0-9-]+)/g;
    const links = [];
    const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const images = [];
    const imageRegex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;
    let matches;

    let postBody = data.body;
    // eslint-disable-next-line
    while ((matches = userRegex.exec(postBody))) {
      if (users.indexOf(matches[1]) === -1) {
        users.push(matches[1]);
      }
    }

    let linksToReplace = {};

    // eslint-disable-next-line
    /*while ((matches = linkRegex.exec(postBody))) {
      console.log("matches: ", matches)
      if (matches[2].search(/https?:\/\//) === 0) {
        linksToReplace.push(matches[2]);
        if(links.indexOf(matches[2]) === -1)
          links.push(matches[2]);
        //console.log("matches-1", matches[1]);
        console.log("1:", matches[2])
        postBody = postBody.replace(matches[2], "{{$hede_link_here}}");
      }
    }*/

    let setUrl = (url) =>{
      linksToReplace[url.toLowerCase()] = url;
    }

    if(httpRegex.test(postBody)){
      postBody.match(httpRegex).forEach(v=>setUrl(v));
    }
  
    if(images.indexOf("https://hede.io/img/thumbnail_h3.png") === -1)
      images.push("https://hede.io/img/thumbnail_h3.png");

    // eslint-disable-next-line
    while ((matches = imageRegex.exec(postBody))) {
      if (images.indexOf(matches[1]) === -1 && matches[1].search(/https?:\/\//) === 0) {
        images.push(matches[1]);
      }
    }

    if(images.length>=2){
      images.shift();
    }

    if (!this.permlink) {
      data.permlink = kebabCase(titleWithUrl);
    }else{
      data.permlink = this.permlink;
    }

    //console.log("postbody before lowercase:", postBody);
    //postBody = postBody.toLocaleLowerCase("en-US");
    let cLink = 0;
    //console.log("postbody after lowercase:", postBody);

    /*postBody = postBody.replace(httpRegex, (m, ref) => {
      return linksToReplace[ref];
    });*/

    //console.log("postbody after links:", postBody);


    data.body = postBody;

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;

    //console.log("formContentType", formContentType);

    const metaData = {
      community: 'hede',
      app: `hede/${version}`,
      format: 'markdown',
      title: titleWithUrl,
      platform: 'hede', // @TODO @HEDE hardcoded
      type: 'entry',
      titleId: this.titleId
    };

    
    metaData.contentType = formContentType;

    metaData.theme = formTheme;
    metaData.lang = formLanguage;

    //console.log("metaData.lang", metaData.lang);

  
    if (tags.length)
      metaData.tags = tags;
    

    if (images.length)
      data.image = images

    if (users.length) {
      metaData.users = users;
    }
    if (links.length) {
      metaData.links = links;
    }


    data.titleId = this.titleId

    //console.log("titleId saving:", this.titleId)

    data.jsonMetadata = metaData;

    if (this.originalBody) {
      data.originalBody = this.originalBody;
    }

    return data;
  };

  handleImageInserted = (blob, callback, errorCallback) => {
    const { formatMessage } = this.props.intl;
    this.props.notify(
      formatMessage({ id: 'notify_uploading_image', defaultMessage: 'Uploading image' }),
      'info',
    );
    const formData = new FormData();
    formData.append('files', blob);

    fetch(`https://busy-img.herokuapp.com/@${this.props.user.name}/uploads`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => {
        errorCallback();
        this.props.notify(
          formatMessage({
            id: 'notify_uploading_iamge_error',
            defaultMessage: "Couldn't upload image",
          }),
          'error',
        );
      });
  };

  onUpdate = debounce(form => {
    const data = this.getNewPostData(form)
    //this.setState({parsedPostData: data})
    this.saveDraft(data)
  }, 400);

  onFormError = (error)=>{
    console.log(error)
    this.setState({warningProblem:true, problemText: error})
  }

  saveDraft = (data) => {
    //const data = this.state.parsedPostData;
    const postBody = data.body;
    const { location: { search } } = this.props;
    let id = new URLSearchParams(search).get('t');

    // Remove zero width space
    const isBodyEmpty = postBody.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length === 0;

    if (isBodyEmpty) return;

    let redirect = false;
    
    if (id === null) {
      //id = Date.now().toString(16);
      id = this.titleId+"";
      //redirect = true;
    }

    this.props.saveDraft({ postData: data, id }, redirect);
  };

  
  render() {
    const {
      initialTitle,
      initialSteemTitle,
      initialTopics,
      initialType,
      initialBody,
      initialReward,
      parsedPostData,
      initialContentType,
      initialLanguage,
      initialTheme,
      initialParentAuthor
     } = this.state;
    const { loading, saving, submitting, user } = this.props;
    const isSubmitting = (submitting === Actions.CREATE_ENTRY_REQUEST || submitting === Actions.UPDATE_ENTRY_REQUEST) || loading;

    
    return (
     <div style={{marginTop: 30, padding:10}}>
            <Editor
              ref={this.setForm}
              saving={saving}
              title={initialTitle}
              titleSteem={initialSteemTitle}
              titleModerator={initialTitle}
              topics={initialTopics}
              reward={initialReward}
              type={initialType}
              contentType={initialContentType}
              language = {initialLanguage}
              theme = {initialTheme}
              body={initialBody}
              parentAuthor = {initialParentAuthor}
              loading={isSubmitting}
              isUpdating={this.state.isUpdating}
              isReviewed={this.state.isReviewed}
              onUpdate={this.onUpdate}
              onSubmit={this.onSubmit}
              onError={this.onFormError}
              showTitleInput = {this.state.showTitleInput}
              //onImageInserted={this.handleImageInserted}
              user={user}
              //parsedPostData={parsedPostData}
            />
            <Modal
              visible={this.state.warningModal}
              title='Hey. Your entry may be better!'
              cancelText={'Proceed anyways'}
              okText='Edit'
              onOk={() => this.setState({warningModal: false})}
              onCancel={ () => {
                  this.proceedSubmit(this.state.formData);
              }}
            >
              <p>
                <Icon type="safety" style={{
                  fontSize: '100px',
                  color: 'red',
                  display: 'block',
                  clear: 'both',
                  textAlign: 'center',
                }}/>
                <br />
                The entry you just wrote seems very short.
                <br /><br />
                Please make sure you are adding <b>enough information</b> and that your entry is <b>informative, descriptive and brings value</b>.
                <br /><br />
                Submitting the entry as it is now, will either result in <b>not getting any upvotes/exposure</b>.
              </p>
            </Modal>

            <Modal
              visible={this.state.warningProblem}
              title='Hey. You have a problem!'
              cancelText={'Cancel'}
              onCancel={() => this.setState({warningProblem: false})}
              onText={'OK'}
              onOk ={() => this.setState({warningProblem: false})}
            >
              <p>
                <Icon type="safety" style={{
                  fontSize: '100px',
                  color: 'red',
                  display: 'block',
                  clear: 'both',
                  textAlign: 'center',
                }}/>
                <br />
                  There is a problem with your form:<br/> {this.state.problemText}
                </p>
            </Modal>
          </div>
       
    );
  }
}

export default Write;
