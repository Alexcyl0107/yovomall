
import React, { useState, useEffect } from 'react';

// --- TYPES DE DONNÉES ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Order {
  id: number;
  items: string[];
  total: number;
  phone: string;
  method: string;
  address: string;
  date: string;
}

// CATALOGUE DE 9 PRODUITS (SAC À DOS SUPPRIMÉ)
const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "ORDINATEUR PORTABLE HP", price: 450000, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500" },
  { id: 2, name: "TELEPHONE SAMSUNG GALAXY", price: 350000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
  { id: 3, name: "MONTRE CONNECTEE SPORT", price: 45000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
  { id: 4, name: "CASQUE BLUETOOTH PRO", price: 25000, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { id: 6, name: "APPAREIL PHOTO REFLEX", price: 120000, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500" },
  { id: 7, name: "CHAUSSURES DE SPORT", price: 30000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { id: 8, name: "TABLETTE GRAPHIQUE", price: 180000, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500" },
  { id: 9, name: "MACHINE A CAFE", price: 55000, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500" },
  { id: 10, name: "PAIRE DE LUNETTES", price: 10000, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500" }
];

export default function App() {
  // Navigation
  const [view, setView] = useState('home');
  
  // Données
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Formulaire Client
  const [payNum, setPayNum] = useState('');
  const [payCode, setPayCode] = useState('');
  const [payMethod, setPayMethod] = useState('TMONEY');
  const [address, setAddress] = useState('');
  
  // Formulaire Admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImg, setNewProdImg] = useState('');

  // Chargement LocalStorage (v6 pour forcer la mise à jour à 9 produits)
  useEffect(() => {
    const savedProd = localStorage.getItem('yovo_products_v6');
    if (savedProd) {
      setProducts(JSON.parse(savedProd));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('yovo_products_v6', JSON.stringify(INITIAL_PRODUCTS));
    }

    const savedOrd = localStorage.getItem('yovo_orders_v6');
    if (savedOrd) setOrders(JSON.parse(savedOrd));
  }, []);

  // --- ACTIONS CLIENT ---
  const addToCart = (p: Product) => {
    setCart([...cart, p]);
    alert("Produit ajouté au panier !");
  };

  const removeFromCart = (index: number) => {
    const n = [...cart];
    n.splice(index, 1);
    setCart(n);
  };

  const total = cart.reduce((s, i) => s + i.price, 0);

  const handleOrder = (e: any) => {
    e.preventDefault();
    if (!payNum || !payCode || !address) return alert("Remplissez tout !");
    
    const newOrder: Order = {
      id: Date.now(),
      items: cart.map(i => i.name),
      total: total,
      phone: payNum,
      method: payMethod,
      address: address,
      date: new Date().toLocaleString()
    };

    const updated = [...orders, newOrder];
    setOrders(updated);
    localStorage.setItem('yovo_orders_v6', JSON.stringify(updated));
    setCart([]);
    setView('success');
  };

  // --- ACTIONS ADMIN ---
  const addProduct = (e: any) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdImg) return alert("Remplissez tous les champs.");
    
    const p: Product = {
      id: Date.now(),
      name: newProdName.toUpperCase(),
      price: parseInt(newProdPrice),
      image: newProdImg
    };

    const updated = [...products, p];
    setProducts(updated);
    localStorage.setItem('yovo_products_v6', JSON.stringify(updated));
    setNewProdName(''); setNewProdPrice(''); setNewProdImg('');
    alert("Produit ajouté au stock !");
  };

  const deleteProduct = (id: number) => {
    if (confirm("Supprimer cet article ?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('yovo_products_v6', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-mono bg-gray-100 text-black">
      
      {/* HEADER CLASSIQUE */}
      <nav className="bg-black text-white p-4 border-b-8 border-red-600 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black cursor-pointer tracking-tighter" onClick={() => setView('home')}>
            YOVO MALL
          </h1>
          <div className="flex space-x-4 font-bold text-xs">
            <button onClick={() => setView('home')} className="hover:text-red-500">ACCUEIL</button>
            <button onClick={() => setView('products')} className="hover:text-red-500">MAGASIN</button>
            <button onClick={() => setView('cart')} className="bg-red-600 px-4 py-2 border-2 border-white">PANIER ({cart.length})</button>
            <button onClick={() => setView('login')} className="text-gray-500">ADMIN</button>
          </div>
        </div>
      </nav>

      {/* CONTENU */}
      <main className="flex-grow container mx-auto p-4 md:p-8">

        {/* ACCUEIL */}
        {view === 'home' && (
          <div className="max-w-4xl mx-auto">
            <div className="border-[12px] border-black bg-white p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] mb-10">
              <div className="bg-red-600 text-white p-10 text-center border-4 border-black mb-8">
                <h2 className="text-5xl font-black mb-4 uppercase tracking-widest">BIENVENUE CHEZ YOVO MALL</h2>
                <p className="text-xl font-black italic border-t-2 border-white pt-2 inline-block">VENTE DE PRODUITS DE QUALITE - LOME, TOGO</p>
              </div>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl font-black leading-none uppercase">VOTRE MAGASIN DE CONFIANCE</h3>
                  <p className="font-bold text-gray-700 leading-relaxed uppercase">TOUS NOS PRODUITS SONT IMPORTES ET TESTES. PAIEMENT SECURISE PAR TMONEY ET FLOOZ. LIVRAISON RAPIDE A DOMICILE.</p>
                  <button onClick={() => setView('products')} className="bg-black text-white text-2xl font-black py-5 px-10 border-b-8 border-gray-700 hover:bg-red-600 transition-colors w-full">
                    VOIR LE CATALOGUE
                  </button>
                </div>
                <img src={INITIAL_PRODUCTS[0].image} className="border-8 border-black grayscale-[50%]" alt="Vitrine" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-4 border-black p-6 bg-yellow-400 font-black text-center text-xl uppercase">TMONEY / FLOOZ</div>
              <div className="border-4 border-black p-6 bg-blue-500 text-white font-black text-center text-xl uppercase">LIVRAISON LOME</div>
              <div className="border-4 border-black p-6 bg-green-500 text-white font-black text-center text-xl uppercase">ARTICLES NEUFS</div>
            </div>
          </div>
        )}

        {/* CATALOGUE */}
        {view === 'products' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black mb-8 border-b-8 border-black pb-2 inline-block uppercase">NOS ARTICLES DISPONIBLES</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white border-4 border-black p-4 flex flex-col hover:-translate-y-2 transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <img src={p.image} className="h-40 w-full object-cover border-2 border-black mb-3" alt="" />
                  <h3 className="font-black text-xs h-10 overflow-hidden uppercase leading-none mb-2">{p.name}</h3>
                  <p className="text-red-600 font-black text-xl mb-4">{p.price.toLocaleString()} F</p>
                  <button onClick={() => addToCart(p)} className="bg-black text-white font-black py-3 text-xs border-b-4 border-gray-600 active:border-b-0 uppercase">ACHETER MAINTENANT</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANIER */}
        {view === 'cart' && (
          <div className="max-w-2xl mx-auto bg-white border-[10px] border-black p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black mb-8 border-b-8 border-black pb-2 uppercase">VOTRE PANIER</h2>
            {cart.length === 0 ? (
              <p className="font-black text-gray-300 text-center py-20 text-2xl uppercase">PANIER VIDE</p>
            ) : (
              <div className="space-y-6">
                {cart.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b-4 border-black pb-4 font-black text-sm uppercase">
                    <span>{it.name}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-red-600">{it.price.toLocaleString()} F</span>
                      <button onClick={() => removeFromCart(idx)} className="bg-black text-white px-2 py-1 text-[10px]">SUPPR</button>
                    </div>
                  </div>
                ))}
                <div className="text-3xl font-black flex justify-between pt-6 border-t-8 border-black">
                  <span>TOTAL :</span>
                  <span>{total.toLocaleString()} F</span>
                </div>
                
                <form onSubmit={handleOrder} className="bg-gray-100 p-8 border-4 border-black space-y-5">
                  <h3 className="font-black underline text-xl uppercase">VALIDATION DU PAIEMENT</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setPayMethod('TMONEY')} className={`p-4 border-4 border-black font-black uppercase ${payMethod === 'TMONEY' ? 'bg-yellow-400' : 'bg-white'}`}>TMONEY</button>
                    <button type="button" onClick={() => setPayMethod('FLOOZ')} className={`p-4 border-4 border-black font-black uppercase ${payMethod === 'FLOOZ' ? 'bg-white text-blue-600' : 'bg-white'}`}>FLOOZ</button>
                  </div>
                  <input type="tel" placeholder="NUMERO DE TELEPHONE" className="w-full p-4 border-4 border-black font-black text-lg" value={payNum} onChange={e => setPayNum(e.target.value)} required />
                  <input type="password" placeholder="CODE SECRET PIN" className="w-full p-4 border-4 border-black font-black text-lg" value={payCode} onChange={e => setPayCode(e.target.value)} required />
                  <textarea placeholder="ADRESSE COMPLETE (Quartier, Maison, Ville...)" className="w-full p-4 border-4 border-black font-black h-32" value={address} onChange={e => setAddress(e.target.value)} required />
                  <button className="w-full bg-green-600 text-white font-black py-6 text-2xl border-b-8 border-green-900 active:border-b-0 uppercase">CONFIRMER MON ACHAT</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SUCCES */}
        {view === 'success' && (
          <div className="max-w-lg mx-auto text-center border-[12px] border-black p-16 bg-white shadow-[25px_25px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl font-black text-green-600 mb-6 uppercase">COMMANDE RECUE !</h2>
            <p className="text-xl font-black mb-10 leading-tight uppercase">NOUS AVONS BIEN ENREGISTRE VOTRE COMMANDE. UN AGENT YOVO MALL VA VOUS APPELER POUR LA LIVRAISON.</p>
            <button onClick={() => setView('home')} className="bg-black text-white font-black py-4 px-12 text-xl border-b-4 border-gray-700">RETOUR AU MAGASIN</button>
          </div>
        )}

        {/* LOGIN ADMIN */}
        {view === 'login' && (
          <div className="max-w-sm mx-auto border-8 border-black p-8 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black text-center mb-8 underline uppercase">ESPACE GERANT</h2>
            <div className="space-y-6">
              <input type="email" placeholder="EMAIL ADMIN" className="w-full p-4 border-4 border-black font-black" onChange={e => setAdminEmail(e.target.value)} />
              <input type="password" placeholder="CODE PIN" className="w-full p-4 border-4 border-black font-black" onChange={e => setAdminPass(e.target.value)} />
              <button 
                onClick={() => {
                  if(adminEmail === "admin@gmail.com" && adminPass === "1234") setView('admin');
                  else alert("ACCES REFUSE !");
                }}
                className="w-full bg-black text-white font-black py-4 border-b-4 border-gray-600 uppercase"
              >
                SE CONNECTER
              </button>
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD COMPLET */}
        {view === 'admin' && (
          <div className="max-w-6xl mx-auto space-y-10 pb-20">
            <div className="bg-black text-white p-6 flex justify-between items-center border-b-8 border-red-600 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black uppercase">PANNEAU DE GESTION YOVO MALL</h2>
              <button onClick={() => setView('home')} className="bg-red-600 text-white font-black px-6 py-2 border-2 border-white uppercase text-xs">DECONNEXION</button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              {/* AJOUT PRODUIT */}
              <div className="bg-white border-8 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black mb-6 underline uppercase">AJOUTER UN NOUVEL ARTICLE</h3>
                <form onSubmit={addProduct} className="space-y-4">
                  <input type="text" placeholder="NOM DU PRODUIT" className="w-full p-3 border-4 border-black font-black" value={newProdName} onChange={e => setNewProdName(e.target.value)} required />
                  <input type="number" placeholder="PRIX EN FCFA" className="w-full p-3 border-4 border-black font-black" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} required />
                  <input type="text" placeholder="LIEN DE L'IMAGE (URL)" className="w-full p-3 border-4 border-black font-black" value={newProdImg} onChange={e => setNewProdImg(e.target.value)} required />
                  <button className="w-full bg-blue-700 text-white font-black py-4 border-b-4 border-blue-900 uppercase">ENREGISTRER L'ARTICLE</button>
                </form>
              </div>

              {/* INVENTAIRE */}
              <div className="bg-white border-8 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] h-[450px] overflow-y-auto">
                <h3 className="text-xl font-black mb-6 underline uppercase">STOCK ACTUEL ({products.length})</h3>
                <div className="space-y-4">
                  {products.map(p => (
                    <div key={p.id} className="flex justify-between items-center border-b-2 border-black pb-2">
                      <div className="flex items-center space-x-3">
                        <img src={p.image} className="w-10 h-10 object-cover border-2 border-black" alt="" />
                        <span className="font-black text-xs uppercase truncate w-32">{p.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-black text-red-600 text-xs">{p.price.toLocaleString()} F</span>
                        <button onClick={() => deleteProduct(p.id)} className="bg-red-600 text-white px-3 py-1 text-[10px] font-black border-2 border-black">SUPPRIMER</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* COMMANDES */}
            <div className="bg-white border-8 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black mb-6 underline uppercase">HISTORIQUE DES COMMANDES CLIENTS</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-gray-200 font-black uppercase border-b-4 border-black">
                    <tr>
                      <th className="p-4 border-2 border-black">DATE</th>
                      <th className="p-4 border-2 border-black">CLIENT (TEL)</th>
                      <th className="p-4 border-2 border-black">ARTICLES</th>
                      <th className="p-4 border-2 border-black">TOTAL</th>
                      <th className="p-4 border-2 border-black">ADRESSE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="p-10 text-center font-black uppercase text-gray-400">AUCUNE COMMANDE POUR LE MOMENT</td></tr>
                    ) : (
                      orders.map(o => (
                        <tr key={o.id} className="border-b-2 border-black font-bold uppercase">
                          <td className="p-4 border-r-2 border-black">{o.date}</td>
                          <td className="p-4 border-r-2 border-black text-blue-700">{o.phone} ({o.method})</td>
                          <td className="p-4 border-r-2 border-black">{o.items.join(', ')}</td>
                          <td className="p-4 border-r-2 border-black text-red-600 font-black">{o.total.toLocaleString()} F</td>
                          <td className="p-4 italic text-[10px]">{o.address}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white p-8 text-center text-[10px] font-black tracking-widest border-t-8 border-red-600">
        © 2024 YOVO MALL TOGO - LOME - TOUS DROITS RESERVES - DESIGN CLASSIQUE NOVICE
      </footer>
    </div>
  );
}
