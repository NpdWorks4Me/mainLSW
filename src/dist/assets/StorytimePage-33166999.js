import{r as n,j as e,P as c,n as x,m as d,S as o}from"./index-fe913258.js";import{C as p}from"./ContentSection-37b465dd.js";import{G as m,T as f}from"./TechAdventure-5ea07f1e.js";import{C as h}from"./cpu-64623c21.js";const u=[{title:"A Gemstone Odyssey",type:"STORY",icon:x,action:"gemstone"},{title:"Race from the Arcade",type:"STORY",icon:h,action:"tech"}],g=({story:t,onClick:s})=>{const r=t.icon;return e.jsx(d.div,{whileHover:{scale:1.05,rotateY:4},whileTap:{scale:.95},transition:{type:"spring",stiffness:400,damping:17},className:"w-full",onClick:()=>s(t.action),children:e.jsxs("div",{className:"quiz-card h-full min-h-96 p-10 rounded-2xl cursor-pointer relative overflow-hidden group flex flex-col justify-between",children:[" ",e.jsx("div",{className:"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",children:e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 via-transparent to-cyan-500/20 blur-2xl"})}),e.jsxs("div",{className:"relative z-10 flex flex-col items-center text-center space-y-8 flex-grow",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 blur-xl animate-pulse",children:e.jsx(r,{className:"w-24 h-24 text-fuchsia-400"})}),e.jsx(r,{className:"relative w-24 h-24 text-white drop-shadow-2xl",strokeWidth:2})]}),e.jsx("h3",{className:"pixel-font text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-wide min-h-28 flex items-center justify-center px-4",children:t.title}),e.jsx("span",{className:`px-8 py-3 rounded-full text-base font-bold tracking-wider
            bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-transparent bg-clip-text
            border-2 border-fuchsia-400/60 shadow-2xl`,children:t.type})]}),e.jsx(o,{className:"absolute top-6 right-6 w-8 h-8 text-cyan-400 opacity-70 animate-pulse"}),e.jsx(o,{className:"absolute bottom-8 left-8 w-6 h-6 text-fuchsia-400 opacity-70 animate-pulse delay-500"}),e.jsx("div",{className:"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",children:e.jsx("div",{className:"absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1200"})})]})})},w=()=>{const[t,s]=n.useState(!1),[r,i]=n.useState(!1),l=a=>{a==="gemstone"&&s(!0),a==="tech"&&i(!0)};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Storytime Adventures",description:"Dive into interactive stories! Choose your path and embark on exciting adventures in the world of Little Space."}),e.jsx("style",{jsx:!0,children:`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .pixel-font { font-family: 'VT323', monospace; }

        .quiz-card {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 2px solid transparent;
          border-image: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff) 1;
          box-shadow: 
            0 0 20px rgba(255, 0, 255, 0.3),
            0 0 20px rgba(0, 255, 255, 0.3),
            inset 0 0 20px rgba(255, 255, 255, 0.05);
          transition: all 0.4s ease;
        }
        .quiz-card:hover {
          box-shadow: 
            0 0 35px rgba(255, 0, 255, 0.6),
            0 0 35px rgba(0, 255, 255, 0.6),
            inset 0 0 30px rgba(255, 255, 255, 0.1);
          transform: translateY(-10px);
        }
      `}),e.jsxs("div",{className:"min-h-screen w-full bg-transparent",children:[" ",e.jsxs(p,{className:"minReported-h-screen",children:[" ",e.jsxs("div",{className:"text-center py-16 md:py-20",children:[e.jsx("h1",{className:"pixel-font text-6xl md:text-8xl font-extrabold text-white mb-8",children:e.jsx("span",{className:"text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-fuchsia-400 animate-pulse",children:"Interactive Stories"})}),e.jsx("p",{className:"text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed",children:"Welcome, little explorer! Pick your adventure and let the magic begin"})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto px-6 mt-16",children:u.map(a=>e.jsx(g,{story:a,onClick:l},a.title))})]})]}),t&&e.jsx(m,{onClose:()=>s(!1)}),r&&e.jsx(f,{onClose:()=>i(!1)})]})};export{w as default};
