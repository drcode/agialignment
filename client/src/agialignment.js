import {useRef,useState,useEffect} from 'react';
import {useFragment} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import {uniqueId,partial,AppWrapper,mutate,directQuery} from '@lisperati/super-client';
import {AnimatePresence,motion} from 'framer-motion';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Tooltip from '@mui/material/Tooltip';

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

const adminUserid="lisperati";

function changer(setter){
  return (e)=>{
    setter(e.target.value);
  };
}

function Flex(props){
  const style={display:"flex",
               alignItems:"center"};
  if(props.wrap){
    style.flexWrap="wrap";
  }
  if(props.column){
    style.flexDirection="column";
  }
  if(props.between){
    style.justifyContent="space-between";
  }
  if(props.end){
    style.justifyContent="flex-end";
  }
  if(props.start){
    style.justifyContent="flex-start";
  }
  if(!style.justifyContent && props.center){
    style.justifyContent="center";
  }
  if(props.stretch){
    style.alignItems="stretch";
  }
  if(props.alignEnd){
    style.alignItems="end";
  }
  if(props.alignStart){
    style.alignItems="start";
  }
  return <motion.div style={{...style,
                             ...props.style}}
                     layoutId={props.layoutId}
                     animate={props.animate}
                     transition={props.transition}
         >
           {props.children}
         </motion.div>;
}

const avatarSize=5;
const avatarPadding=8;

function Avatar(props){
  const {x,y,aiResearcher,aiRisk,message}=props;
  const ref=useRef();
  const px=avatarPadding+(100-avatarPadding*2-avatarSize)*(x+1000)/2000;
  const py=avatarPadding+(100-avatarPadding*2-avatarSize)*(y+1000)/2000;
  const style={position:"absolute",
               left:`${px}%`,
               top:`${py}%`,
               width:`${avatarSize}%`,
               height:`${avatarSize}%`,
               background:`url(avatars/${props.userid})`,
               backgroundSize:"contain",
               backgroundRepeat:"no-repeat",
               zIndex:100,
              };
  return <Tooltip title="✓foo"
                  placement={y>0
                             ?"top"
                             :"bottom"}>
           <div style={{...style,
                        border:"solid",
                       }}
                key={props.userid}/>
         </Tooltip>;
}

function AvatarMovable(props){
  const {x,y,aiResearcher,aiRisk,message}=props;
  const ref=useRef();
  const [dragging,setDragging]=useState(false);
  const [keySeq,setKeySeq]=useState(0);
  const [anchorEl,setAnchorEl]=useState();
  const [aiResearcherNew,setAiResearcherNew]=useState(aiResearcher);
  const [aiRiskNew,setAiRiskNew]=useState(aiRisk);
  const [messageNew,setMessageNew]=useState(message);
  const changes=((message!==messageNew)||(aiResearcher!==aiResearcherNew)||(aiRisk!==aiRiskNew));
  function animationComplete(e){
    if (!dragging){
      return;
    }
    setDragging(false);
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
             {useridOverride:props.userid,x:x,y:y},
             (store)=>{},
             (store)=>{
               const avatar=store.get(props.id);
               avatar.setValue(x,"x");
               avatar.setValue(y,"y");
               setKeySeq(keySeq+1);
             });
  }
  function dragEnd(e){
    setDragging(true);
  }
  const px=avatarPadding+(100-avatarPadding*2-avatarSize)*(x+1000)/2000;
  const py=avatarPadding+(100-avatarPadding*2-avatarSize)*(y+1000)/2000;
  const style={position:"absolute",
               left:`${px}%`,
               top:`${py}%`,
               width:`${avatarSize}%`,
               height:`${avatarSize}%`,
               background:`url(avatars/${props.userid})`,
               backgroundSize:"contain",
               backgroundRepeat:"no-repeat",
               zIndex:100,
              };
  function handleClick(e){
    setAnchorEl(anchorEl?null:e.currentTarget);
  }
  function updateClick(e){
      mutate(graphql`mutation agialignmentUpdateAvatarMutation($useridOverride:String,$aiResearcher:Boolean,$aiRisk:Boolean,$message:String){
             updateAvatar(useridOverride:$useridOverride,aiResearcher:$aiResearcher,aiRisk:$aiRisk,message:$message){
                 id
                 aiResearcher
                 aiRisk
                 message
           }}`,
             {useridOverride:props.userid,
              aiResearcher:aiResearcherNew,
              aiRisk:aiRiskNew,
              message:messageNew},
             (store)=>{},
             (store)=>{
             });
  }
  function handleChange(e){
    const val=e.target.value;
    if(val.length<=500)
      setMessageNew(val);
  }
  function aiResearcherChange(e){
    setAiResearcherNew(e.target.checked);
    setAiRiskNew(false);
  }
  function aiRiskChange(e){
    setAiRiskNew(e.target.checked);
    setAiResearcherNew(false);
  }
  return <motion.div style={{...style,
                             background:"url(stripes.gif)",
                            }}
                     drag
                     ref={ref}
                     whileDrag={{scale:1.5}}
                     dragMomentum={false}
                     onAnimationComplete={animationComplete}
                     onDragEnd={dragEnd}
                     dragConstraints={props.dragConstraints}
                     key={`${props.userid}_${keySeq}`}>
           <div style={{position:"absolute",
                        left:"5%",
                        right:"5%",
                        top:"5%",
                        bottom:"5%",
                        background:`url(avatars/${props.userid})`,
                        backgroundSize:"contain",
                        backgroundPosition:"center",
                       }}
                onClick={handleClick}
           />
           <Popper open={Boolean(anchorEl)}
                   anchorEl={{anchorEl}}>
             <Flex column
                   style={{background:"#1da1f2",
                           padding:"2rem",
                           borderRadius:"1rem",
                           color:"white",
                          }}>
               <div style={{marginBottom:"1rem"}}>Are you an...</div>
               <FormGroup>
                 <FormControlLabel control={<Switch />}
                                   checked={aiResearcherNew}
                                   onChange={aiResearcherChange}
                                   label="AI Researcher?"/>
                 <FormControlLabel control={<Switch />}
                                   checked={aiRiskNew} 
                                   onChange={aiRiskChange}
                                   label="AI Risk Researcher?"/>
               </FormGroup>
               <TextField style={{marginTop:"1rem"}}
                          multiline
                          value={messageNew}
                          onChange={handleChange}
                          placeholder="Your bio/message (500 chars)" />
               <br/>
               <Button variant="contained"
                       onClick={updateClick}
                       disabled={!changes}>
                 Update
               </Button>
             </Flex>
           </Popper>
         </motion.div>;
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

function useHover() {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
      else
        return ()=>{};
    });
  return [ref, value];
}

function Chart(props){
  const [hoverRef, isHovered] = useHover();
  const [pos,setPos]=useState([0,0]);
  const ref=useRef();
  function mouseMove(e){
    const containerRect=e.currentTarget.getBoundingClientRect();
    const avatarWidth=containerRect.width*avatarSize/100;
    const avatarHeight=containerRect.height*avatarSize/100;
    const x=Math.min(1000,Math.max(-1000,Math.round((e.clientX-containerRect.x)*2000/(containerRect.width-avatarWidth*5)-1000)));
    const y=Math.min(1000,Math.max(-1000,Math.round((e.clientY-containerRect.y)*2000/(containerRect.height-avatarHeight*5)-1000)));
  }
  return <div style={{maxHeight:"100%",
                      maxWidth:"100%",
                      marginLeft:"auto",
                      marginRight:"auto",
                      marginTop:"auto",
                      marginBottom:"auto",
                      aspectRatio:"1/1",
                      background:"white",
                      position:"relative",
                     }}
              onMouseMove={mouseMove}>
           <svg viewBox="0 0 100 100"
                style={{width:"100%",
                        height:"100%",
                       }}>
             {range(4).map((n)=>{
               const ptsBlock=[[50,50],[100-avatarPadding,50],[100-avatarPadding,100-avatarPadding],[50,100-avatarPadding]];
               const sBlock=svgPoints(ptsBlock.map(([x,y])=>rotate(50,50,x,y,n*Math.PI/2)));
               return <g key={"b"+n}>
                        <polygon points={sBlock}
                                  fill="#9fd7f9"/>
                      </g>;
             })}
             {range(4).map((n)=>{
               const ptsStem=[[50,50],[99,50]];
               const sStem=svgPoints(ptsStem.map(([x,y])=>rotate(50,50,x,y,n*Math.PI/2)));
               const ptsArrow=[[95,47],[99,50],[95,53]];
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
             if (movable)
               return <AvatarMovable key={avatar.userid}
                                     dragConstraints={ref}
                                     {...avatar}/>;
             else
               return <Avatar key={avatar.userid}
                              {...avatar}/>;
           })}
         </div>;
}

function App(props){
  const [otherUserId,setOtherUserid]=useState();
  const activeUserId=otherUserId||props.userid;
  function signinClick(){
    directQuery(graphql`
       query agialignmentUrlQuery {
          url
       }`,{}).then((data)=>{
         window.location.href=data.url;
       });
  }
  function addClick(){
      mutate(graphql`mutation agialignmentAddAvatarMutation($useridOverride:String){
             addAvatar(useridOverride:$useridOverride){
               id
               avatars{
                 id
                 userid
                 x
                 y
               }}}`,
             {useridOverride:otherUserId},
             (store)=>{},
             (store)=>{
             });
  }
  return <Flex stretch
               style={{height:"100vh"}}>
           <Flex column
             center
                 style={{width:"33%",
                         background:"#1da1f2",
                        }}>
             <div style={{fontFamily:"Fredoka One",
                          fontSize:"4rem",
                          textAlign:"Center",
                          color:"white",
                          borderRadius:"2rem",
                          padding:"2rem",
                          marginTop:"2rem",
                         }}>
               AGI Alignment<br />
               Folks on Twitter
             </div>
             <div style={{fontSize:"2rem",
                          textAlign:"Center",
                          background:"#9fd7f9",
                          color:"#0a6ca9",
                          borderRadius:"2rem",
                          padding:"2rem",
                          marginBottom:"2rem",
                          marginTop:"2rem",
                          width:"70%",
                         }}>
               Log in to twitter to add/edit/delete your avatar on the alignment chart
               <br/>
               <br/>
               <Button onClick={signinClick}
                       variant="contained"
               size="large">
                 Twitter Login
               </Button>
               <br/>
               <br/>
               After you are done, you can go <a href="http://example.com">here</a> to fully disconnect this app from twitter
               <br/>
             </div>
             <Button variant="contained"
                     color="secondary">
               Delete all my data from this site
             </Button>
             
             {props.userid===adminUserid
              && <div>
                   <input onChange={changer(setOtherUserid)}></input>
                   <button onClick={addClick}>add</button>
                 </div>}
           </Flex>
           <div style={{width:"67%",
                        padding:"1rem",
                       }}>
             <Chart {...{...props}} userid={activeUserId}/>
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
                                   aiResearcher
                                   aiRisk
                                   followers
                                   message
                                   x
                                   y
                                }
                             }
                          }
                          `,
                          queryParams(),
                          8892);
