import React from 'react';
import PropTypes from 'prop-types';
import embedjs from 'embedjs';
import PostFeedEmbed from './PostFeedEmbed';
import BodyShort from './BodyShort';
import Body from './Body';

import { jsonParse } from '../../helpers/formatter';
import { image } from '../../vendor/steemitLinks';
import {
  getPositions,
  isPostStartsWithAPicture,
  isPostStartsWithAnEmbed,
  isPostWithPictureBeforeFirstHalf,
  isPostWithEmbedBeforeFirstHalf,
} from './StoryHelper';
import { getHtml } from './Body';
import { getProxyImageURL } from '../../helpers/image';

const StoryPreview = ({ text }) => {
  // console.log("StoryPreview", text);
  return (
    <div>
      <Body key="text" className="Story__content__body" body={text} />
    </div>
  );
};

StoryPreview.propTypes = {
  text: PropTypes.string,
};

export default StoryPreview;
