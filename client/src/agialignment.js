import {useRef,useState,useEffect} from 'react';
import {useFragment} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import {uniqueId,partial,AppWrapper,mutate} from '@lisperati/super-client';
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
  return <div>yo world</div>;
                             
}

export default AppWrapper(App,graphql`
  query agialignmentQuery {
    app{
      id
    }
  }
`,
{}
  ,
  8891);
