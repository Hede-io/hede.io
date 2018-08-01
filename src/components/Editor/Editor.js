import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import findDOMNode from 'react-dom/lib/findDOMNode';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { HotKeys } from 'react-hotkeys';
import { throttle } from 'lodash';
import isArray from 'lodash/isArray';

import Checkbox from 'antd/lib/checkbox'; 
import Icon from 'antd/lib/icon'; 
import Form from 'antd/lib/form'; 
import Input from 'antd/lib/input'; 
import Select from 'antd/lib/select'; 
import Radio from 'antd/lib/radio'; 
import Dropdown from 'antd/lib/dropdown'; 
import Menu from 'antd/lib/menu'; 
import Button from 'antd/lib/button'; 
import Switch from 'antd/lib/switch';
import propEq from 'ramda/src/propEq';
import find from 'ramda/src/find';

import Dropzone from 'react-dropzone';
import EditorToolbar from './EditorToolbar';
import * as EditorTemplates from './templates';
import Action from '../Button/Action';
import Body, { remarkable } from '../Story/Body';
import AutoComplete from 'antd/lib/auto-complete';
import Modal from 'antd/lib/modal';

//import SimilarPosts from './SimilarPosts';
import 'mdi/css/materialdesignicons.min.css';
import './Editor.less';
import { searchTitles } from '../../actions/titles';
import Cookies from "js-cookie";

import {removeHedeReference2 } from '../../helpers/regexHelpers';

import {lowerCaseEntry} from '../../vendor/steemitHelpers';
import { getModerators } from '../../actions/moderators';
import { getIsAuthenticated, getAuthenticatedUser } from '../../reducers';

const RadioGroup = Radio.Group;
const Option = Select.Option;

const InputGroup = Input.Group;
const AOption = AutoComplete.Option;


// @HEDE
import { Rules } from '../Rules';
import { DELETE_DRAFT } from '../../post/Write/editorActions';


@injectIntl
@connect(
  state => ({
    titlesFound : state.titlesFound,
    moderators: state.moderators,
    user: getAuthenticatedUser(state),

//    leftTitlesVisible: state.leftTitlesVisible

  }),
  {
    searchTitles,
    getModerators
   },
)
class Editor extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    title: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    reward: PropTypes.string,
    body: PropTypes.string,
    type: PropTypes.string,
    contentType: PropTypes.string,
    language: PropTypes.string,
    theme: PropTypes.string,
    loading: PropTypes.bool,
    isUpdating: PropTypes.bool,
    saving: PropTypes.bool,
    onUpdate: PropTypes.func,
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onImageInserted: PropTypes.func,
    titlesFound: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    showTitleInput: PropTypes.bool,

  };

  static defaultProps = {
    title: '',
    topics: [],
    reward: '50',
    type: process.env.DEFAULT_CATEGORY,
    body: '',
    recentTopics: [],
    popularTopics: [],
    loading: false,
    isUpdating: false,
    saving: false,
    onUpdate: () => {},
    onSubmit: () => {},
    onError: () => {},
    onImageInserted: () => {},
    titlesFound : [],
    showTitleInput: true,
    contentType: "",
    language: "",
    theme: "",

  };


  static hotkeys = {
    h1: 'ctrl+shift+1',
    h2: 'ctrl+shift+2',
    h3: 'ctrl+shift+3',
    h4: 'ctrl+shift+4',
    h5: 'ctrl+shift+5',
    h6: 'ctrl+shift+6',
    bold: 'ctrl+b',
    italic: 'ctrl+i',
    quote: 'ctrl+q',
    link: 'ctrl+k',
    image: 'ctrl+m',
    code: 'ctrl+n',
    innerlink: 'ctrl+i',
    seealso:'ctrl+h'
  };

  state = {
    contentHtml: '',
    noContent: false,
    imageUploading: false,
    dropzoneActive: false,
    value: '',
    loading: false,
    loaded: false,
    currentType: null,
    showFormDetail: false,
    theme: '',
    contentType:'',
    language:'',
    theme:'',
    titleId: 0,
    rulesAccepted: true,
    showRulesModal: false,
    createSteemPost: true

  };

  onSelectLanguage = (language) => {
      this.setState({selectedLanguage: language})
  }

  constructor (props) {
    super(props)
    this.renderItems = this.renderItems.bind(this);
  }

  renderItems(items) {
    return items;
  }

  componentDidMount() {
    /*if (this.input) {
      this.input.addEventListener('input', throttle(e => this.renderMarkdown(e.target.value), 500));
      this.input.addEventListener('paste', this.handlePastedImage);
    }*/

    this.setValues(this.props);

    // eslint-disable-next-line react/no-find-dom-node
    const select = findDOMNode(this.select);
    if (select) {
      const selectInput = select.querySelector('input,textarea,div[contentEditable]');
      if (selectInput) {
        selectInput.setAttribute('autocorrect', 'off');
        selectInput.setAttribute('autocapitalize', 'none');
      }
    }

   /* const removeChat = () => {
        if (document.getElementsByClassName("cometchat_ccmobiletab_redirect") && document.getElementsByClassName("cometchat_ccmobiletab_redirect")[0]) {
          if (document.getElementsByClassName("cometchat_ccmobiletab_redirect")[0].classList) {
            if (!document.getElementsByClassName("cometchat_ccmobiletab_redirect")[0].classList.contains("Component__block")) {
              document.getElementsByClassName("cometchat_ccmobiletab_redirect")[0].classList.add("Component__block");
              console.log("Blocking Chat");
            }
          }
        }
    }
    removeChat();
    setTimeout(removeChat, 2000);
    setTimeout(removeChat, 2500);
    setTimeout(removeChat, 4000); */
  }




  componentWillUnmount() {
    /*
    if (document.getElementsByClassName("cometchat_ccmobiletab_redirect") && document.getElementsByClassName("cometchat_ccmobiletab_redirect")[0]) {
      if (document.getElementsByClassName("cometchat_ccmobiletab_redirect")[0].classList) {
        if (document.getElementsByClassName("cometchat_ccmobiletab_redirect")[0].classList.contains("Component__block")) {
          document.getElementsByClassName("cometchat_ccmobiletab_redirect")[0].classList.remove("Component__block");
          console.log("Unblocking Chat");
        }
      }
    }*/

    const { moderators, getModerators} = this.props;

    if (!moderators || !moderators.length) {
      getModerators();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { title, topics, body, type, user, reward, contentType, language, theme } = this.props;

    if (
      title !== nextProps.title ||
      topics !== nextProps.topics ||
      reward !== nextProps.reward ||
      body !== nextProps.body ||
      type !== nextProps.type ||
      contentType !== nextProps.contentType ||
      language !== nextProps.language ||
      theme !== nextProps.theme
     ) {
      this.setValues(nextProps);
    }
  }

  onUpdate = (e, type = null) => {
    const values = this.getValues(e);

    let v = this.input.value;
    //if(v.indexOf("İ")>-1)
    //  v = v.replace("İ", "i");
    
    this.setState({entryValue : v});

    this.props.onUpdate(values);
    
  };

  handleChangeCategory = (e) => {
    const { isUpdating } = this.props;
 
  }

  setInput = (input) => {
    if (input && input.refs && input.refs.input) {
      this.originalInput = input.refs.input;
      // eslint-disable-next-line react/no-find-dom-node
      this.input = findDOMNode(input.refs.input);
    }
  }; 

  handleChange = (type, value) =>{
    //console.log(`type ${type} selected ${value}`);
    this.setState({[type]: value});
  }
  
  handleBlur = () => {
    //console.log('blur');
  }
  
  handleFocus = ()=> {
    //console.log('focus');
  }

  getDefaultTemplate = (type, title) => {
    var selectedType = type || 'entry'
    const sanitisedType = selectedType.replace('-', '');
    return EditorTemplates[sanitisedType](title);
  }

  setValues = (post) => {
    //console.log("post.title", post.title, "contentType", post.contentType);

    let formFieldValues = {
      title: post.title,
      // @HEDE filtering out hede-io since it's always added/re-added when posting
      topics: post.topics.filter(topic => (topic !== process.env.HEDE_CATEGORY && topic !== post.language  && topic !== post.theme  && topic !== post.contentType )),
      reward: post.reward,
      type: post.type || process.env.DEFAULT_CATEGORY,
    };

    if(post.contentType)
      formFieldValues["contentType"] = post.contentType;

    if(post.language)
      formFieldValues["language"] = post.language;

    if(post.theme)
      formFieldValues["theme"] = post.theme;

    if(post.titleSteem)
      formFieldValues["titleSteem"] = post.titleSteem;

    if(post.titleModerator)
      formFieldValues["titleModerator"] = post.titleModerator;

    this.props.form.setFieldsValue(formFieldValues);
    if (this.input && post.body !== '') {
      this.input.value = post.body;
      this.renderMarkdown(this.input.value);
      this.resizeTextarea();
    }

    const parsedBody = post.body.replace(removeHedeReference2, "").replace(/<br\s?\/\>\s*$/, "");

    const isPostOnSteem = post.parentAuthor === '';

    this.setState({entryValue: parsedBody, createSteemPost: isPostOnSteem});
  };

  getValues = (e) => {
    // NOTE: antd API is inconsistent and returns event or just value depending of input type.
    // this code extracts value from event based of event type
    // (array or just value for Select, proxy event for inputs and checkboxes)

    const chosenType = this.state.currentType || this.props.type || process.env.DEFAULT_CATEGORY;

    const values = {
      ...this.props.form.getFieldsValue(['title', 'titleSteem', 'titleModerator', 'topics', 'reward', 'language']),
      body: this.input.value,
      type: 'entry'
    };


    values.theme = this.state.theme;
    values.contentType = this.state.contentType;
    values.language = this.state.language;

    if (!e) return values;

    if (isArray(e)) {
      values.topics = e;
    } else if (typeof e === 'string') {
      values.reward = e;
    }else if (e.target.type === 'textarea') {
      values.body = e.target.value;
    }/* else if (e.target.type === 'text') {
      values.titleSteem = e.target.value;
    }*/
    
    

    return values;
  };

  setInputCursorPosition = (pos) => {
    if (this.input && this.input.setSelectionRange) {
      this.input.setSelectionRange(pos, pos);
    }
  }

  resizeTextarea = () => {
    if (this.originalInput) this.originalInput.resizeTextarea();
  };

  //
  // Form validation and handling
  //

  handleSubmit = (e) => {

    //console.log("handleSubmit called")
    // NOTE: Wrapping textarea in getFormDecorator makes it impossible
    // to control its selection what is needed for markdown formatting.
    // This code adds requirement for body input to not be empty.
    e.preventDefault();
    this.setState({ noContent: false});
    this.props.form.validateFieldsAndScroll((err, values) => {
      //console.log("handleSubmit values", values);
      if (!err && this.input.value !== '') {
        this.props.onSubmit({
          ...values,
          body: this.input.value,
          titleId: this.state.titleId,
          createSteemPost: this.state.createSteemPost
        });
      }else if (this.input.value === '') {
        const errors = {
          ...err,
          body: {
            errors: [
              {
                field: 'body',
                message: "Content can't be empty",
              },
            ],
          },
        };
        this.setState({ noContent: true });
        this.props.onError(errors);
      } else {
        this.props.onError(err);
      }
    });
  };

  checkTopics = (rule, value, callback) => {
    if(!value){
      callback();
      return;
    }

    if (value.length < 0 || value.length > 3) {
      callback('Enter up to 3 tags');
    }

    value
      .map(topic => ({ topic, valid: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic) }))
      .filter(topic => !topic.valid)
      .map(topic => callback(`Tag ${topic.topic} is invalid`));

    callback();
  };

  //
  // Editor methods
  //

  handlePastedImage = (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;
      Array.from(items).forEach((item) => {
        if (item.kind === 'file') {
          e.preventDefault();

          this.setState({
            imageUploading: true,
          });

          const blob = item.getAsFile();
          this.props.onImageInserted(blob, this.insertImage, () =>
            this.setState({
              imageUploading: false,
            }),
          );
        }
      });
    }
  };

  handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      this.setState({
        imageUploading: true,
      });
      this.props.onImageInserted(e.target.files[0], this.insertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
      // Input reacts on value change, so if user selects the same file nothing will happen.
      // We have to reset its value, so if same image is selected it will emit onChange event.
      e.target.value = '';
    }
  };

  handleDrop = (files) => {
    if (files.length === 0) {
      this.setState({
        dropzoneActive: false,
      });
      return;
    }

    this.setState({
      dropzoneActive: false,
      imageUploading: true,
    });
    let callbacksCount = 0;
    Array.from(files).forEach((item) => {
      this.props.onImageInserted(
        item,
        (image, imageName) => {
          callbacksCount += 1;
          this.insertImage(image, imageName);
          if (callbacksCount === files.length) {
            this.setState({
              imageUploading: false,
            });
          }
        },
        () => {
          this.setState({
            imageUploading: false,
          });
        },
      );
    });
  };

  handleDragEnter = () => this.setState({ dropzoneActive: true });

  handleDragLeave = () => this.setState({ dropzoneActive: false });

  insertAtCursor = (before, after, deltaStart = 0, deltaEnd = 0) => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    this.input.value =
      this.input.value.substring(0, startPos) +
      before +
      this.input.value.substring(startPos, endPos) +
      after +
      this.input.value.substring(endPos, this.input.value.length);

    this.input.selectionStart = startPos + deltaStart;
    this.input.selectionEnd = endPos + deltaEnd;
  };

  insertImage = (image, imageName = 'image') => {
    if (!this.input) return;

    const startPos = this.input.selectionStart;
    const endPos = this.input.selectionEnd;
    const imageText = `![${imageName}](${image})\n`;
    this.input.value = `${this.input.value.substring(
      0,
      startPos,
    )}${imageText}${this.input.value.substring(endPos, this.input.value.length)}`;
    this.resizeTextarea();
    this.renderMarkdown(this.input.value);
    this.setInputCursorPosition(startPos + imageText.length);
    this.onUpdate();
  };

  insertCode = (type) => {
    if (!this.input) return;
    this.input.focus();

    switch (type) {
      case 'h1':
        this.insertAtCursor('# ', '', 2, 2);
        break;
      case 'h2':
        this.insertAtCursor('## ', '', 3, 3);
        break;
      case 'h3':
        this.insertAtCursor('### ', '', 4, 4);
        break;
      case 'h4':
        this.insertAtCursor('#### ', '', 5, 5);
        break;
      case 'h5':
        this.insertAtCursor('##### ', '', 6, 6);
        break;
      case 'h6':
        this.insertAtCursor('###### ', '', 7, 7);
        break;
      case 'b':
        this.insertAtCursor('**', '**', 2, 2);
        break;
      case 'i':
        this.insertAtCursor('*', '*', 1, 1);
        break;
      case 'q':
        this.insertAtCursor('> ', '', 2, 2);
        break;
      case 'link':
        this.insertAtCursor('[', '](url)', 1, 1);
        break;
      case 'seealso':
        this.insertAtCursor('(hede: ', ')', 7, 7);
        break;
      case 'innerlink':
        this.insertAtCursor('`', '`', 1, 1);
        break;
      case 'image':
        this.insertAtCursor('![', '](url)', 2, 2);
        break;
      case 'code':
        this.insertAtCursor('``` language\n', '\n```', 4, 12);
        break;
      default:
        break;
    }

    this.resizeTextarea();
    this.renderMarkdown(this.input.value);
    this.onUpdate();
  };

  handlers = {
    h1: () => this.insertCode('h1'),
    h2: () => this.insertCode('h2'),
    h3: () => this.insertCode('h3'),
    h4: () => this.insertCode('h4'),
    h5: () => this.insertCode('h5'),
    h6: () => this.insertCode('h6'),
    bold: () => this.insertCode('b'),
    italic: () => this.insertCode('i'),
    quote: () => this.insertCode('q'),
    link: (e) => {
      e.preventDefault();
      this.insertCode('link');
    },
    image: () => this.insertCode('image'),
    code: () => this.insertCode('code'),
  };

  renderMarkdown = (value) => {
    this.setState({
      contentHtml: value,
    });
  };

  onFocusEntry = () =>{
    let {rulesAcceptedCookie} = {rulesAcceptedCookie: Cookies.get('isRulesAccepted') || false};

    if(!rulesAcceptedCookie){
      this.setState({showRulesModal: true});
      return;

    }

  }

  renderSearch () {
    const { history, location } = this.props;

    const { titlesFound } = this.props;

    const optionsToRender = titlesFound;

    const { getFieldDecorator } = this.props.form;

    return (
      <div className="">

        <InputGroup className="" compact>

          <AutoComplete
            className="autocomplete"
            size="large"
            style={{ width: '100%', height: 56 }}
            dataSource={optionsToRender.map(this.renderOption)}
            onSelect={this.onSelect}
            onSearch={this.handleSearch}
            placeholder=""
            optionLabelProp="text"
          >

          {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'Title cannot be empty',
                  },
                  {
                    max: 255,
                    message: "Title can't be longer than 255 characters.",
                  },
                ],
              })(
             <Input
                ref={(title) => {
                  this.titleRef = title;
                }}
                onChange={this.onUpdate}
                className="Editor__title"
                placeholder='Add title'
                disabled = {this.props.title!=null && this.props.title.length>0}
                suffix={(
                    <Icon type="search" />
                )}
              />
              )}

          
          </AutoComplete>
        </InputGroup>


      </div>
    )}

    onSelect = (value) =>{
      this.setState({titleId : parseInt(value)});
    }

    renderOption = (item) =>{
      return (
        <AOption key={item._id} text={item.name}>
          {item.name} {item.total ? '('+item.total+')': ''}
        </AOption>
      );
    }


  handleSearch = (value) => {

    this.searchQuery = value;
    
    if (value.length >= 3){
      this.props.searchTitles({
        limit: 5,
        skip: 0,
        section: 'all',
        sortBy: 'created',
        type: 'search',
        bySimilarity: value,
        reset: true,
      }).then(res => {
        this.total = res.response.total;
      }); 
    }
    /*
    this.setState({
      dataSource: value ? this.searchResult(value) : [],
    });*/
  }

  isModerator () {
    if (!this.props || !this.props.moderators) return false;
    const { moderators, user } = this.props;    
    return find(propEq('account', user.name))(moderators)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { intl, loading, isUpdating, isReviewed, type, saving, user, parsedPostData } = this.props;
    const chosenType = this.state.currentType || type || 'entry';

    const chosenTitle = this.state.title || this.props.title || ''
    //console.log("selected type", chosenType)
    //console.log("selected title", chosenTitle)

    return (
      <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>


        {this.state.showRulesModal && !isUpdating  && <Rules
            inEditor={true}
            type={chosenType}
            acceptRules={() => {
              Cookies.set(
                'isRulesAccepted',
                true,
                {
                  expires: 1209600, // ten years from now
                  domain: process.env.NODE_ENV === 'development'
                    ? 'localhost'
                    : 'hede.io',
                });

                  this.setState({showRulesModal: false})
               }
              }
             />
        }

      {!this.state.showRulesModal &&
      <div>
                    {/*<Form.Item

        <div style={{display:this.props.showTitleInput?'block':'none'}}>
              label={
                <span className="Editor__label">
              Title
              </span>
              }
            >
             
              {this.renderSearch()}
             
            </Form.Item>
          </div>
            */}
          
          <Form.Item
            validateStatus={this.state.noContent ? 'error' : ''}
            help={this.state.noContent && "Entry content can't be empty."}
          >

            <EditorToolbar onSelect={this.insertCode} />

            <div className="Editor__dropzone-base">
             
                <HotKeys keyMap={Editor.hotkeys} handlers={this.handlers}>
                  <Input
                    id = "entryInput"
                    className= "EntryInput"
                    autosize={{ minRows: 6, maxRows: 12 }}
                    onChange={this.onUpdate}
                    value = {this.state.entryValue}
                    onFocus = {this.onFocusEntry}
                    ref={ref => this.setInput(ref)}
                    type="textarea"
                    placeholder={intl.formatMessage({
                      id: 'story_placeholder',
                      defaultMessage: `Please share some knowledge about {topic}`,
                    }, {topic: chosenTitle || "the topic"})}
                  />
                </HotKeys> 
            </div>
         
          </Form.Item>
          
        
          
          {!isUpdating &&
          <div className = "Editor__createSteemPost">
            <span>Create a new Steem blog post </span>
            <Switch defaultChecked className="check" checkedChildren="" unCheckedChildren="" onChange={checked => this.setState({"createSteemPost": checked})} />
          </div>
          }
          <div className = "Editor__showdetail">
             <Switch checkedChildren="Options" unCheckedChildren="Options" onChange={checked => this.setState({"showFormDetail": checked})} />
          </div>
          <div style={{display:this.state.showFormDetail?'block':'none'}}>

       {this.isModerator() &&  
          <Form.Item
            label={
              <span className="Editor__label">
             
            </span>
            }
            extra='What is the content type for most part of your entry?'

          >
            {getFieldDecorator('contentType', {
              rules: [
                {
                  required: false,
                  message: 'Content Type is required',
                  type: 'string',
                }
              ],
            })(
              <Select
                style={{ width: 200 }}
                placeholder="Select content type"
                optionFilterProp="children"
                onChange={val => this.handleChange("contentType", val)}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option key="information" value="information">Information</Option>
                <Option key="opinion" value="opinion">Opinion</Option>
                <Option key="joke" value="joke">Joke</Option>
                <Option key="news" value="news">News</Option>
                <Option key="suggestion" value="suggestion">Suggestion</Option>
                <Option key="example" value="example">Example</Option>
                <Option key="quotation" value="quotation">Quotation</Option>
                <Option key="spoiler" value="spoiler">Spoiler</Option>
                <Option key="translation" value="translation">Translation</Option>
                <Option key="hedereference" value="hedereference">Hede Reference</Option>

              </Select>,
            )}
          </Form.Item>
          }
          <Form.Item
            label={
              <span className="Editor__label">
              Language
            </span>
            }
            extra='Which language is this entry written in?'

          >
            {getFieldDecorator('language', {
              rules: [
                {
                  required: false,
                  message: 'Entry language is required',
                  type: 'string',
                }
              ],
            })(
              <Select
                style={{ width: 200 }}
                placeholder="Auto detect"
                optionFilterProp="children"
                onChange={val => this.handleChange("language", val)}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
              <Option value="en">English</Option>
              <Option value="ar">Arabic</Option>
              <Option value="az">Azerbaijani</Option>
              <Option value="id">Bahasa</Option>
              <Option value="cn">Chinese</Option>
              <Option value="nl">Dutch</Option>
              <Option value="de">German</Option>
              <Option value="fr">French</Option>
              <Option value="it">Italian</Option>
              <Option value="kr">Korean</Option>
              <Option value="pl">Polish</Option>
              <Option value="pt">Portugese</Option>
              <Option value="ru">Russian</Option>
              <Option value="es">Spanish</Option>
              <Option value="th">Thai</Option>
              <Option value="tr">Turkish</Option>

              </Select>,
            )}
          </Form.Item>

          <Form.Item
            label={
              <span className="Editor__label">
              Theme
            </span>
            }
            extra='What is your entry mostly about?'

          >
            {getFieldDecorator('theme', {
              rules: [
                {
                  required: false,
                  message: 'What is your entry mostly about?',
                  type: 'string',
                }
              ]
            })(
              <Select
                style={{ width: 200 }}
                placeholder="Select theme"
                optionFilterProp="children"
                onChange={val=>this.handleChange("theme", val)}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="art">Art</Option>
                <Option value="aviation">Aviation</Option>
                <Option value="auto">Auto</Option>
                <Option value="business">Business</Option>
                <Option value="cinema">Cinema</Option>
                <Option value="crypto">Crypto</Option>
                <Option value="economy">Economy</Option>
                <Option value="education">Education</Option>
                <Option value="food">Food</Option>
                <Option value="game">Game</Option>
                <Option value="geography">Geography</Option>
                <Option value="hede">Hede</Option>
                <Option value="health">Health</Option>
                <Option value="history">History</Option>
                <Option value="music">Music</Option>
                <Option value="literature">Literature</Option>
                <Option value="people">People</Option>
                <Option value="philosophy">Philosophy</Option>
                <Option value="politics">Politics</Option>
                <Option value="programming">Programming</Option>
                <Option value="relations">Relations</Option>
                <Option value="science">Science</Option>
                <Option value="social-media">Social Media</Option>
                <Option value="sports">Sports</Option>
                <Option value="steem">Steem</Option>
                <Option value="tech">Tech</Option>
                <Option value="travel">Travel</Option>
                <Option value="tv">Tv</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item
            label={
              <span className="Editor__label">
              Tags
            </span>
            }
            extra='Separate tags with commas. Only lowercase letters, numbers and hyphen character is permitted.'
          >
            {getFieldDecorator('topics', {
              rules: [
                {
                  required: false,
                  message: 'Please enter extra tags',
                  type: 'array',
                },
                { validator: this.checkTopics },
              ],
            })(
              <Select
                ref={(ref) => {
                  this.select = ref;
                }}
                onChange={this.onUpdate}
                className="Editor__topics"
                mode="tags"
                placeholder='Add entry tags here'
                dropdownStyle={{ display: 'none' }}
                tokenSeparators={[' ', ',']}
              />,
            )}
          </Form.Item>
          <Form.Item
            label={
              <span className="Editor__label">
              Steem Title
            </span>
            }
            extra='This title will be shown on steemit.com, busy.org instead of topic name'
          >
            {getFieldDecorator('titleSteem', {
                rules: [
                
                  {
                    max: 255,
                    message: "Title can't be longer than 255 characters.",
                  },
                ],
              })(
             <Input
                ref={(title) => {
                  this.titleRef = title;
                }}
                onChange={this.onUpdate}
                className="Editor__title"
                placeholder='Steem title'
              />
              )}
          </Form.Item>
          
          {this.isModerator() && 

          <Form.Item
            label={
              <span className="Editor__label">
              Moderator Topic
            </span>
            }
            extra='Change this to move entry into another topic'
          >
            {getFieldDecorator('titleModerator', {
                rules: [
                  {
                    max: 255,
                    message: "Title can't be longer than 255 characters.",
                  },
                ],
              })(
             <Input
                ref={(title) => {
                  this.titleRefModerator = title;
                }}
                onChange={this.onUpdate}
                className="Editor__title"
                placeholder='Moderator new title'
              />
              )}
          </Form.Item>
          }
          <Form.Item
            className={classNames({ Editor__hidden: isUpdating })}
            label={
              <span className="Editor__label">
              Reward
            </span>
            }
          >
            {getFieldDecorator('reward', { initialValue: '50' })(
              <Select onChange={this.onUpdate} disabled={isUpdating}>
                <Select.Option value="100">
                  100% Steem Power
                </Select.Option>
                <Select.Option value="50">
                  50% SBD and 50% SP
                </Select.Option>
              </Select>,
            )}
          </Form.Item>

          {/*<SimilarPosts data={parsedPostData} />*/}


          </div>
          


          <div className="Editor__bottom">
             
             <div className="Editor__bottom__right">
               {saving && (
                 <span className="Editor__bottom__right__saving">
                 Saving...
               </span>
               )}
               <Form.Item className="Editor__bottom__submit">
                 {isUpdating ? (
                     <Action
                       primary
                       loading={loading}
                       disabled={loading}
                       text={intl.formatMessage({
                         id: loading ? 'post_send_progress' : 'post_update_send',
                         defaultMessage: loading ? 'Submitting' : 'Update post',
                       })}
                     />
                   ) : (
                     <Action
                       primary
                       loading={loading}
                       disabled={loading}
                       text={intl.formatMessage({
                         id: loading ? 'post_send_progress' : 'post_send',
                         defaultMessage: loading ? 'Submitting' : 'Post',
                       })}
                     />
                   )}
               </Form.Item>
             </div>
            {/*</div>*/}
        </div>
        </div>
      }
      </Form>
    );
  }
}

export default Form.create()(Editor);
