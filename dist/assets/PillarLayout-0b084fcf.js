import{j as e,H as d,R as m,C as p,P as h,m as g}from"./index-fe913258.js";import{b,C as u,D as f}from"./blogPosts-59d37179.js";const y=({items:r})=>e.jsx("nav",{"aria-label":"Breadcrumb",className:"mb-6 overflow-x-auto",children:e.jsxs("ol",{className:"flex items-center space-x-2 text-sm text-gray-400 whitespace-nowrap",children:[e.jsx("li",{children:e.jsxs("a",{href:"/",className:"flex items-center hover:text-pink-400 transition-colors",children:[e.jsx(d,{className:"w-4 h-4"}),e.jsx("span",{className:"sr-only",children:"Home"})]})}),r.map((s,a)=>e.jsxs(m.Fragment,{children:[e.jsx(p,{className:"w-4 h-4 text-gray-600 flex-shrink-0"}),e.jsx("li",{children:s.href?e.jsx("a",{href:s.href,className:"hover:text-pink-400 transition-colors",children:s.label}):e.jsx("span",{className:"text-gray-200 font-medium","aria-current":"page",children:s.label})})]},a))]})}),j=`
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
`,w=({title:r,description:s,pillarSlug:a,breadcrumbLabel:o,children:c})=>{const i=b.filter(t=>t.pillar===a),x={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://littlespaceworld.com"},{"@type":"ListItem",position:2,name:o,item:`https://littlespaceworld.com/${a}`}]},n=i.map(t=>({id:t.slug,text:t.title}));return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:r,description:s,canonical:`https://littlespaceworld.com/${a}`,schema:[x,{"@context":"https://schema.org","@type":"CollectionPage",name:r,description:s,mainEntity:{"@type":"ItemList",itemListElement:i.map((t,l)=>({"@type":"ListItem",position:l+1,url:`https://littlespaceworld.com/${a}/${t.slug}`}))}}]}),e.jsx("style",{children:`
          body {
              background: radial-gradient(ellipse at center, #1a0b3d 0%, #0d0520 70%, #000000 100%);
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
          }
          .app-container {
              perspective: 1500px;
          }
          ${j}
      `}),e.jsxs("div",{className:"app-container py-12 sm:py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col",children:[e.jsxs("div",{className:"max-w-7xl mx-auto flex-grow w-full",children:[e.jsx(y,{items:[{label:o,href:null}]}),e.jsxs(g.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.5},className:"text-center mb-12 sm:mb-16",children:[e.jsx("h1",{className:"text-3xl md:text-5xl font-bold text-white mb-6 leading-tight",children:r}),e.jsx("p",{className:"mt-4 max-w-3xl mx-auto text-lg sm:text-xl text-gray-300",children:s})]}),n.length>0&&e.jsxs("div",{className:"mb-12 bg-[#1a0b3d]/50 border border-white/10 rounded-xl p-6 backdrop-blur-sm max-w-3xl mx-auto",children:[e.jsx("h2",{className:"text-lg font-semibold text-purple-300 mb-4 text-center uppercase tracking-wider",children:"Explore This Guide"}),e.jsx("div",{className:"flex flex-wrap justify-center gap-3",children:n.map(t=>e.jsx("a",{href:`/${a}/${t.id}`,className:"text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors border border-white/5 hover:border-purple-400/30",children:t.text},t.id))})]}),i.length>0?e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12",children:i.map((t,l)=>e.jsx("div",{className:"h-[520px]",children:e.jsx(u,{post:t,index:l,pillarPrefix:a})},t.slug))}):e.jsx("div",{className:"text-center py-20",children:e.jsx("p",{className:"text-gray-400 text-lg",children:"Content is being curated for this pillar. Check back soon!"})}),c]}),e.jsx(f,{})]})]})},v=w;export{v as P};
