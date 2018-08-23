import React from 'react';
import Avatar from '../Avatar';
import steem from 'steem';

import Icon from 'antd/lib/icon'; 

import MdLanguage from 'react-icons/lib/md/language';
import MdPalette from 'react-icons/lib/md/palette';
import MdWeekend from 'react-icons/lib/md/weekend';

import { Link } from 'react-router-dom';
import Action from '../../components/Button/Action';
import { setTimeout } from 'timers';
import {forEach, filter, keys} from 'lodash';

import './SideAnnouncement.less';

var search = {};

const generateArrayFromObject = (input) =>{
  let arrayToReturn = [];

  forEach(input, (v, k)=>{
    forEach(v, (v1, k1)=>{
      forEach(v1, (v2, k2)=>{
        arrayToReturn.push({l: k, c: k1, t: k2, e: v2});
      })
    })
  })

  return arrayToReturn;

}

/*let selectedLanguage = null;
let selectedContentType = null;
let selectedTheme = null;
let selectedEntry = null;
*/

const getFilterQuery = (l, c, t) => {
  let filter = {}
  if(l)
    filter["l"] = l;
  if(c)
    filter["c"] = c;
  if(t)
    filter["t"] = t;
    
  return filter;
}

let filteredObjects = [];
let groupByLanguage = {};
let groupByContentType = {};
let groupByTheme = {};

let lastLanguage = "1111", lastContentType = "1111", lastTheme = "1111", lastTopic= "";

const TopicFilters = ({topic, tags, filters, location, history}) =>{
  if(!search[topic] || (lastTopic!== topic)){
    search[topic] = generateArrayFromObject(filters);
  }

  //console.log("filter objects:", filters);

  //console.log("all objects:", search[topic]);

  const qsParams = new URLSearchParams(location.search);

  if(lastTopic!== topic || qsParams.get("l")!== lastLanguage || qsParams.get("c")!== lastContentType || qsParams.get("h")!== lastTheme){

    filteredObjects = filter(search[topic], getFilterQuery(qsParams.get("l"), qsParams.get("c"), qsParams.get("h")));

    groupByLanguage = {} 
    groupByContentType = {}
    groupByTheme= {}
  

    forEach(filteredObjects, function(v,k){
      if(groupByLanguage[v.l])
        groupByLanguage[v.l] += v.e;
      else
        groupByLanguage[v.l] = v.e;


      if(groupByContentType[v.c])
        groupByContentType[v.c] += v.e;
      else
        groupByContentType[v.c] = v.e;


      if(groupByTheme[v.t])
        groupByTheme[v.t] += v.e;
      else
        groupByTheme[v.t] = v.e;


    });
  }



  lastContentType = qsParams.get("c");
  lastLanguage = qsParams.get("l");
  lastTheme = qsParams.get("h");
  lastTopic = topic;

  //groupByLanguage = _.groupBy(filteredObjects, 'l');
  /*groupByLanguage = _.reduce(filteredObjects, function(result, v, k){
    console.log("group v:", v);
    console.log("group result:", result);

    let aa = v.l;
    if(!result[aa])
      result[aa] = 0;

    result[aa] += v.e;
    return result;
  }, {});
  


  //groupByContentType = _.groupBy(filteredObjects, 'c');
  groupByContentType = _.reduce(filteredObjects, function(result, v, k){
    let aa = v.c;
    if(!result[aa])
      result[aa] = 0;

    result[aa] += v.e;  
    return result;

  }, {});


  //groupByTheme = _.groupBy(filteredObjects, 't');
  groupByTheme = _.reduce(filteredObjects, function(result, v, k){
    let aa = v.t;
    if(!result[aa])
      result[aa] = 0;

    result[aa] += v.e;
    return result;

  }, {});
  */
  /*console.log("groupByTheme:", groupByTheme);
  console.log("groupByContentType:", groupByContentType);
  console.log("groupByLanguage:", groupByLanguage);
*/

  const onThemeClick = (e, theme) => {
    const qsParams = new URLSearchParams(location.search);

    qsParams.set("h", theme);
    history.push({
      pathname: location.pathname,
      search: '?'+ qsParams.toString()
    });
    e.preventDefault();

    return false;
  }

  const onTypeClick = (e, type) => {
    const qsParams = new URLSearchParams(location.search);

    qsParams.set("c", type);
    history.push({
      pathname: location.pathname,
      search: '?'+ qsParams.toString()
    });
    e.preventDefault();

    return false;
  }

  const onLanguageClick = (e, lang) => {
    const qsParams = new URLSearchParams(location.search);

    qsParams.set("l", lang);
    history.push({
      pathname: location.pathname,
      search: '?'+ qsParams.toString()
    });
    e.preventDefault();

    return false;
  }

  const onRemoveFilter = (e, f) => {
    const qsParams = new URLSearchParams(location.search);

    qsParams.delete(f);
    history.push({
      pathname: location.pathname,
      search: '?'+ qsParams.toString()
    });
    e.preventDefault();

    return false;
  }

  const removeFilterLink = (f) => {
    const qsParams = new URLSearchParams(location.search);

    qsParams.delete(f);
    return location.pathname +'?'+ qsParams.toString()
   
  }

  const getThemeLink = (type) => {
    const qsParams = new URLSearchParams(location.search);

    qsParams.set("h", type);
    return location.pathname +'?'+ qsParams.toString()
   
  }

  const getTypeLink = (type) => {
    const qsParams = new URLSearchParams(location.search);

    qsParams.set("c", type);
    return location.pathname +'?'+ qsParams.toString()
   
  }


  const getLanguageLink = (lang) => {
    const qsParams = new URLSearchParams(location.search);

    qsParams.set("l", lang);
    return location.pathname +'?'+ qsParams.toString()
   
  }

  return (
  <div className="Announcement">
   <div className="Announcement__container">
   <h4 className="Announcement__supertitle">FILTER ENTRIES</h4>

          <b className="Announcement__subtitle"><MdLanguage /> Language</b>
          <div className="Announcement__divider"/>

          {keys(groupByLanguage).map((k)=>
               (<div key={k + '-' + groupByLanguage[k]} id="announcement1" className="Announcement__single">
                {/*groupByLanguage[k]>0?*/
                (qsParams.get("l") !== k?
                  <a className="Announcement__content" href={getLanguageLink(k)} onClick={(e)=>onLanguageClick(e, k)}>{k} ({groupByLanguage[k]})</a>
                :
                  <a className="Announcement__content" href={removeFilterLink("l")} onClick={(e)=>onRemoveFilter(e, "l")}>{k} ({groupByLanguage[k]}) X</a>
                )
               }
              </div>)
           
            )
          
          }
          
  </div>
  <div className="Announcement__container">
          <b className="Announcement__subtitle"><MdPalette />Theme</b>
          <div className="Announcement__divider"/>

          {keys(groupByTheme).map((k)=>
               (<div key={k + '-' + groupByTheme[k]} id="announcement1" className="Announcement__single">
                {groupByTheme[k]>0?
                  (qsParams.get("h") !== k?
                   <a className="Announcement__content" href={getThemeLink(k)} onClick={(e)=>onThemeClick(e, k)}>{k} ({groupByTheme[k]})</a>
                   :
                   <a className="Announcement__content" href={removeFilterLink("h")} onClick={(e)=>onRemoveFilter(e, "h")}>{k} ({groupByTheme[k]}) X</a>

                ):null
              }
              </div>)
           
            )
          
          }
         
        
  </div>
  {/*<div className="Announcement__container">

      <b className="Announcement__subtitle"><MdWeekend /> Type</b>
      <div className="Announcement__divider"/>

      {keys(groupByContentType).map((k)=>
               (<div key={k + '-' +groupByContentType[k]} id="announcement1" className="Announcement__single">
               {groupByContentType[k]>0?
                (qsParams.get("c") !== k?
                 <a className="Announcement__content" href={getTypeLink(k)} onClick={(e)=>onTypeClick(e, k)}>{k} ({groupByContentType[k]})</a>
                 :
                   <a className="Announcement__content" href={removeFilterLink("c")} onClick={(e)=>onRemoveFilter(e, "c")}>{k} ({groupByContentType[k]}) X</a>

               ):null
                }
              </div>)
           
            )
          
          }
      
        </div> */}
</div> );
}


export default TopicFilters;
