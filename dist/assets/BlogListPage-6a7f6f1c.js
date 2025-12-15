import{j as e,P as n,m as r,L as t}from"./index-4cb06891.js";import{b as l,C as o,D as c}from"./blogPosts-3ff2aa87.js";const d=`
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
`;function m(){const i={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://littlespaceworld.com"},{"@type":"ListItem",position:2,name:"Blog",item:"https://littlespaceworld.com/blog"}]};return e.jsxs(e.Fragment,{children:[e.jsx(n,{title:"Regression & Mental Health Blog",description:"Explore our collection of articles on age regression, inner child healing, and mental health. Expert guides, SFW coping strategies, and community stories.",canonical:"https://littlespaceworld.com/blog",schema:i}),e.jsx("style",{children:`
          body {
              background: radial-gradient(ellipse at center, #1a0b3d 0%, #0d0520 70%, #000000 100%);
              min-height: 100vh;
              font-family: 'Inter', sans-serif;
          }
          .app-container {
              perspective: 1500px;
          }
          ${d}
      `}),e.jsxs("div",{className:"app-container py-16 sm:py-24 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col",children:[e.jsxs("div",{className:"max-w-7xl mx-auto flex-grow w-full",children:[e.jsxs(r.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},transition:{duration:.5},className:"text-center mb-12 sm:mb-16",children:[e.jsx("h1",{className:"text-3xl md:text-4xl font-bold text-white mb-4",children:"Our Blog"}),e.jsx("p",{className:"mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-300",children:"Regress safely. Advocate bravely. Create freely. You belong here."}),e.jsxs("div",{className:"flex flex-wrap justify-center gap-4 mt-8",children:[e.jsx(t,{to:"/littlespace",className:"text-pink-300 hover:text-pink-200 underline underline-offset-4",children:"Littlespace Guide"}),e.jsx(t,{to:"/inner-child",className:"text-pink-300 hover:text-pink-200 underline underline-offset-4",children:"Inner Child"}),e.jsx(t,{to:"/mental-health",className:"text-pink-300 hover:text-pink-200 underline underline-offset-4",children:"Mental Health"}),e.jsx(t,{to:"/young-adult",className:"text-pink-300 hover:text-pink-200 underline underline-offset-4",children:"Young Adult"}),e.jsx(t,{to:"/create",className:"text-pink-300 hover:text-pink-200 underline underline-offset-4",children:"Create & DIY"})]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12",children:l.map((a,s)=>e.jsx("div",{className:"h-[520px]",children:e.jsx(o,{post:a,index:s})},a.slug))})]}),e.jsx(c,{})]})]})}export{m as default};
