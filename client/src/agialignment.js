import {useRef,useState,useEffect} from 'react';
import {useFragment} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import {uniqueId,partial,AppWrapper,mutate,directQuery} from '@lisperati/super-client';
import {AnimatePresence,motion} from 'framer-motion';    

function dbg(s,val){
  if(typeof s==="object"){
    const key=Object.keys(s)[0];
      val=s[key];
     s=key;
  }
  console.log(s+"=");
  console.log(val);
  return val;
}

export const ignoreDbg=dbg; 

function App(props){
  dbg({props});
  function signinClick(){
    directQuery(graphql`
       query agialignmentUrlQuery {
          url
       }`,{}).then((data)=>{
         dbg({data});
         window.location.href=data.url;
       });
  }
  return <div>
            <button onClick={signinClick}>Twitter Login</button>
         </div>;
}

function queryParams(){
  const params=Object.fromEntries((new URLSearchParams(window.location.search)).entries());
  if (params.oauth_token){
    return {oauthToken:params.oauth_token,
            oauthVerifier:params.oauth_verifier,
           };
  }
  return {};
}

export default AppWrapper(App,
                          graphql`
                          query agialignmentQuery($oauthToken:String,$oauthVerifier:String) {
                             app(oauthToken:$oauthToken,oauthVerifier:$oauthVerifier){
                                id
                                userid
                                avatars{
                                   id
                                   userid
                                }
                             }
                          }
                          `,
                          queryParams(),
                          8892);
