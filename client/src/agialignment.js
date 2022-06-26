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

const useridOverride=Object.fromEntries((new URLSearchParams(window.location.search)).entries()).useridOverride;

function Avatar(props){
  const ref=useRef();
  function dragEnd(e,info){
    setTimeout(()=>{
      const container=props.dragConstraints.current;
      const containerRect=container.getBoundingClientRect();
      const avatarRect=ref.current.getBoundingClientRect();
      const x=Math.min(1000,Math.max(-1000,Math.round((avatarRect.x-containerRect.x)*2000/(containerRect.width-avatarRect.width)-1000)));
      const y=Math.min(1000,Math.max(-1000,Math.round((avatarRect.y-containerRect.y)*2000/(containerRect.height-avatarRect.height)-1000)));
      mutate(graphql`mutation agialignmentUpdateAvatarPositionMutation($useridOverride:String,$x:Int,$y:Int){
             updateAvatarPosition(useridOverride:$useridOverride,x:$x,y:$y){
                 id
                 x
                 y}}`,
             {useridOverride,x:x,y:y},
             (store)=>{},
             (store)=>{
               const avatar=store.get(props.id);
               avatar.setValue(x,"x");
               avatar.setValue(y,"y");
             });
    },1000);
  }
  const {x,y}=props;
  dbg({x});
  dbg({y});
  const px=avatarPadding+(100-avatarPadding*2-avatarSize)*(x+1000)/2000;
  const py=avatarPadding+(100-avatarPadding*2-avatarSize)*(y+1000)/2000;
  const style={position:"absolute",
               left:`${px}%`,
               top:`${py}%`,
               width:`${avatarSize}%`,
               height:`${avatarSize}%`,
               background:"yellow",
               border:"solid",
              };
  if(props.movable){
    return <motion.div style={{transform:"translateX(0) translateY(0)",
                               ...style,
                               background:"green",
                               zIndex:100,
                              }}
                       drag
                       ref={ref}
                       whileDrag={{scale:1.5}}
                       dragMomentum={false}
                       onDragEnd={dragEnd}
                       dragConstraints={props.dragConstraints}
                key={props.userid}/>;
  }
  else {
    return <div style={style}
                key={props.userid}/>;
  }
}

function svgPoints(points){
  return points.map(([x,y])=>`${x},${y}`).join(" ");
}

function rotate(cx, cy, x, y, radians) {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
  const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
}

function range(n){
  return [...Array(n).keys()];
}

function Chart(props){
  const ref=useRef();
  return <div style={{maxHeight:"100%",
                      maxWidth:"100%",
                      marginLeft:"auto",
                      marginRight:"auto",
                      marginTop:"auto",
                      marginBottom:"auto",
                      aspectRatio:"1/1",
                      background:"white",
                      position:"relative",
                     }}>
           <svg viewBox="0 0 100 100"
                style={{width:"100%",
                        height:"100%",
                       }}>
             {range(4).map((n)=>{
               const ptsBlock=[[50,50],[100-avatarPadding,50],[100-avatarPadding,100-avatarPadding],[50,100-avatarPadding]];
               const sBlock=svgPoints(ptsBlock.map(([x,y])=>rotate(50,50,x,y,n*Math.PI/2)));
               return <g key={"b"+n}>
                        <polygon points={sBlock}
                                  fill="blue"/>
                      </g>;
             })}
             {range(4).map((n)=>{
               const ptsStem=[[50,50],[100,50]];
               const sStem=svgPoints(ptsStem.map(([x,y])=>rotate(50,50,x,y,n*Math.PI/2)));
               const ptsArrow=[[97,47],[100,50],[97,53]];
               const sArrow=svgPoints(ptsArrow.map(([x,y])=>rotate(50,50,x,y,n*Math.PI/2)));
               return <g key={"l"+n}>
                        <polyline key="a"
                                  points={sStem}
                                  stroke="black"
                                  strokeLinecap="round"
                                  fill="none"/>
                        <polyline key="b"
                                  points={sArrow}
                                  stroke="black"
                                  strokeLinecap="round"
                                  fill="none"/>
                      </g>;
             })}
           </svg>
           <div style={{position:"absolute",
                        width:`${100-avatarPadding*2}%`,
                        height:`${100-avatarPadding*2}%`,
                        left:`${avatarPadding}%`,
                        top:`${avatarPadding}%`,
                       }}
                ref={ref}/>
           {props.avatars.map((avatar)=>{
             const movable=props.userid===avatar.userid;
             return <Avatar key={avatar.userid}
                            movable={movable}
                            dragConstraints={ref}
                            {...avatar}/>;
           })}
         </div>;
}

function App(props){
  function signinClick(){
    directQuery(graphql`
       query agialignmentUrlQuery {
          url
       }`,{}).then((data)=>{
         window.location.href=data.url;
       });
  }
  return <Flex stretch
               style={{height:"100vh"}}>
           <div>
             <button onClick={signinClick}>Twitter Login</button>
           </div>
           <div style={{flexGrow:1,
                        background:"red",
                        padding:"1rem",
                       }}>
             <Chart {...{...props}} />
           </div>
         </Flex>;
}

function queryParams(){
  const params=Object.fromEntries((new URLSearchParams(window.location.search)).entries());
  if (params.oauth_token){
    return {oauthToken:params.oauth_token,
            oauthVerifier:params.oauth_verifier,
useridOverride:params.useridOverride,
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
