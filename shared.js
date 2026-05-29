// ===== AUTH =====
const USERS_KEY = 'lt_users';
function getUsers(){try{return JSON.parse(localStorage.getItem(USERS_KEY)||'[]')}catch(e){return[]}}
function saveUsers(u){localStorage.setItem(USERS_KEY,JSON.stringify(u))}
function getSession(){try{return JSON.parse(sessionStorage.getItem('lt_session')||'null')}catch(e){return null}}
function setSession(u){sessionStorage.setItem('lt_session',JSON.stringify(u))}
function clearSession(){sessionStorage.removeItem('lt_session')}

// Redirigir a login si no hay sesión
function requireAuth(){
  const u=getSession();
  if(!u){window.location.href='index.html';return null;}
  return u;
}

// Inyectar usuario en la navbar si existe
function injectUserNav(){
  const u=getSession();
  if(!u) return;
  document.querySelectorAll('.bar-nav').forEach(nav=>{
    if(!nav.querySelector('.logout-btn')){
      const span=document.createElement('span');
      span.style.cssText='color:rgba(255,255,255,0.45);font-size:.75rem;padding:.3rem .4rem';
      span.textContent='👤 '+u.name.split(' ')[0];
      nav.appendChild(span);
      const btn=document.createElement('a');
      btn.className='bar-nav-btn logout-btn';
      btn.href='#';
      btn.textContent='Salir';
      btn.onclick=function(e){e.preventDefault();clearSession();window.location.href='index.html'};
      nav.appendChild(btn);
    }
  });
}

function toggleFaq(el){
  el.parentElement.classList.toggle('open');
}

// ===== HAMBURGUESA =====
function initHamburger(){
  const btn = document.querySelector('.nav-hamburger');
  if(!btn) return;
  btn.addEventListener('click', function(){
    const navs = document.querySelectorAll('.bar-nav');
    navs.forEach(nav => nav.classList.toggle('mobile-open'));
    btn.textContent = btn.textContent.trim() === '☰' ? '✕' : '☰';
  });
  // Cerrar al hacer click en un link
  document.querySelectorAll('.bar-nav-btn').forEach(link => {
    link.addEventListener('click', function(){
      document.querySelectorAll('.bar-nav').forEach(nav => nav.classList.remove('mobile-open'));
      const btn = document.querySelector('.nav-hamburger');
      if(btn) btn.textContent = '☰';
    });
  });
}

// ===== STORE DATA (shared across pages) =====
const PRODUCTS = [
  {id:0,name:"Inventario Fácil — Básico",cat:"Software · Desktop",emoji:"📦",bg:"linear-gradient(135deg,#0d1b2a,#0F6E56)",price:0,priceLabel:"Gratis",desc:"Sistema completo de control de inventario para un negocio con un solo usuario. Incluye gestión de productos, registro de movimientos y alertas de stock mínimo.",features:["Gestión de productos (CRUD completo)","Movimientos de entrada y salida","Alertas de stock mínimo","1 usuario incluido","Instalación por cuenta del cliente"]},
  {id:1,name:"Inventario Fácil — Estándar",cat:"Licencia · Estándar",emoji:"📊",bg:"linear-gradient(135deg,#1a3a5c,#185FA5)",price:1500,priceLabel:"$1,500",desc:"La versión más completa para negocios en crecimiento. Múltiples usuarios, estadísticas avanzadas con gráficas y 3 meses de soporte técnico prioritario incluido.",features:["Todo lo del plan básico","Múltiples usuarios simultáneos","Estadísticas y reportes gráficos","3 meses de soporte técnico","Capacitación inicial incluida"]},
  {id:2,name:"Inventario Fácil — Premium",cat:"Licencia · Premium",emoji:"🏆",bg:"linear-gradient(135deg,#1a1a2e,#534AB7)",price:3000,priceLabel:"$3,000",desc:"La experiencia completa de Inventario Fácil con todos los módulos actuales y futuros. Ideal para negocios que buscan una solución de largo plazo.",features:["Todo lo del plan estándar","Módulo de ventas integrado","Exportación de reportes a PDF","Soporte técnico por 12 meses","Actualizaciones de versión gratis"]},
  {id:3,name:"VentaRápida — Punto de Venta",cat:"Software · POS",emoji:"🧾",bg:"linear-gradient(135deg,#1a1a2e,#D85A30)",price:2200,priceLabel:"$2,200",desc:"Sistema de punto de venta diseñado para tiendas de abarrotes y pequeños comercios. Incluye caja, corte de día, historial de ventas y emisión de tickets.",features:["Registro de ventas rápido","Corte de caja diario/turno","Historial de ventas con filtros","Emisión de tickets impresos","Integración con inventario"]},
  {id:4,name:"Instalación y Configuración",cat:"Servicio",emoji:"🔧",bg:"linear-gradient(135deg,#1a3a1a,#3B6D11)",price:400,priceLabel:"$400",desc:"Instalamos el sistema directamente en el equipo del cliente, configuramos la base de datos MySQL, creamos el usuario administrador y cargamos los datos iniciales del negocio.",features:["Instalación en el equipo del cliente","Configuración de MySQL y base de datos","Carga de datos iniciales (productos, categorías)","Verificación de funcionamiento completo","Entrega de credenciales de acceso"]},
  {id:5,name:"Sesión de Capacitación",cat:"Servicio · Capacitación",emoji:"🎓",bg:"linear-gradient(135deg,#1a2a1a,#EF9F27)",price:350,priceLabel:"$350",desc:"Sesión de capacitación presencial de 2 horas directamente en las instalaciones del cliente.",features:["2 horas de capacitación presencial","Cobertura de todos los módulos","Manual de usuario impreso","Sesión de preguntas y respuestas","Grabación de la sesión (opcional)"]},
  {id:6,name:"Soporte Técnico Mensual",cat:"Servicio · Soporte",emoji:"🛡️",bg:"linear-gradient(135deg,#1a1a2e,#993C1D)",price:250,priceLabel:"$250/mes",desc:"Servicio de soporte técnico mensual con acceso prioritario por WhatsApp y correo.",features:["Soporte por WhatsApp y correo","Tiempo de respuesta < 24h hábiles","Correcciones y ajustes menores incluidos","Asesoría en uso del sistema","Reporte mensual de incidencias"]},
  {id:7,name:"Análisis de Necesidades Digitales",cat:"Consultoría",emoji:"💡",bg:"linear-gradient(135deg,#1a1a2e,#854F0B)",price:500,priceLabel:"$500",desc:"Sesión de consultoría de 1.5 horas para analizar los procesos de tu negocio.",features:["Análisis de procesos actuales del negocio","Identificación de puntos de mejora","Recomendación de soluciones tecnológicas","Reporte escrito con roadmap digital","Seguimiento de propuesta sin costo"]},
  {id:8,name:"PersonalGo — Gestión de Personal",cat:"Software · RRHH",emoji:"👥",bg:"linear-gradient(135deg,#1a1a2e,#185FA5)",price:1800,priceLabel:"$1,800",desc:"Sistema de gestión de recursos humanos para pequeñas empresas.",features:["Alta y baja de empleados","Control de asistencia diaria","Cálculo de nómina automático","Almacenamiento de contratos digitales","Reportes de horas y faltas"]},
  {id:9,name:"Pack Inicio Digital",cat:"Pack · Bundle",emoji:"🎁",bg:"linear-gradient(135deg,#0d1b2a,#1D9E75)",price:1950,priceLabel:"$1,950",desc:"El paquete perfecto para quien empieza desde cero. Inventario Fácil Estándar + Instalación + Capacitación.",features:["Inventario Fácil Plan Estándar ($1,500)","Instalación y configuración ($400)","Sesión de capacitación ($350)","Ahorro de $300 vs precio individual","Soporte prioritario los primeros 3 meses"]}
];

// Cart (persiste en sessionStorage)
function getCart(){try{return JSON.parse(sessionStorage.getItem('lt_cart')||'[]')}catch(e){return[]}}
function saveCart(c){sessionStorage.setItem('lt_cart',JSON.stringify(c))}

function initCart(){
  if(!document.getElementById('cart-fab')) return;
  updateCartUI();
}

function addToCart(id){
  const cart=getCart();
  const ex=cart.find(i=>i.id===id);
  if(ex){ex.qty++;}else{cart.push({...PRODUCTS[id],qty:1});}
  saveCart(cart);
  updateCartUI();
  const fab=document.getElementById('cart-fab');
  if(fab){fab.style.background='#1D9E75';setTimeout(()=>fab.style.background='',600);}
}
function removeFromCart(id){const c=getCart().filter(i=>i.id!==id);saveCart(c);updateCartUI();}
function changeQty(id,delta){
  const cart=getCart();
  const item=cart.find(i=>i.id===id);
  if(!item)return;
  item.qty+=delta;
  if(item.qty<=0){saveCart(cart.filter(i=>i.id!==id));}else{saveCart(cart);}
  updateCartUI();
}
function updateCartUI(){
  const cart=getCart();
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const count=cart.reduce((s,i)=>s+i.qty,0);
  const badge=document.getElementById('cart-count');
  if(badge){badge.textContent=count;badge.style.display=count>0?'flex':'none';}
  const navBadge=document.getElementById('nav-cart-badge');
  if(navBadge){navBadge.textContent=count;navBadge.style.display=count>0?'inline':'none';}
  const container=document.getElementById('cart-items');
  const foot=document.getElementById('cart-foot');
  if(!container)return;
  if(cart.length===0){
    container.innerHTML='<div class="cart-empty"><span>🛍️</span><span>Tu carrito está vacío</span></div>';
    if(foot)foot.style.display='none';
  }else{
    container.innerHTML=cart.map(item=>`
      <div class="cart-item">
        <div class="cart-item-icon" style="background:${item.bg}">${item.emoji}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="ci-price">${item.price===0?'Gratis':item.priceLabel}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          </div>
        </div>
        <span class="cart-remove" onclick="removeFromCart(${item.id})">✕</span>
      </div>`).join('');
    const tp=document.getElementById('cart-total-price');
    if(tp)tp.textContent=total>0?'$'+total.toLocaleString():'Gratis';
    if(foot)foot.style.display='block';
  }
}
function toggleCart(){
  document.getElementById('cart-drawer').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}
function openModal(id){
  const p=PRODUCTS[id];
  const price=p.price===0?'Gratis':p.priceLabel;
  document.getElementById('modal-content').innerHTML=`
    <div class="prod-modal-thumb" style="background:${p.bg}">${p.emoji}</div>
    <div class="prod-modal-body">
      <div class="pm-cat">${p.cat}</div>
      <h2>${p.name}</h2>
      <p class="pm-desc">${p.desc}</p>
      <div class="prod-modal-features">${p.features.map(f=>`<div class="pm-feat">${f}</div>`).join('')}</div>
    </div>
    <div class="prod-modal-foot">
      <div class="pm-price">${price}</div>
      <button class="pm-add-btn" onclick="addToCart(${id});closeProdModal()">+ Agregar al carrito</button>
    </div>`;
  document.getElementById('prod-modal').classList.add('open');
}
function closeProdModal(){document.getElementById('prod-modal').classList.remove('open');}
function checkout(){
  toggleCart();
  document.getElementById('checkout-modal').classList.add('open');
  saveCart([]);updateCartUI();
}
function closeCheckout(){document.getElementById('checkout-modal').classList.remove('open');}
function filterStore(btn,cat){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.prod-card').forEach(card=>{
    card.style.display=(cat==='all'||card.dataset.cat===cat)?'':'none';
  });
}

// Init hamburguesa cuando cargue el DOM
document.addEventListener('DOMContentLoaded', initHamburger);
