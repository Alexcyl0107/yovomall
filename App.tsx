
import React, { useState, useEffect, useCallback } from 'react';
import { db, Product, Order } from './db';

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
  const [view, setView] = useState('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [payNum, setPayNum] = useState('');
  const [payCode, setPayCode] = useState('');
  const [payMethod, setPayMethod] = useState('TMONEY');
  const [address, setAddress] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImg, setNewProdImg] = useState('');

  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const p = await db.products.find();
        if (p.length === 0) {
          for (const item of INITIAL_PRODUCTS) {
            await db.products.insertOne(item);
          }
          setProducts(INITIAL_PRODUCTS);
        } else {
          setProducts(p);
        }
        
        const o = await db.orders.find();
        setOrders(o);
        
        const h = await db.searchHistory.get();
        setSearchHistory(h);
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const saveSearchToHistory = useCallback(async () => {
    const term = searchQuery.trim().toUpperCase();
    if (term !== '' && !searchHistory.includes(term)) {
      const newHistory = [term, ...searchHistory].slice(0, 3);
      setSearchHistory(newHistory);
      await db.searchHistory.update(newHistory);
    }
  }, [searchQuery, searchHistory]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (p: Product) => {
    setCart(prev => [...prev, p]);
    alert(`${p.name} ajouté au panier !`);
  };

  const confirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    const newOrder: Order = {
      id: Date.now(),
      items: cart.map(i => i.name),
      total: cart.reduce((s, i) => s + i.price, 0),
      phone: payNum,
      method: payMethod,
      address: address,
      date: new Date().toLocaleString()
    };
    await db.orders.insertOne(newOrder);
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    setLoading(false);
    setView('success');
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const p: Product = { 
      id: Date.now(), 
      name: newProdName.toUpperCase(), 
      price: parseInt(newProdPrice) || 0, 
      image: newProdImg || 'https://via.placeholder.com/500'
    };
    await db.products.insertOne(p);
    setProducts(prev => [...prev, p]);
    setNewProdName(''); setNewProdPrice(''); setNewProdImg('');
    setLoading(false);
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm("Supprimer définitivement cet article du stock ?")) {
      setLoading(true);
      await db.products.deleteOne(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-mono bg-gray-100 text-black">
      {/* HEADER NAV */}
      <nav className="bg-black text-white p-3 md:p-4 border-b-4 md:border-b-8 border-red-600 sticky top-0 z-50">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <h1 className="text-xl md:text-2xl font-black cursor-pointer uppercase tracking-tighter" onClick={() => setView('home')}>
            YOVO MALL <span className="text-red-600 text-[10px] align-top">TG</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 font-bold text-[10px] md:text-xs uppercase">
            <button onClick={() => setView('home')} className="hover:text-red-500 transition-colors">ACCUEIL</button>
            <button onClick={() => setView('products')} className="hover:text-red-500 transition-colors">MAGASIN</button>
            <button onClick={() => setView('my-orders')} className="hover:text-red-500 underline transition-colors">ACHATS</button>
            <button onClick={() => setView('cart')} className="bg-red-600 px-3 md:px-4 py-1 md:py-2 border-2 border-white hover:bg-red-700 transition-colors shadow-sm">
              PANIER ({cart.length})
            </button>
            <button onClick={() => setView('login')} className="text-gray-500 hover:text-white transition-colors">ADMIN</button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-3 md:p-8">
        {loading && (
          <div className="fixed inset-0 bg-white/80 z-[100] flex items-center justify-center font-black uppercase italic animate-pulse">
            Traitement en cours...
          </div>
        )}

        {/* HOME VIEW */}
        {view === 'home' && (
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
            <div className="border-4 md:border-[12px] border-black bg-white p-4 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="bg-red-600 text-white p-6 md:p-10 text-center border-2 md:border-4 border-black">
                <h2 className="text-2xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 uppercase leading-none tracking-tighter">YOVO MALL TOGO</h2>
                <p className="text-[10px] md:text-2xl font-bold uppercase underline decoration-2 md:decoration-4">L'excellence de l'importation à votre porte</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 md:gap-10 mt-6 md:mt-12 items-center">
                <div className="space-y-4 md:space-y-8">
                  <div className="space-y-2 border-l-8 border-red-600 pl-4">
                    <h3 className="text-xl md:text-4xl font-black uppercase leading-none italic">QUALITÉ SUPÉRIEURE</h3>
                    <p className="text-sm md:text-xl font-bold text-gray-800 uppercase">Articles sélectionnés pour le marché Togolais.</p>
                  </div>
                  <div className="flex flex-col gap-3 md:gap-4">
                    <button onClick={() => setView('products')} className="bg-black text-white text-lg md:text-2xl font-black py-4 md:py-6 px-6 border-b-4 md:border-b-8 border-gray-700 hover:scale-[1.02] transition-transform uppercase">DÉCOUVRIR LE STOCK</button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img src={INITIAL_PRODUCTS[0].image} className="border-4 md:border-8 border-black w-full h-[300px] lg:h-[400px] object-cover shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]" alt="Showcase" />
                </div>
              </div>
            </div>

            <section className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 md:gap-4">
                <h3 className="text-lg md:text-3xl font-black uppercase bg-black text-white px-3 md:px-6 py-1 md:py-2">NOS VEDETTES</h3>
                <div className="flex-grow h-1 md:h-2 bg-black"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {products.slice(0, 4).map(p => (
                  <div key={`vedette-${p.id}`} className="bg-white border-2 md:border-4 border-black p-2 md:p-4 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <img src={p.image} className="h-28 md:h-48 w-full object-cover border border-black mb-2 md:mb-4" alt={p.name} />
                    <h4 className="font-black text-[10px] md:text-xs h-6 md:h-8 overflow-hidden uppercase leading-tight mb-1 md:mb-2">{p.name}</h4>
                    <p className="text-red-600 font-black text-sm md:text-xl mb-2 md:mb-4">{p.price.toLocaleString()} F</p>
                    <button onClick={() => addToCart(p)} className="bg-black text-white font-black py-2 md:py-3 text-[9px] md:text-xs border-b-2 md:border-b-4 border-gray-600 uppercase">AJOUTER</button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* PRODUCTS VIEW */}
        {view === 'products' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-4 md:border-b-8 border-black pb-4 md:pb-6">
              <div>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">CATALOGUE COMPLET</h2>
                <div className="mt-2 flex flex-wrap gap-2 text-[8px] md:text-[10px] font-black uppercase text-gray-400">
                  <span>HISTORIQUE:</span>
                  {searchHistory.map((h, i) => (
                    <button key={`history-${i}`} onClick={() => setSearchQuery(h)} className="hover:text-black underline cursor-pointer">{h}</button>
                  ))}
                </div>
              </div>
              <div className="relative w-full md:w-auto">
                <div className="flex items-center border-2 md:border-4 border-black bg-white">
                  <span className="pl-2 md:pl-3 text-lg">🔍</span>
                  <input 
                    type="text" 
                    placeholder="CHERCHER..." 
                    className="p-2 md:p-3 w-full md:w-64 bg-transparent font-black text-[10px] md:text-sm uppercase outline-none"
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onBlur={saveSearchToHistory}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && saveSearchToHistory()}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {filteredProducts.map(p => (
                <div key={`prod-${p.id}`} className="bg-white border-2 md:border-4 border-black p-2 md:p-4 flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <img src={p.image} className="h-28 md:h-40 w-full object-cover border border-black mb-2 md:mb-3" alt={p.name} />
                  <h3 className="font-black text-[10px] md:text-xs h-6 md:h-10 overflow-hidden uppercase">{p.name}</h3>
                  <p className="text-red-600 font-black text-sm md:text-xl my-2">{p.price.toLocaleString()} F</p>
                  <button onClick={() => addToCart(p)} className="bg-black text-white font-black py-2 text-[9px] md:text-xs border-b-2 border-gray-600 uppercase mt-auto">AJOUTER AU PANIER</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CART VIEW */}
        {view === 'cart' && (
          <div className="max-w-2xl mx-auto bg-white border-4 md:border-8 border-black p-4 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 border-b-4 md:border-b-8 border-black pb-2 uppercase text-red-600 italic">VOTRE PANIER</h2>
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-black text-gray-300 text-sm md:text-xl uppercase mb-6">PANIER VIDE</p>
                <button onClick={() => setView('products')} className="bg-black text-white font-black py-2 px-6 uppercase text-xs">RETOUR MAGASIN</button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((it, idx) => (
                  <div key={`cart-item-${idx}`} className="flex justify-between items-center border-b border-black pb-2 font-black text-[10px] md:text-xs uppercase">
                    <span className="truncate mr-4">{it.name}</span>
                    <span className="text-red-600 whitespace-nowrap">{it.price.toLocaleString()} F</span>
                  </div>
                ))}
                <div className="text-xl md:text-3xl font-black flex justify-between pt-4 border-t-4 border-black uppercase bg-yellow-100 p-2">
                  <span>TOTAL :</span>
                  <span>{cart.reduce((s,i) => s+i.price, 0).toLocaleString()} F</span>
                </div>
                <form onSubmit={confirmOrder} className="bg-gray-100 p-4 border-2 md:border-4 border-black space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPayMethod('TMONEY')} className={`p-2 border-2 border-black font-black uppercase text-[10px] ${payMethod === 'TMONEY' ? 'bg-yellow-400' : 'bg-white'}`}>TMONEY</button>
                    <button type="button" onClick={() => setPayMethod('FLOOZ')} className={`p-2 border-2 border-black font-black uppercase text-[10px] ${payMethod === 'FLOOZ' ? 'bg-white text-blue-600' : 'bg-white'}`}>FLOOZ</button>
                  </div>
                  <input type="tel" placeholder="NUMÉRO DE PAIEMENT" className="w-full p-2 border-2 border-black font-black text-[10px] uppercase" value={payNum} onChange={e => setPayNum(e.target.value)} required />
                  <input type="password" placeholder="CODE SECRET (PIN)" className="w-full p-2 border-2 border-black font-black text-[10px] uppercase" value={payCode} onChange={e => setPayCode(e.target.value)} required />
                  <textarea placeholder="ADRESSE DE LIVRAISON (LOMÉ)" className="w-full p-2 border-2 border-black font-black text-[10px] h-16 uppercase" value={address} onChange={e => setAddress(e.target.value)} required />
                  <button className="w-full bg-green-600 text-white font-black py-4 text-lg border-b-8 border-green-900 uppercase hover:bg-green-700 transition-colors">CONFIRMER LA COMMANDE</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SUCCESS VIEW */}
        {view === 'success' && (
          <div className="max-w-md mx-auto text-center border-4 border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl md:text-3xl font-black text-green-600 mb-4 uppercase">MERCI !</h2>
            <p className="font-black mb-8 uppercase text-xs">VOTRE COMMANDE EST ENREGISTRÉE. NOUS VOUS CONTACTERONS SOUS PEU.</p>
            <button onClick={() => setView('products')} className="bg-black text-white font-black py-3 px-8 uppercase text-xs">CONTINUER MES ACHATS</button>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {view === 'admin' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-8 border-red-600">
              <h2 className="font-black uppercase text-xs md:text-base italic">CONSOLE DE GESTION MONGODB-SIM</h2>
              <button onClick={() => setView('home')} className="bg-red-600 px-4 py-1 font-black text-[8px] uppercase border border-white">QUITTER</button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-4 border-black p-4">
                <h3 className="font-black mb-3 underline uppercase text-sm">NOUVEL ARTICLE</h3>
                <form onSubmit={addProduct} className="space-y-3">
                  <input type="text" placeholder="NOM DU PRODUIT" className="w-full p-2 border-2 border-black font-black text-[10px] uppercase" value={newProdName} onChange={e => setNewProdName(e.target.value)} required />
                  <input type="number" placeholder="PRIX (FCFA)" className="w-full p-2 border-2 border-black font-black text-[10px] uppercase" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} required />
                  <input type="text" placeholder="LIEN IMAGE" className="w-full p-2 border-2 border-black font-black text-[10px]" value={newProdImg} onChange={e => setNewProdImg(e.target.value)} required />
                  <button className="w-full bg-blue-600 text-white font-black py-2 uppercase border-b-4 border-blue-900 text-xs">AJOUTER AU STOCK</button>
                </form>
              </div>
              <div className="bg-white border-4 border-black p-4 h-64 overflow-y-auto">
                <h3 className="font-black mb-3 underline uppercase text-sm">STOCK ACTUEL ({products.length})</h3>
                {products.map(p => (
                  <div key={`admin-prod-${p.id}`} className="flex justify-between items-center border-b py-2 text-[8px] font-black uppercase">
                    <span className="truncate max-w-[70%]">{p.name}</span>
                    <button onClick={() => deleteProduct(p.id)} className="bg-red-100 text-red-600 font-black border border-red-600 px-2 shrink-0">SUPPR</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOGIN ADMIN */}
        {view === 'login' && (
          <div className="max-w-sm mx-auto border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-lg md:text-2xl font-black text-center mb-6 uppercase tracking-tighter italic">AUTHENTIFICATION</h2>
            <div className="space-y-3">
              <input type="email" placeholder="EMAIL ADMIN" className="w-full p-2 border-2 border-black font-black text-[10px] uppercase" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
              <input type="password" placeholder="MOT DE PASSE" className="w-full p-2 border-2 border-black font-black text-[10px] uppercase" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
              <button onClick={() => (adminEmail === "admin@gmail.com" && adminPass === "1234") ? setView('admin') : alert("Accès refusé")} className="w-full bg-black text-white font-black py-3 uppercase text-xs">ENTRER</button>
            </div>
          </div>
        )}

        {/* ORDERS VIEW */}
        {view === 'my-orders' && (
          <div className="max-w-4xl mx-auto bg-white border-4 md:border-8 border-black p-4 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl md:text-3xl font-black mb-4 uppercase border-b-4 border-black pb-2">HISTORIQUE DES ACHATS</h2>
            {orders.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-black text-gray-400 uppercase mb-4 text-xs italic">AUCUNE COMMANDE TROUVÉE SUR CET APPAREIL.</p>
                <button onClick={() => setView('products')} className="bg-black text-white font-black py-2 px-6 uppercase text-xs">COMMENCER SHOPPING</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={`order-${o.id}`} className="border-2 border-black p-3 bg-gray-50 relative">
                    <div className="absolute top-2 right-2 bg-yellow-400 px-2 py-0.5 text-[8px] font-black uppercase">En cours</div>
                    <div className="flex justify-between font-black text-[8px] md:text-xs border-b border-black pb-1 mb-2">
                      <span>CMD#{o.id} - LE {o.date}</span>
                      <span className="text-red-600 font-bold">{o.total.toLocaleString()} F</span>
                    </div>
                    <p className="text-[10px] md:text-xs font-bold uppercase truncate italic">{o.items.join(', ')}</p>
                    <div className="mt-2 text-[8px] font-black text-gray-500 uppercase">Livraison à: {o.address}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-black text-white p-6 md:p-8 text-center text-[8px] md:text-[10px] font-black tracking-widest border-t-4 md:border-t-8 border-red-600 uppercase mt-auto">
        YOVO MALL TOGO © 2026 | LOMÉ - QUARTIER ADMINISTRATIF
      </footer>
    </div>
  );
}
