// Embedded lessons retain their own readable text layout inside the OS window.
document.addEventListener('DOMContentLoaded',()=>{document.documentElement.dataset.design='financial'});
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='vwl-os-theme'||!['pastel','terminal'].includes(e.data.theme))return;document.documentElement.dataset.osTheme=e.data.theme});
