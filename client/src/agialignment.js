import {useRef,useState,useEffect} from 'react';
import graphql from 'babel-plugin-relay/macro';
import {partial,AppWrapper,mutate,directQuery} from '@lisperati/super-client';
import {motion} from 'framer-motion';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
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

const timeRange=[2300,2286,2273,2260,2248,2236,2225,2214,2204,2194,2185,2176,2168,2160,2152,2145,2138,2131,2125,2119,2114,2108,2103,2099,2094,2090,2086,2082,2079,2076,2073,2070,2067,2065,2062,2060,2058,2056,2054,2053,2051,2050,2048,2047,2046,2045,2044,2043.3,2042.5,2042,2041,2040.4,2039.7,2039.2,2038.6,2038.1,2037.7,2037.2,2036.8,2036.4,2036,2035.6,2035.2,2034.8,2034.4,2034.1,2033.7,2033.3,2032.9,2032.5,2032.1,2031.7,2031.3,2030.9,2030.4,2030,2029.6,2029.1,2028.7,2028.2,2027.7,2027.3,2026.8,2026.3,2025.9,2025.4,2025,2024.6,2024.2,2023.8,2023.4,2023.1,2022.8,2022.7,2022.6,2022.5,2022.4,2022.3,2022.2,2022.1,2022];

const riskRange=[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,1.2,1.4,1.7,2,2.4,2.7,3.1,3.5,3.9,4.4,4.9,5.4,5.9,6.4,7,7.6,8.2,9,9.5,10.2,11,11.6,12.3,13,14,15,15.5,16.4,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,33,34,35,36,37,38,40,41,42,44,45,46,47,49,50,52,53,54,56,57,59,60,62,63,64,66,68,69,71,72,74,75,77,78,80,82,83,85,87,88,90,92,93,95,97,98,100];

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

function avatarZIndex(followers){
  return Math.round(1+(Math.log(followers)*10));
}

function Avatar(props){
  const [hoverRef,isHovered]=useHover();
  const [anchorEl,setAnchorEl]=useState();
  const [pushed,setPushed]=useState(false);
  const {x,y,aiResearcher,aiRisk,message,userid,followers}=props;
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
              };
  if(!props.allowPopper&&anchorEl){
    setAnchorEl(null);
  }
  function handleClick(e){
    const el=anchorEl?null:e.currentTarget;
    setAnchorEl(el);
    props.onPopperChange(Boolean(el));
  }
  function pushToBottomClick(e){
    e.stopPropagation();
    setPushed(!pushed);
    setAnchorEl(null);
    props.onPopperChange(false);
  }
  return <div style={{...style,
                      border:"solid",
                      zIndex:pushed?0:avatarZIndex(followers),
                     }}
              key={props.userid}
              onClick={handleClick}
              ref={hoverRef}>
           <Popper open={Boolean(anchorEl)||(isHovered&&props.allowPopper)}
                   placement={y<0
                              ?"bottom"
                              :"top"}
                   style={{zIndex:200}}
                   modifiers={[{
                     name:"offset",
                     options:{offset:[0,1]}}]}
                   anchorEl={anchorEl||hoverRef.current}>
             <Flex column
                   style={{background:"#1da1f2",
                           padding:"1rem",
                           borderRadius:"0.5rem",
                           color:"white",
                           maxWidth:"20rem",
                           boxShadow:anchorEl && "0.3rem 0.3rem 1rem #003",
                          }}>
               <div style={{marginBottom:"1rem"}}>
                 <a href={`https://twitter.com/${userid}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{color:"white"}}>@{userid}
                 </a>
                 {aiResearcher
                  && <span> - AI Researcher</span>}
                 {aiRisk
                  && <span> - AI Risk Researcher</span>}
               </div>
               <div style={{marginBottom:"1rem"}}>
                 {message}
               </div>
               <Button variant="contained"
                       onClick={pushToBottomClick}>
                 {pushed
                  ?"Unpush Avatar to Bottom"
                  :"Push Avatar To Bottom"}
               </Button>
             </Flex>
           </Popper>
         </div>;
}

function AvatarMovable(props){
  const {x,y,aiResearcher,aiRisk,message,userid}=props;
  const ref=useRef();
  const refImage=useRef();
  const [dragging,setDragging]=useState(false);
  const [keySeq,setKeySeq]=useState(0);
  const [anchorEl,setAnchorEl]=useState();
  const [aiResearcherNew,setAiResearcherNew]=useState(aiResearcher);
  const [aiRiskNew,setAiRiskNew]=useState(aiRisk);
  const [messageNew,setMessageNew]=useState(message);
  const changes=((message!==messageNew)||(aiResearcher!==aiResearcherNew)||(aiRisk!==aiRiskNew));
  useEffect(()=>{
    setAnchorEl(refImage.current);
    props.onPopperChange(true);
  },[]);
  if(!props.allowPopper&&anchorEl){
    setAnchorEl(null);
  }
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
               setAnchorEl(null);
               props.onPopperChange(false);
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
              };
  function handleClick(e){
    const el=anchorEl?null:e.currentTarget;
    setAnchorEl(el);
    props.onPopperChange(Boolean(el));
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
                             zIndex:199,
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
                ref={refImage}
                onClick={handleClick}
           />
           <Popper open={Boolean(anchorEl)&&props.allowPopper}
                   style={{zIndex:200}}
                   placement={y<0
                              ?"bottom"
                              :"top"}
                   anchorEl={anchorEl}>
             <Flex column
                   style={{background:"#1da1f2",
                           padding:"2rem",
                           borderRadius:"1rem",
                           color:"white",
                           boxShadow:"0.3rem 0.3rem 1rem #003",
                          }}>
               <div style={{marginBottom:"1rem"}}>@{userid}, are you an...</div>
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
    <TextField style={{marginTop:"1rem",
                       background:"white",
                       borderRadius:"0.25rem",}}
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
  const [popperUserid,setPopperUserid]=useState();
  const [x,setX]=useState(0);
  const [y,setY]=useState(0);
  const ref=useRef();
  function mouseMove(e){
    const containerRect=e.currentTarget.getBoundingClientRect();
    setX(Math.min(100,Math.max(0,Math.round((((e.clientX-containerRect.x)*100/containerRect.width)-avatarPadding-avatarSize/2)*100/(100-avatarPadding*2-avatarSize)))));
    setY(Math.min(100,Math.max(0,Math.round((((e.clientY-containerRect.y)*100/containerRect.height)-avatarPadding-avatarSize/2)*100/(100-avatarPadding*2-avatarSize)))));
  }
  const xView=avatarPadding+avatarSize/2+x*(100-avatarPadding*2-avatarSize)/100;
  const yView=avatarPadding+avatarSize/2+y*(100-avatarPadding*2-avatarSize)/100;
  function popperChange(userid,val){
    if(val){
      setPopperUserid(userid);
    }
    else {
      setPopperUserid(null);
    }
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
              ref={hoverRef}
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
             <text x="50"
                   y="4.5"
                   fill="#9fd7f9"
                   fontSize="20%"
                   textAnchor="middle">
               AGI Will Not Destroy All Future Value
             </text>
             <text x="50"
                   y="97.8"
                   fill="#9fd7f9"
                   fontSize="20%"
                   textAnchor="middle">
               AGI Will Destroy All Future Value
             </text>
             <g key="ll"
                transform="translate(4,50)">
               <text x="0"
                     y="0"
                   fill="#9fd7f9"
                     fontSize="20%"
                 textAnchor="middle"
                     transform="rotate(-90)">
                 AGI not soon
               </text>
             </g>
             <g key="lr"
                transform="translate(96,50)">
               <text x="0"
                     y="0"
                   fill="#9fd7f9"
                     fontSize="20%"
                 textAnchor="middle"
                     transform="rotate(90)">
                 AGI soon
               </text>
             </g>
             {isHovered
              && <g key="ax">
                   <text x={xView+"%"}
                         y={avatarPadding+"%"}
                         fill="#9fd7f9"
                         fontSize="20%"
                         textAnchor="middle">
                     {timeRange[x]}
                   </text>
                   <g transform={`translate(${avatarPadding},${yView})`}>
                     <text x="0"
                           y="0"
                           fill="#9fd7f9"
                           fontSize="20%"
                           textAnchor="middle"
                           transform={"rotate(-90)"}>
                     {riskRange[y]+"%"}
                   </text>
                   </g>
                 </g>
             }
             {range(4).map((n)=>{
               const ptsStem=[[50,50],[94,50]];
               const sStem=svgPoints(ptsStem.map(([x,y])=>rotate(50,50,x,y,n*Math.PI/2)));
               const ptsArrow=[[90,47],[94,50],[90,53]];
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
             let visible=false;
             if (props.filter["AI Researchers"]&&avatar.aiResearcher)
               visible=true;
             if (props.filter["AI Risk Researchers"]&&avatar.aiRisk)
               visible=true;
             if (props.filter["Other Experts"]&&avatar.expert)
               visible=true;
             if (props.filter[">5000 followers"]&&avatar.followers>5000)
               visible=true;
             if (props.filter[">50,000 followers"]&&avatar.followers>50000)
               visible=true;
             if (props.filter["Everyone Else"]&&!(avatar.aiResearcher||avatar.aiRisk||avatar.expert||avatar.followers>5000))
               visible=true;
             if(!visible)
               return null;
             const movable=props.userid===avatar.userid;
             if (movable)
               return <AvatarMovable key={avatar.userid}
                                     dragConstraints={ref}
                                     allowPopper={(!popperUserid)||(popperUserid===avatar.userid)}
                                     onPopperChange={partial(popperChange,avatar.userid)}
                                     {...avatar}/>;
             else
               return <Avatar key={avatar.userid}
                              allowPopper={(!popperUserid)||(popperUserid===avatar.userid)}
                              onPopperChange={partial(popperChange,avatar.userid)}
                              {...avatar}/>;
           })}
         </div>;
}

function App(props){
  const params=Object.fromEntries((new URLSearchParams(window.location.search)).entries());
  const [otherUserId,setOtherUserid]=useState();
  const activeUserId=otherUserId||props.userid;
  const [filter,setFilter]=useState({"AI Researchers":true,
                                     "AI Risk Researchers":true,
                                     "Other Experts":true,
                                     ">5000 followers":true,
                                     ">50,000 followers":true,
                                     "Everyone Else":true});
  if(!params.oauth_token&&!params.abcd)
    return <div/>;
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
  function filterClick(k){
    const f={...filter};
    f[k]=!f[k];
    setFilter(f);
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
                          background:"#bfe7ff",
                          color:"#1a90d9",
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
             {activeUserId
              && <Button variant="contained"
                         color="secondary">
                   Delete all my data from this site
                 </Button>}
             {props.userid===adminUserid
              && <div>
                   <input onChange={changer(setOtherUserid)}></input>
                   <button onClick={addClick}>add</button>
                 </div>}
             <div style={{fontSize:"2rem",
                          textAlign:"Center",
                          color:"#cfecff",
                          marginTop:"2rem",
                         }}>
               Filters
             </div>
             <Flex wrap
                   center
                   style={{marginLeft:"3rem",
                                marginRight:"3rem",
                               }}>
               {Object.entries(filter).map(([k,v])=><div key={k}
                                                         style={{fontSize:"2rem",
                                                                 textAlign:"Center",
                                                                 color:v?"#1a90d9":"#bfe7ff",
                                                                 background:v?"#bfe7ff":"#1a90d9",
                                                                 margin:"0.5rem",
                                                                 padding:"0.5rem",
                                                                 borderStyle:"solid",
                                                                 borderColor:"#cfecff",
                                                                 borderRadius:"1rem",
                                                                 cursor:"pointer",
                                                                 userSelect:"none",
                                                                }}
                                                         onClick={partial(filterClick,k)}>
                                                      {dbg({k})}
                                                    </div>)}
             </Flex>
           </Flex>
           <div style={{width:"67%",
                        padding:"1rem",
                       }}>
             <Chart {...{...props}}
                    userid={activeUserId}
                    filter={filter}/>
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
                                   expert
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
