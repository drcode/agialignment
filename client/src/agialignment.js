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

function Flex(props){
  const style={display:"flex",
               alignItems:"center"};
  if(props.column){
    style.flexDirection="column";
  }
  if(props.between){
    style.justifyContent="space-between";
  }
  if(!style.justifyContent && props.center){
    style.justifyContent="center";
  }
  if(props.stretch){
    style.alignItems="stretch";
  }
  return <div style={{...style,
                      ...props.style}}>
           {props.children}
         </div>;
}

const avatarSize=5;
const avatarPadding=8;

function Avatar(props){
  const {x,y}=props;
  const px=avatarPadding+(100-avatarPadding*2-avatarSize)*(x+1000)/2000;
  const py=avatarPadding+(100-avatarPadding*2-avatarSize)*(y+1000)/2000;
  const style={position:"absolute",
               left:`${px}%`,
               top:`${py}%`,
               width:`${avatarSize}%`,
               height:`${avatarSize}%`,
               background:"yellow",
            };
  if(props.movable){
    console.log("mov");
    return <div style={{...style,
                        background:"green",
                        }}
                key={props.userid}/>;
  }
  else {
    return <div style={style}
                key={props.userid}/>;
  };
}

function Chart(props){
  return <div style={{maxHeight:"100%",
                      maxWidth:"100%",
                      marginLeft:"auto",
                      marginRight:"auto",
                      marginTop:"auto",
                      marginBottom:"auto",
                      aspectRatio:"1/1",
                      background:"black",
                      position:"relative",
                     }}>
           {props.avatars.map((avatar)=><Avatar key={avatar.userid}
                                                movable={props.userid===avatar.userid}
                                                {...avatar}/>)}
         </div>;
}

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
  return <Flex stretch
               style={{height:"100vh"}}>
           <div>
             <button onClick={signinClick}>Twitter Login</button>
           </div>
           <div style={{flexGrow:1,
                        background:"red"}}>
             <Chart {...{...props,
                         userid:"derp0"}} />
           </div>
         </Flex>;
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
                                   x
                                   y
                                }
                             }
                          }
                          `,
                          queryParams(),
                          8892);
