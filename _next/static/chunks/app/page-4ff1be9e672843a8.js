(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{8927:function(e,t,n){Promise.resolve().then(n.bind(n,5935))},5935:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return Home}});var r=n(230),i=n(7437),c=n(8771),l=n(2265);let useSystem=()=>{let{game:e,stateListener:t}=(0,c.O)(),[n,r]=(0,l.useState)(e.getSystemViewModel(!0));return(0,l.useEffect)(()=>{let listener=e=>{r(e)};return t.onSystemViewModel(listener),()=>{t.removeSystemViewModelListener(listener)}},[t]),{system:n}};var a=n(802),u=n(245);let useSquare=e=>{let{squareIndex:t}=e,{game:n,stateListener:r,gameListener:i}=(0,c.O)(),[a,u]=(0,l.useState)(n.getSquareViewModel(t));(0,l.useEffect)(()=>{let listener=e=>{u(e)};return r.onSquareViewModel(t,listener),()=>{r.removeSquareViewModelListener(t,listener)}},[t,r]);let s=(0,l.useCallback)(()=>{i.emitClickEvent({type:"BOARD",squareIndex:t})},[t,i]);return{clickBoard:s,square:a}};var s=n(2710);function _templateObject(){let e=(0,r._)(["\n    width: 100px;\n    height: 100px;\n    border: 1px solid black;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-size: 40px;\n    position: relative;\n    cursor: pointer;\n    ",";\n    ",";\n"]);return _templateObject=function(){return e},e}function _templateObject1(){let e=(0,r._)(["\n    position: absolute;\n    ",";\n    ",";\n    width: 10px;\n    height: 10px;\n    border-radius: 50%;\n    ",";\n"]);return _templateObject1=function(){return e},e}let Square=e=>{let{squareIndex:t}=e,{square:n,clickBoard:r}=useSquare({squareIndex:t});return(0,i.jsxs)(o,{$clickable:n.state,$player:(0,s.y3)(n.piece)?"ME":"OPPONENT",onClick:r,children:[pieceStringParser(n.piece),pieceDotChanger(n.piece).map((e,t)=>(0,i.jsx)(p,{$x:e[0],$y:e[1],$player:(0,s.y3)(n.piece)?"ME":"OPPONENT"},t+"_"+n.piece+"_dot_"+e[0]+"_"+e[1]))]})},pieceStringParser=e=>{switch(e){case u.E_:return"";case u.xw:return"L";case u.OS:return"E";case u.Vg:return"G";case u.ZI:return"C";case u.Pn:return"H";case u.D_:return"l";case u.zq:return"e";case u.Dx:return"g";case u.Xs:return"c";case u.mh:return"h"}},pieceDotChanger=e=>{switch(e){case u.E_:return[];case u.xw:case u.D_:return[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];case u.OS:case u.zq:return[[-1,-1],[1,-1],[-1,1],[1,1]];case u.Vg:case u.Dx:return[[0,-1],[-1,0],[1,0],[0,1]];case u.ZI:return[[0,-1]];case u.Xs:return[[0,1]];case u.Pn:return[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[0,1]];case u.mh:return[[0,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]}},o=a.ZP.div(_templateObject(),e=>"clickable"===e.$clickable?"background-color: pink":"selecting"===e.$clickable?"background-color: palegreen":"",e=>"ME"===e.$player?"color: black":"color: red"),p=a.ZP.div(_templateObject1(),e=>{switch(e.$y){case -1:return"top: 5px";case 0:return"";case 1:return"bottom: 5px"}},e=>{switch(e.$x){case -1:return"left: 5px";case 0:return"";case 1:return"right: 5px"}},e=>"ME"===e.$player?"background-color: black":"background-color: red");function Board_templateObject(){let e=(0,r._)(["\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n"]);return Board_templateObject=function(){return e},e}function Board_templateObject1(){let e=(0,r._)(["\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n"]);return Board_templateObject1=function(){return e},e}let Board=()=>(0,i.jsx)(d,{children:[0,1,2,3].map(e=>(0,i.jsx)(f,{children:[0,1,2].map(t=>(0,i.jsx)(Square,{squareIndex:3*e+t},"square_"+e+"_"+t))},"row_"+e))}),d=a.ZP.div(Board_templateObject()),f=a.ZP.div(Board_templateObject1()),useCaptured=e=>{let{capturedIndex:t}=e,{game:n,stateListener:r,gameListener:i}=(0,c.O)(),[a,u]=(0,l.useState)(n.getCapturedViewModel(t));(0,l.useEffect)(()=>{let listener=e=>{u(e)};return r.onCapturedViewModel(t,listener),()=>{r.removeCapturedViewModelListener(t,listener)}},[t,r]);let s=(0,l.useCallback)(()=>{i.emitClickEvent({type:"CAPTURED",capturedIndex:t})},[t,i]);return{captured:a,clickCaptured:s}};function Captured_templateObject(){let e=(0,r._)(["\n    position: relative;\n"]);return Captured_templateObject=function(){return e},e}function Captured_templateObject1(){let e=(0,r._)(["\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font-size: 48px;\n    width: 60px;\n    height: 60px;\n    cursor: pointer;\n    ","\n"]);return Captured_templateObject1=function(){return e},e}function _templateObject2(){let e=(0,r._)([""]);return _templateObject2=function(){return e},e}function _templateObject3(){let e=(0,r._)(["\n    position: absolute;\n    top: 2px;\n    right: 2px;\n"]);return _templateObject3=function(){return e},e}let Captured=e=>{let{capturedIndex:t}=e,{captured:n,clickCaptured:r}=useCaptured({capturedIndex:t});return 0===n.amount?(0,i.jsx)(g,{}):(0,i.jsxs)(m,{onClick:r,children:[(0,i.jsx)(x,{$selecting:"selecting"===n.state,children:capturedStringParse(t)}),(0,i.jsx)(j,{children:n.amount})]})},capturedStringParse=e=>{switch(e){case u.bD:return"E";case u.IH:return"G";case u.Ah:return"C";case u.Rg:return"e";case u.rD:return"g";case u.y8:return"c"}},m=a.ZP.div(Captured_templateObject()),x=a.ZP.div(Captured_templateObject1(),e=>e.$selecting?"background-color: palegreen":""),g=a.ZP.div(_templateObject2()),j=a.ZP.div(_templateObject3());function MyCaptured_templateObject(){let e=(0,r._)(["\n    margin: 24px 36px;\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    height: 60px;\n    width: calc(100% - 72px);\n"]);return MyCaptured_templateObject=function(){return e},e}let MyCaptured=()=>(0,i.jsx)(_,{children:[0,1,2].map(e=>(0,i.jsx)(Captured,{capturedIndex:e},"captured_"+e))}),_=a.ZP.div(MyCaptured_templateObject());function OpCaptured_templateObject(){let e=(0,r._)(["\n    margin: 24px 36px;\n    display: flex;\n    flex-direction: row;\n    justify-content: flex-start;\n    height: 60px;\n    width: calc(100% - 72px);\n"]);return OpCaptured_templateObject=function(){return e},e}let OpCaptured=()=>(0,i.jsx)(y,{children:[3,4,5].map(e=>(0,i.jsx)(Captured,{capturedIndex:e},"captured_"+e))}),y=a.ZP.div(OpCaptured_templateObject());function PlayArea_templateObject(){let e=(0,r._)(["\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    width: 450px;\n    height: 630px;\n    border: 1px solid #cccccc;\n    border-radius: 12px;\n    ","\n"]);return PlayArea_templateObject=function(){return e},e}let PlayArea=()=>{let{system:e}=useSystem();return(0,i.jsxs)(b,{$turn:e.turnPlayer,$isFinished:e.finishStatus.isFinished,children:[(0,i.jsx)(OpCaptured,{}),(0,i.jsx)(Board,{}),(0,i.jsx)(MyCaptured,{})]})},b=a.ZP.div(PlayArea_templateObject(),e=>e.$isFinished?"":"background: linear-gradient("+("ME"===e.$turn?"to bottom":"to top")+", white 90%, #D8FBD8 100%);");var h=n(3842);let O=[{name:"プレイヤー",value:"click",playType:new h.S("CLICK")},...["multi2_12"].map(e=>({name:"AI: "+e,value:"strategy_"+e,playType:new h.S("STRATEGY",e)}))],useSetting=()=>{let{gameListener:e}=(0,c.O)(),[t,n]=(0,l.useState)("click"),[r,i]=(0,l.useState)("click"),a=(0,l.useCallback)(()=>{let n=O.find(e=>e.value===t).playType,i=O.find(e=>e.value===r).playType;e.emitGameEvent({type:"start",playType:{me:n,opponent:i}})},[e,t,r]),u=(0,l.useCallback)(()=>{e.emitGameEvent({type:"reset"})},[e]);return{start:a,reset:u,playTypePullDown:{me:{value:t,options:O,onChange:n},opponent:{value:r,options:O,onChange:i}}}};function Button_templateObject(){let e=(0,r._)(["\n    margin: 10px;\n    width: 100px;\n    height: 50px;\n    font-size: 20px;\n    background-color: #fff;\n"]);return Button_templateObject=function(){return e},e}let Button=e=>{let{onClick:t,children:n}=e;return(0,i.jsx)(P,{onClick:t,children:n})},P=a.ZP.button(Button_templateObject());function Message_templateObject(){let e=(0,r._)(["\n    margin: 10px;\n    font-size: 24px;\n"]);return Message_templateObject=function(){return e},e}function Message_templateObject1(){let e=(0,r._)(["\n    ",";\n    font-size: 36px;\n    font-weight: bold;\n"]);return Message_templateObject1=function(){return e},e}let Message=()=>{let{system:e}=useSystem(),t=turnStringParser(e.turnPlayer);return e.notStarted?(0,i.jsx)(S,{children:"「Start」を押してください"}):e.finishStatus.isFinished?(0,i.jsxs)(S,{children:[(0,i.jsx)(w,{$player:e.finishStatus.winner,children:turnStringParser(e.finishStatus.winner)})," の勝ちです"]}):e.thinking?(0,i.jsxs)(S,{children:[(0,i.jsx)(w,{$player:e.turnPlayer,children:t}),"のAIが思考中です..."]}):(0,i.jsxs)(S,{children:[(0,i.jsx)(w,{$player:e.turnPlayer,children:t}),"のターンです"]})},S=a.ZP.div(Message_templateObject()),w=a.ZP.span(Message_templateObject1(),e=>"ME"===e.$player?"color: black":"color: red"),turnStringParser=e=>{switch(e){case"ME":return"先手";case"OPPONENT":return"後手"}};function PullDown_templateObject(){let e=(0,r._)(["\n    margin: 10px;\n    max-width: 400px;\n    height: 30px;\n    font-size: 20px;\n"]);return PullDown_templateObject=function(){return e},e}let PullDown=e=>{let{value:t,onChange:n,options:r}=e;return(0,i.jsx)(C,{value:t,onChange:e=>n(e.target.value),children:r.map(e=>(0,i.jsx)("option",{value:e.value,children:e.name},e.value))})},C=a.ZP.select(PullDown_templateObject());function PlayerTypeSetting_templateObject(){let e=(0,r._)(["\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: flex-start;\n    padding: 18px 24px;\n    background-color: white;\n    border-radius: 12px;\n    width: calc(100% - 48px);\n    border: 1px solid #cccccc;\n"]);return PlayerTypeSetting_templateObject=function(){return e},e}function PlayerTypeSetting_templateObject1(){let e=(0,r._)(["\n    padding: 0 10px;\n    font-size: 24px;\n    width: calc(100% - 20px);\n"]);return PlayerTypeSetting_templateObject1=function(){return e},e}let PlayerTypeSetting=e=>{let{pullDown:{value:t,options:n,onChange:r},label:c}=e;return(0,i.jsxs)(v,{children:[(0,i.jsx)(k,{children:c}),(0,i.jsx)(PullDown,{value:t,options:n,onChange:r})]})},v=a.ZP.div(PlayerTypeSetting_templateObject()),k=a.ZP.div(PlayerTypeSetting_templateObject1());function Setting_templateObject(){let e=(0,r._)(["\n    margin: 10px;\n    width: 70%;\n    display: flex;\n    flex-direction: row;\n    justify-content: center;\n    align-items: center;\n    background-color: #f2f2f2;\n    border-radius: 10px;\n    border: 1px solid #cccccc;\n\n    @media (max-width: 768px) {\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n    }\n"]);return Setting_templateObject=function(){return e},e}function Setting_templateObject1(){let e=(0,r._)(["\n    padding: 24px;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    width: 50%;\n    border-right: 1px solid #cccccc;\n"]);return Setting_templateObject1=function(){return e},e}function Setting_templateObject2(){let e=(0,r._)(["\n    padding: 24px;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    width: 50%;\n    gap: 12px;\n"]);return Setting_templateObject2=function(){return e},e}let Setting=()=>{let{start:e,playTypePullDown:{me:t,opponent:n}}=useSetting();return(0,i.jsxs)(E,{children:[(0,i.jsx)(M,{children:(0,i.jsx)(Message,{})}),(0,i.jsxs)(D,{children:[(0,i.jsx)(PlayerTypeSetting,{label:"先手",pullDown:t}),(0,i.jsx)(PlayerTypeSetting,{label:"後手",pullDown:n}),(0,i.jsx)(Button,{onClick:e,children:"Start"})]})]})},E=a.ZP.div(Setting_templateObject()),M=a.ZP.div(Setting_templateObject1()),D=a.ZP.div(Setting_templateObject2());function page_templateObject(){let e=(0,r._)(["\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  margin: 12px auto;\n"]);return page_templateObject=function(){return e},e}function Home(){return(0,i.jsxs)(T,{children:[(0,i.jsx)(PlayArea,{}),(0,i.jsx)(Setting,{})]})}let T=a.ZP.main(page_templateObject())},245:function(e,t,n){"use strict";n.d(t,{Ah:function(){return g},Bu:function(){return b},D_:function(){return s},Dx:function(){return p},E_:function(){return r},GW:function(){return P},IH:function(){return x},OS:function(){return c},Pn:function(){return u},Rg:function(){return j},Vg:function(){return l},Xs:function(){return d},ZI:function(){return a},bD:function(){return m},mh:function(){return f},o:function(){return h},rD:function(){return _},s3:function(){return O},xw:function(){return i},y8:function(){return y},zq:function(){return o}});let r=0,i=1,c=2,l=3,a=4,u=5,s=6,o=7,p=8,d=9,f=10,m=0,x=1,g=2,j=3,_=4,y=5,b=[p,s,o,r,d,r,r,a,r,c,i,l],h=[0,0,0,0,0,0],O=/([0-9]|a){12}[0-2]{6}/,P="/dobutsu_front"},3842:function(e,t,n){"use strict";n.d(t,{S:function(){return PlayType}});var r=n(9792);let PlayType=class PlayType{getPlayStrategy(){return this.playStrategy}getModelName(){return void 0!==this.modelName?(0,r.ok)(this.modelName):(0,r.cn)(Error())}constructor(e,t){this.playStrategy=e,this.modelName=t}}},8771:function(e,t,n){"use strict";n.d(t,{O:function(){return useGlobal},y:function(){return i}});var r=n(2265);let i=(0,r.createContext)(void 0),useGlobal=()=>{let e=(0,r.useContext)(i);return{game:e.getGame(),gameListener:e.getGameListener(),stateListener:e.getStateListener()}}},2710:function(e,t,n){"use strict";n.d(t,{Ww:function(){return isLion},XE:function(){return isOpPiece},xb:function(){return isEmpty},y3:function(){return isMyPiece}});var r=n(245);let isMyPiece=e=>e!==r.E_&&e<r.D_,isOpPiece=e=>e>=r.D_,isEmpty=e=>e===r.E_,isLion=e=>e===r.xw||e===r.D_}},function(e){e.O(0,[995,971,472,744],function(){return e(e.s=8927)}),_N_E=e.O()}]);