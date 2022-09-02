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
import {isMobile} from 'react-device-detect';
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

const timeRange=[2150,2145,2141,2137,2133,2129,2125,2121,2117,2114,2111,2107,2104,2101,2098,2096,2093,2090,2088,2085,2083,2081,2079,2077,2075,2073,2071,2070,2068,2066,2065,2063,2062,2061,2059,2058,2057,2056,2055,2053,2052,2051,2050.4,2049.5,2049,2048,2047,2046,2045.4,2044.7,2044,2043.3,2042.6,2042,2041.4,2040.8,2040.2,2039.6,2039,2038.5,2038,2037.4,2036.9,2036.4,2035.9,2035.4,2034.9,2034.5,2034,2033.6,2033.1,2032.7,2032.2,2031.8,2031.4,2031,2030.6,2030.2,2029.8,2029.4,2029.1,2028.7,2028.3,2028,2027.6,2027.3,2027,2026.7,2026.4,2026.1,2025.8,2025.5,2025.3,2025.1,2024.9,2024.7,2024.5,2024.3,2024.2,2024.1,2024];

const riskRange=[0.8,1.2,1.5,1.9,2.3,2.7,3.1,3.5,3.9,4.3,4.7,5.2,5.6,6.1,6.6,7.1,7.6,8.1,8.6,9.2,9.7,10.3,10.8,11.4,12,12.6,13.2,14,14.5,15.2,16,16.5,17.2,18,18.7,19.4,20,21,22,22.5,23.3,24,25,26,27,27.5,28.4,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,45,46,47,48,49,50,52,53,54,55,57,58,59,61,62,63,65,66,68,69,71,72,73,75,77,78,80,81,83,84,86,88,89,91,93,95,96,98,100];

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
  if(props.columnReverse){
    style.flexDirection="column-reverse";
  }
  if(props.rowReverse){
    style.flexDirection="row-reverse";
  }
  if(props.between){
    style.justifyContent="space-between";
  }
  if(props.spaceEvenly){
    style.justifyContent="space-evenly";
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

const avatarSize=7;
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
                      zIndex:pushed?0:avatarZIndex(followers),
                      borderRadius:"50%",
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
  const [deleteState,setDeleteState]=useState(0);
  const landscape=window.innerHeight<window.innerWidth;
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
  function deleteClick(k){
    if (deleteState===0){
      setDeleteState(1);
    }
    else {
      mutate(graphql`mutation agialignmentDeleteAvatarMutation($useridOverride:String){
             deleteAvatar(useridOverride:$useridOverride){
               id
             }}`,
             {useridOverride:activeUserId},
             (store)=>{
               window.location.reload();
             },
             (store)=>{});
    }
  }
  function rem(n){
    if (isMobile){
      return n*0.5+"rem";
    }
    else{
      return n+"rem";
    }
  }
  const title=<div style={{fontFamily:"Fredoka One",
                           fontSize:rem(4),
                           textAlign:"Center",
                           color:"white",
                           borderRadius:rem(2),
                           padding:rem(2),
                           marginTop:(landscape
                                      ?"2rem"
                                      :"0rem"),
                          }}>
                AGI Alignment {landscape && <br />}
                Folks on Twitter
              </div>;
  const login=<div style={{fontSize:rem(2),
                           textAlign:"Center",
                           background:"#bfe7ff",
                           color:"#1a90d9",
                           borderRadius:rem(2),
                           padding:rem(2),
                           marginBottom:rem(2),
                           marginTop:(landscape
                                      ?"2rem"
                                      :"0rem"),
                           width:"70%",
                          }}>
                {!activeUserId
                 && <div style={{marginBottom:rem(2)}}>
                      Log in to twitter to add/edit/delete your avatar on the alignment chart</div>
                }
                {!activeUserId
                 && <Button onClick={signinClick}
                            style={{marginBottom:rem(2)}}
                            variant="contained"
                            size="large">
                      Twitter Login
                    </Button>}
                <div>
                  After you are done, you can go <a style={{color:"#1a90d9"}} href="https://twitter.com/settings/connected_apps">here</a> to fully disconnect this app from twitter
                </div>
              </div>;
  const filters=<Flex wrap
                      center
                      end={!landscape}
                      style={{marginLeft:rem(3),
                              marginRight:rem(3),
                             }}>
                  {!landscape
                   && <div style={{fontSize:rem(2),
                                   color:"#cfecff",
                                  }}>
                        filters:
                      </div>}
                  {Object.entries(filter).map(([k,v])=><div key={k}
                                                            style={{fontSize:rem(2),
                                                                    textAlign:"Center",
                                                                    color:v?"#1a90d9":"#bfe7ff",
                                                                    background:v?"#bfe7ff":"#1a90d9",
                                                                    margin:rem(0.5),
                                                                    padding:rem(0.5),
                                                                    borderStyle:"solid",
                                                                    borderColor:"#cfecff",
                                                                    borderRadius:rem(1),
                                                                    cursor:"pointer",
                                                                    userSelect:"none",
                                                                   }}
                                                            onClick={partial(filterClick,k)}>
                                                         {k}
                                                       </div>)}
                </Flex>;
  const extra=<div>
                {activeUserId
                 && <Button variant="contained"
                            color="secondary"
                            onClick={deleteClick}>
                      {deleteState===0
                       ?"Delete all my data from this site"
                       :"Click again to permanently delete"}
                    </Button>}
                {props.userid===adminUserid
                 && <div>
                      <input onChange={changer(setOtherUserid)}></input>
                      <button onClick={addClick}>add</button>
                    </div>}
              </div>;
  const credits=
          <Flex center
              style={{fontSize:rem(1.5),
                      color:"#cfecff",
                      margin:rem(1),
                      marginTop:rem(2),
                     }}>
          <div style={{width:rem(6),
                       height:rem(6),
                       borderRadius:"50%",
                       background:"url(avatars/lisperati)",
                       backgroundSize:"cover",
                      }}/>
          <div style={{width:"70%",
                       marginLeft:rem(1),
                      }}>Created by <a style={{color:"#cfecff"}} href="https://twitter.com/lisperati">@lisperati</a>- Thanks to @robbensinger for sharing data and feedback. Many positions on this chart are just estimates by @lisperati, all errors are @lisperati's fault. <a style={{color:"#cfecff"}} href="https://github.com/drcode/agialignment">Github</a></div>
          </Flex>;
  return <Flex stretch
               columnReverse={!landscape}
               style={{height:"100vh",
                       width:"100vw",
                      }}>
           {landscape
            ?<Flex column
                   center
                   style={{width:"33%",
                           background:"#1da1f2",
                           overflow:"auto",
                          }}>
               <Flex column
                     center
                     style={{flexGrow:1,
                             background:"#1da1f2",
                            }}>
               {title}
               {login}
               {extra}
               <div style={{fontSize:rem(2),
                            textAlign:"Center",
                            color:"#cfecff",
                            marginTop:rem(2),
                           }}>
                 Filters
               </div>
                 {filters}
            {(!isMobile)
             && <div style={{marginTop:rem(4),
                            }}
                ><a style={{fontSize:rem(2),
                            textAlign:"Center",
                            color:"#cfecff",
                               }}
                        href="https://www.youtube.com/watch?v=9i1WlcCudpU">See a good intro to AI risk here</a></div>}
               </Flex>
               {credits}
             </Flex>
            :<Flex column
                   center
                   spaceEvenly
                   style={{background:"#1da1f2",
                           flexGrow:1,
                           paddingBottom:rem(2),
                          }}>
               {title}
               {login}
               {extra}
               {filters}
               {credits}
             </Flex>
           }
           <div style={landscape
                       ?{width:"67%",
                         padding:rem(1),
                        }
                       :{flexGrow:1,
                         padding:rem(1),
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
