import{j as e,d as m,P as p,m as x}from"./index-990712f9.js";import{C as h}from"./CelestialBlogCard-96e8b13d.js";import{B as g}from"./Breadcrumbs-8ccadf65.js";import{b}from"./blogPosts-6025aef2.js";const u=()=>e.jsxs("div",{className:"w-full bg-[#0f0f1a] border-t border-b border-purple-500/20 py-10 px-4 mt-20 relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-purple-900/5 pointer-events-none"}),e.jsxs("div",{className:"max-w-5xl mx-auto flex flex-col sm:flex-row gap-5 items-start relative z-10",children:[e.jsx("div",{className:"p-3 rounded-full bg-purple-500/10 border border-purple-500/20 shrink-0",children:e.jsx(m,{className:"w-6 h-6 text-purple-300"})}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("h3",{className:"text-purple-200 font-bold text-sm uppercase tracking-widest flex items-center gap-2",children:"Community & Safety Notice"}),e.jsx("p",{className:"text-gray-400 text-sm leading-relaxed max-w-3xl",children:"Little Space World is strictly a Safe For Work (SFW) community focused on therapeutic age regression and inner child healing as healthy coping mechanisms. Content provided is for educational and supportive purposes only and does not constitute professional medical or psychological advice. If you are experiencing a mental health crisis, please contact a qualified healthcare provider or emergency services immediately."})]})]})]}),f=`
  @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
  }
  .image-skeleton {
      animation: shimmer 2s infinite linear;
      background: linear-gradient(to right, #1e0f50 4%, #2d1464 25%, #1e0f50 36%);
      background-size: 1000px 100%;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
  }
  .celestial-card-bg {
    position: absolute;
    inset: 0;
    border-radius: 16px;
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
    font-size: 0.875rem;
  }
  .celestial-button:hover {
    background: #6A5ACD; 
    color: #0d0520; 
    border-color: #6A5ACD;
    box-shadow: 0 0 20px rgba(106, 90, 205, 1.0); 
    transform: scale(1.05); 
  }
`,y=({title:r,description:i,pillarSlug:s,breadcrumbLabel:l,children:c})=>{const a=b.filter(t=>t.pillar===s),d={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://littlespaceworld.com"},{"@type":"ListItem",position:2,name:l,item:`https://littlespaceworld.com/${s}`}]},n=a.map(t=>({id:t.slug,text:t.title}));return e.jsxs(e.Fragment,{children:[e.jsx(p,{title:r,description:i,canonical:`https://littlespaceworld.com/${s}`,schema:[d,{"@context":"https://schema.org","@type":"CollectionPage",name:r,description:i,mainEntity:{"@type":"ItemList",itemListElement:a.map((t,o)=>({"@type":"ListItem",position:o+1,url:`https://littlespaceworld.com/${s}/${t.slug}`}))}}]}),e.jsx("style",{children:`
          body {
              background: radial-gradient(ellipse at center, #1a0b3d 0%, #0d0520 70%, #000000 100%);
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
          }
          .app-container {
              perspective: 1500px;
          }
          ${f}
      `}),e.jsxs("div",{className:"app-container py-12 sm:py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col",children:[e.jsxs("div",{className:"max-w-7xl mx-auto flex-grow w-full",children:[e.jsx(g,{items:[{label:l,href:null}]}),e.jsxs(x.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.5},className:"text-center mb-12 sm:mb-16",children:[e.jsx("h1",{className:"text-3xl md:text-5xl font-bold text-white mb-6 leading-tight",children:r}),e.jsx("p",{className:"mt-4 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300",children:i})]}),n.length>0&&e.jsxs("div",{className:"mb-12 bg-[#1a0b3d]/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm max-w-3xl mx-auto",children:[e.jsx("h2",{className:"text-lg font-semibold text-purple-300 mb-4 text-center uppercase tracking-wider",children:"Explore This Guide"}),e.jsx("div",{className:"flex flex-wrap justify-center gap-3",children:n.map(t=>e.jsx("a",{href:`/${s}/${t.id}`,className:"text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors border border-white/5 hover:border-purple-400/30",children:t.text},t.id))})]}),a.length>0?e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12",children:a.map((t,o)=>e.jsx("div",{className:"h-[520px]",children:e.jsx(h,{post:t,index:o,pillarPrefix:s})},t.slug))}):e.jsx("div",{className:"text-center py-20",children:e.jsx("p",{className:"text-gray-400 text-lg",children:"Content is being curated for this pillar. Check back soon!"})}),c]}),e.jsx(u,{})]})]})},k=y;export{k as P};
