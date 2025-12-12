import{j as e,P as R,m as i,B as c,L as l,r as H,q as d,s as p,t as x,v as $,y as z,n as B,w as D}from"./index-3c83e0fc.js";const E=`
  /* Keyframe Animations */
  @keyframes pulse-glow {
    0% { box-shadow: 0 0 8px rgba(65, 105, 225, 0.5), inset 0 0 4px rgba(65, 105, 225, 0.3); }
    50% { box-shadow: 0 0 15px rgba(65, 105, 225, 0.8), inset 0 0 6px rgba(65, 105, 225, 0.5); }
    100% { box-shadow: 0 0 8px rgba(65, 105, 225, 0.5), inset 0 0 4px rgba(65, 105, 225, 0.3); }
  }

  @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
  }
  
  /* Custom Classes */
  .celestial-card-bg {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, rgba(30, 15, 80, 0.9) 0%, rgba(45, 20, 100, 0.8) 100%);
    z-index: -1;
    border: 1px solid rgba(138, 43, 226, 0.4);
    transition: background 0.5s ease;
    box-shadow: 0 8px 32px rgba(75, 0, 130, 0.3);
  }

  .celestial-card-bg:hover {
      background: radial-gradient(ellipse at center, rgba(10, 5, 30, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%); 
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  }
  
  .celestial-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: #ADD8E6; 
    padding: 8px 16px;
    border: 2px solid #4169E1;
    border-radius: 20px;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(65, 105, 225, 0.5);
    cursor: pointer;
    box-shadow: 0 0 8px rgba(65, 105, 225, 0.5), inset 0 0 4px rgba(65, 105, 225, 0.3);
    animation: pulse-glow 2s infinite alternate; 
  }
  
  .celestial-button:hover {
    animation: none;
    background: #6A5ACD; 
    color: #0d0520; 
    border-color: #6A5ACD;
    box-shadow: 0 0 20px rgba(106, 90, 205, 1.0); 
    transform: scale(1.05); 
  }
`,L=()=>e.jsx("div",{className:"absolute inset-0 overflow-hidden rounded-2xl",children:Array(30).fill(0).map((t,s)=>e.jsx("div",{className:"absolute w-1 h-1 rounded-full bg-white opacity-50 shadow-sm",style:{top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,animation:`twinkle ${2+Math.random()*3}s infinite alternate`,filter:`blur(${Math.random()*.5}px)`,opacity:.2+Math.random()*.8}},s))}),P=({resource:t,index:s})=>{const r=H.useRef(null),n=d(0),o=d(0),m=p(n,{stiffness:300,damping:20}),u=p(o,{stiffness:300,damping:20}),h=x(u,[-.5,.5],["10deg","-10deg"]),g=x(m,[-.5,.5],["-10deg","10deg"]),b=a=>{if(!r.current)return;const{left:v,top:j,width:N,height:k}=r.current.getBoundingClientRect(),S=a.clientX-v,M=a.clientY-j,A=S/N-.5,C=M/k-.5;n.set(A),o.set(C)},f=()=>{n.set(0),o.set(0)},y={hidden:{opacity:0,y:50,scale:.9},visible:a=>({opacity:1,y:0,scale:1,transition:{delay:a*.15,duration:.6,ease:[.25,1,.5,1]}})},w=t.icon;return e.jsx(i.div,{ref:r,onMouseMove:b,onMouseLeave:f,style:{rotateX:h,rotateY:g,transformStyle:"preserve-3d"},variants:y,initial:"hidden",animate:"visible",custom:s,className:"w-full h-full rounded-2xl mx-auto",children:e.jsxs("div",{style:{transform:"translateZ(20px)",transformStyle:"preserve-3d",height:"100%"},className:"grid place-content-center h-full rounded-2xl p-6 relative group",children:[e.jsx("div",{className:"celestial-card-bg",children:e.jsx(L,{})}),e.jsxs("div",{style:{transform:"translateZ(30px)"},className:"text-center flex flex-col h-full items-center relative",children:[e.jsx("div",{className:`mb-6 p-4 rounded-full bg-gradient-to-r ${t.color} shadow-[0_0_20px_rgba(168,85,247,0.5)]`,style:{transform:"translateZ(40px)"},children:e.jsx(w,{className:"w-8 h-8 text-white"})}),e.jsx("h2",{className:"text-2xl font-bold text-white mb-4 leading-tight",children:t.title}),e.jsx("p",{className:"text-gray-300 mb-8 text-sm flex-grow leading-relaxed",children:t.description}),e.jsxs(l,{to:t.href,className:"celestial-button mt-auto",style:{transform:"translateZ(40px)"},children:["Open",e.jsx($,{className:"w-4 h-4 ml-2"})]})]})]})})},F=[{title:"Guidance & Support",description:"Find external crisis helplines, mental health organizations, and trusted resources to support your well-being.",icon:z,href:"/guidance-and-support",color:"from-purple-400 to-pink-500"},{title:"Our Little Blog",description:"Dive into educational articles and guides to help you understand littlespace, age regression, and personal growth.",icon:B,href:"/blog",color:"from-blue-400 to-purple-500"},{title:"Safety Guidelines",description:"Understand our SFW policy and community rules to ensure a safe, respectful, and positive environment for all members.",icon:D,href:"/safety",color:"from-red-400 to-orange-500"}],Y=()=>e.jsxs(e.Fragment,{children:[e.jsx(R,{title:"Self-Help & Resources",description:"Access self-help resources, guidance articles, and community support to foster personal growth and well-being in your littlespace journey.",canonical:"/self-help"}),e.jsx("style",{children:`
          body {
              background: radial-gradient(ellipse at center, #1a0b3d 0%, #0d0520 70%, #000000 100%);
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
          }
          .app-container {
              perspective: 1500px;
          }
          ${E}
      `}),e.jsx("div",{className:"app-container py-16 sm:py-24 px-4 sm:px-6 lg:px-8 min-h-screen",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs(i.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.5},className:"text-center mb-12 sm:mb-16",children:[e.jsx("h1",{className:"text-4xl md:text-5xl font-bold text-white mb-4",children:"Self-Help & Resources"}),e.jsx("p",{className:"mt-4 max-w-2xl mx-auto text-lg text-gray-300",children:"Empower your journey with valuable insights and supportive articles."})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 justify-center",children:F.map((t,s)=>e.jsx("div",{className:"h-[450px]",children:e.jsx(P,{resource:t,index:s})},t.title))}),e.jsx(i.div,{className:"mt-16 text-center",initial:{opacity:0},animate:{opacity:1},transition:{delay:.5},children:e.jsxs("div",{className:"glass-card p-8 max-w-2xl mx-auto rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md",children:[e.jsx("h2",{className:"text-2xl font-semibold text-white mb-4",children:"Need More Support?"}),e.jsx("p",{className:"text-gray-300 mb-6",children:"If you're looking for personalized assistance or have specific questions, don't hesitate to reach out."}),e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 justify-center",children:[e.jsx(c,{asChild:!0,size:"lg",className:"bg-purple-600 hover:bg-purple-700 text-white border-none",children:e.jsx(l,{to:"/contact",children:"Contact Us"})}),e.jsx(c,{asChild:!0,size:"lg",variant:"outline",className:"border-2 border-purple-300 text-purple-300 hover:bg-purple-500/20 hover:text-white bg-transparent",children:e.jsx(l,{to:"/about",children:"About Us"})})]})]})})]})})]});export{Y as default};
