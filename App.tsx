
import React, { useState, useEffect } from 'react';
import { db } from './db';

// --- TYPES ---
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
  
  // Recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Formulaires
  const [payNum, setPayNum] = useState('');
  const [payCode, setPayCode] = useState('');
  const [payMethod, setPayMethod] = useState('TMONEY');
  const [address, setAddress] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Admin New Product
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImg, setNewProdImg] = useState('');

  useEffect(() => {
    async function initData() {
      setLoading(true);
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
      
      setLoading(false);
    }
    initData();
  }, []);

  // --- LOGIQUE RECHERCHE ---
  const saveSearchToHistory = async () => {
    if (searchQuery.trim() !== '' && !searchHistory.includes(searchQuery.toUpperCase())) {
      const newHistory = [searchQuery.toUpperCase(), ...searchHistory].slice(0, 3);
      setSearchHistory(newHistory);
      await db.searchHistory.update(newHistory);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- ACTIONS CLIENT ---
  const addToCart = (p: Product) => {
    setCart([...cart, p]);
    alert("Ajouté au panier !");
  };

  const confirmOrder = async (e: any) => {
    e.preventDefault();
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
    setOrders([...orders, newOrder]);
    setCart([]);
    setLoading(false);
    setView('success');
  };

  // --- ACTIONS ADMIN ---
  const addProduct = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const p: Product = { id: Date.now(), name: newProdName.toUpperCase(), price: parseInt(newProdPrice), image: newProdImg };
    await db.products.insertOne(p);
    setProducts([...products, p]);
    setNewProdName(''); setNewProdPrice(''); setNewProdImg('');
    setLoading(false);
  };

  const deleteProduct = async (id: number) => {
    if (confirm("Supprimer de la base de données ?")) {
      setLoading(true);
      await db.products.deleteOne(id);
      setProducts(products.filter(p => p.id !== id));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-mono bg-gray-100 text-black">
      
      {/* NAV BAR */}
      <nav className="bg-black text-white p-4 border-b-8 border-red-600 sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-black cursor-pointer" onClick={() => setView('home')}>YOVO MALL</h1>
          <div className="flex flex-wrap gap-4 font-bold text-xs uppercase">
            <button onClick={() => setView('home')} className="hover:text-red-500">ACCUEIL</button>
            <button onClick={() => setView('products')} className="hover:text-red-500">MAGASIN</button>
            <button onClick={() => setView('my-orders')} className="hover:text-red-500 underline">MES COMMANDES</button>
            <button onClick={() => setView('cart')} className="bg-red-600 px-4 py-2 border-2 border-white">PANIER ({cart.length})</button>
            <button onClick={() => setView('login')} className="text-gray-500">ADMIN</button>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4 md:p-8">

        {/* ACCUEIL VITRINE */}
        {view === 'home' && (
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* HERO SECTION */}
            <div className="border-[12px] border-black bg-white p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="bg-red-600 text-white p-10 text-center border-4 border-black relative z-10">
                <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase leading-none tracking-tighter">BIENVENUE CHEZ YOVO MALL</h2>
                <p className="text-xl md:text-2xl font-bold uppercase underline decoration-4">VENTE DE PRODUIT DE QUALITÉ LOME-TOGO</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-10 mt-12 items-center">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black uppercase leading-none italic">QUALITÉ SUPÉRIEURE</h3>
                    <p className="text-xl font-bold text-gray-800 uppercase">Tous nos articles sont rigoureusement sélectionnés pour vous offrir le meilleur de l'importation à Lomé.</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button onClick={() => setView('products')} className="bg-black text-white text-2xl font-black py-6 px-10 border-b-8 border-gray-700 hover:bg-gray-900 transition-colors uppercase">DÉCOUVRIR LE CATALOGUE</button>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-yellow-400 border-4 border-black p-4 font-black text-center uppercase text-sm">Livraison 24h</div>
                      <div className="flex-1 bg-white border-4 border-black p-4 font-black text-center uppercase text-sm">Paiement Mobile</div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img src={INITIAL_PRODUCTS[1].image} className="border-8 border-black w-full h-[400px] object-cover shadow-[10px_10px_0px_0px_rgba(220,38,38,1)]" alt="Produit vedette" />
                </div>
              </div>
            </div>

            {/* SECTION PRODUITS VEDETTES (VITRINE) */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-3xl font-black uppercase bg-black text-white px-6 py-2">NOS MEILLEURES VENTES</h3>
                <div className="flex-grow h-2 bg-black"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.slice(0, 4).map(p => (
                  <div key={p.id} className="bg-white border-4 border-black p-4 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    <img src={p.image} className="h-48 w-full object-cover border-2 border-black mb-4" alt={p.name} />
                    <h4 className="font-black text-xs h-8 overflow-hidden uppercase leading-tight mb-2">{p.name}</h4>
                    <p className="text-red-600 font-black text-xl mb-4">{p.price.toLocaleString()} F</p>
                    <button onClick={() => addToCart(p)} className="bg-black text-white font-black py-3 text-xs border-b-4 border-gray-600 uppercase">AJOUTER AU PANIER</button>
                  </div>
                ))}
              </div>
              <div className="text-center pt-6">
                 <button onClick={() => setView('products')} className="underline font-black text-xl uppercase hover:text-red-600">VOIR TOUS LES PRODUITS →</button>
              </div>
            </section>

            {/* BANNER SERVICES SIMPLIFIÉE */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border-4 border-black p-6 text-center">
                <h4 className="font-black uppercase text-sm mb-1">LIVRAISON RAPIDE</h4>
                <p className="text-[10px] font-bold text-gray-600 uppercase">Partout à Lomé et environs</p>
              </div>
              <div className="bg-white border-4 border-black p-6 text-center">
                <h4 className="font-black uppercase text-sm mb-1">TMONEY / FLOOZ</h4>
                <p className="text-[10px] font-bold text-gray-600 uppercase">Paiement sécurisé par mobile money</p>
              </div>
              <div className="bg-white border-4 border-black p-6 text-center">
                <h4 className="font-black uppercase text-sm mb-1">QUALITÉ GARANTIE</h4>
                <p className="text-[10px] font-bold text-gray-600 uppercase">Satisfait ou remplacé</p>
              </div>
            </div>
          </div>
        )}

        {/* MAGASIN */}
        {view === 'products' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-8 border-black pb-6">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter">TOUT LE CATALOGUE</h2>
                {searchHistory.length > 0 && (
                  <div className="mt-2 flex gap-3 text-[10px] font-black uppercase text-gray-400">
                    <span>Recents:</span>
                    {searchHistory.map((h, i) => (
                      <button key={i} onClick={() => setSearchQuery(h)} className="hover:text-black hover:underline cursor-pointer">{h}</button>
                    ))}
                    <button onClick={async () => {setSearchHistory([]); await db.searchHistory.update([])}} className="text-red-500 ml-2">Effacer</button>
                  </div>
                )}
              </div>
              
              <div className="relative group">
                <div className="flex items-center border-4 border-black bg-white focus-within:bg-yellow-50 transition-colors">
                  <span className="pl-3 pr-2 text-lg">🔍</span>
                  <input 
                    type="text" 
                    placeholder="RECHERCHER..." 
                    className="p-3 w-full md:w-64 bg-transparent font-black text-sm uppercase outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={saveSearchToHistory}
                    onKeyDown={(e) => e.key === 'Enter' && saveSearchToHistory()}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="pr-3 font-black text-red-600 hover:scale-125 transition-transform">×</button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredProducts.length > 0 ? filteredProducts.map(p => (
                <div key={p.id} className="bg-white border-4 border-black p-4 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                  <img src={p.image} className="h-40 w-full object-cover border-2 border-black mb-3" alt={p.name} />
                  <h3 className="font-black text-xs h-10 overflow-hidden uppercase leading-tight">{p.name}</h3>
                  <p className="text-red-600 font-black text-xl my-3">{p.price.toLocaleString()} F</p>
                  <button onClick={() => addToCart(p)} className="bg-black text-white font-black py-3 text-xs border-b-4 border-gray-600 uppercase mt-auto">AJOUTER</button>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center border-4 border-black border-dashed font-black text-gray-400 uppercase">
                  Aucun article trouvé pour "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* MES COMMANDES */}
        {view === 'my-orders' && (
          <div className="max-w-4xl mx-auto bg-white border-8 border-black p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black mb-6 uppercase border-b-8 border-black pb-2">VOS ACHATS PASSÉS</h2>
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-black text-gray-400 uppercase mb-4 text-xl">AUCUNE COMMANDE ENREGISTRÉE.</p>
                <button onClick={() => setView('products')} className="bg-black text-white font-black py-3 px-8 uppercase">FAIRE UN ACHAT</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="border-4 border-black p-4 bg-gray-50">
                    <div className="flex justify-between font-black text-xs border-b-2 border-black pb-2 mb-2">
                      <span>LE {o.date}</span>
                      <span className="text-red-600">{o.total.toLocaleString()} F</span>
                    </div>
                    <p className="text-xs font-bold uppercase truncate">{o.items.join(', ')}</p>
                    <div className="text-[10px] mt-2 font-black text-green-600 uppercase italic">Statut: En cours de livraison à {o.address}</div>
                  </div>
                ))}
              </div>
            )}
            {orders.length > 0 && (
              <button onClick={() => setView('home')} className="mt-8 bg-black text-white font-black py-3 px-8 uppercase">RETOUR À L'ACCUEIL</button>
            )}
          </div>
        )}

        {/* PANIER */}
        {view === 'cart' && (
          <div className="max-w-2xl mx-auto bg-white border-8 border-black p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black mb-8 border-b-8 border-black pb-2 uppercase text-red-600">VALIDATION PANIER</h2>
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-black text-gray-300 text-xl uppercase mb-6">VOTRE PANIER EST VIDE</p>
                <button onClick={() => setView('products')} className="bg-black text-white font-black py-3 px-8 uppercase">RETOUR AU MAGASIN</button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b-2 border-black pb-2 font-black text-xs uppercase">
                    <span>{it.name}</span>
                    <span className="text-red-600">{it.price.toLocaleString()} F</span>
                  </div>
                ))}
                <div className="text-3xl font-black flex justify-between pt-4 border-t-8 border-black uppercase">
                  <span>TOTAL :</span>
                  <span>{cart.reduce((s,i) => s+i.price, 0).toLocaleString()} F</span>
                </div>
                <form onSubmit={confirmOrder} className="bg-gray-100 p-6 border-4 border-black space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPayMethod('TMONEY')} className={`p-3 border-4 border-black font-black uppercase ${payMethod === 'TMONEY' ? 'bg-yellow-400' : 'bg-white'}`}>TMONEY</button>
                    <button type="button" onClick={() => setPayMethod('FLOOZ')} className={`p-3 border-4 border-black font-black uppercase ${payMethod === 'FLOOZ' ? 'bg-white text-blue-600' : 'bg-white'}`}>FLOOZ</button>
                  </div>
                  <input type="tel" placeholder="NUMERO DE TELEPHONE" className="w-full p-3 border-4 border-black font-black uppercase" value={payNum} onChange={e => setPayNum(e.target.value)} required />
                  <input type="password" placeholder="CODE SECRET PIN" className="w-full p-3 border-4 border-black font-black uppercase" value={payCode} onChange={e => setPayCode(e.target.value)} required />
                  <textarea placeholder="ADRESSE DE LIVRAISON" className="w-full p-3 border-4 border-black font-black h-24 uppercase" value={address} onChange={e => setAddress(e.target.value)} required />
                  <button className="w-full bg-green-600 text-white font-black py-4 text-xl border-b-4 border-green-900 uppercase">VALIDER ET PAYER</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SUCCES */}
        {view === 'success' && (
          <div className="max-w-md mx-auto text-center border-8 border-black p-12 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black text-green-600 mb-6 uppercase tracking-tighter">ACHAT RÉUSSI !</h2>
            <p className="font-black mb-8 uppercase">VOTRE COMMANDE EST ENREGISTRÉE. NOUS VOUS APPELONS SOUS PEU POUR LA LIVRAISON.</p>
            <button onClick={() => setView('products')} className="bg-black text-white font-black py-3 px-8 uppercase">OK, CONTINUER</button>
          </div>
        )}

        {/* LOGIN ADMIN */}
        {view === 'login' && (
          <div className="max-w-sm mx-auto border-8 border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black text-center mb-8 underline uppercase tracking-tighter">ACCÈS GESTION</h2>
            <div className="space-y-4">
              <input type="email" placeholder="EMAIL" className="w-full p-3 border-4 border-black font-black uppercase" onChange={e => setAdminEmail(e.target.value)} />
              <input type="password" placeholder="CODE" className="w-full p-3 border-4 border-black font-black uppercase" onChange={e => setAdminPass(e.target.value)} />
              <button onClick={() => adminEmail === "admin@gmail.com" && adminPass === "1234" ? setView('admin') : alert("Echec")} className="w-full bg-black text-white font-black py-3 uppercase">SE CONNECTER</button>
            </div>
          </div>
        )}

        {/* DASHBOARD ADMIN */}
        {view === 'admin' && (
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-8 border-red-600">
              <h2 className="font-black uppercase">PANNEAU MONGODB (ADMIN)</h2>
              <button onClick={() => setView('home')} className="bg-red-600 px-4 py-1 font-black text-xs uppercase border border-white">SORTIR</button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border-4 border-black p-6">
                <h3 className="font-black mb-4 underline uppercase">AJOUTER ARTICLE</h3>
                <form onSubmit={addProduct} className="space-y-4">
                  <input type="text" placeholder="NOM" className="w-full p-2 border-2 border-black font-black uppercase" value={newProdName} onChange={e => setNewProdName(e.target.value)} required />
                  <input type="number" placeholder="PRIX" className="w-full p-2 border-2 border-black font-black uppercase" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} required />
                  <input type="text" placeholder="IMAGE URL" className="w-full p-2 border-2 border-black font-black" value={newProdImg} onChange={e => setNewProdImg(e.target.value)} required />
                  <button className="w-full bg-blue-600 text-white font-black py-2 uppercase border-b-4 border-blue-900">ENREGISTRER</button>
                </form>
              </div>
              <div className="bg-white border-4 border-black p-6 h-64 overflow-y-auto">
                <h3 className="font-black mb-4 underline uppercase">STOCK ({products.length})</h3>
                {products.map(p => (
                  <div key={p.id} className="flex justify-between items-center border-b py-2 text-[10px] font-black uppercase">
                    <span>{p.name}</span>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-600 font-black border border-black px-1 hover:bg-red-100">DEL</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-4 border-black p-6">
              <h3 className="font-black mb-4 underline uppercase">TOUTES LES COMMANDES REÇUES</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] font-bold border-collapse">
                  <thead className="bg-gray-200 border-b-4 border-black uppercase">
                    <tr><th className="p-2 border border-black">DATE</th><th className="p-2 border border-black">CLIENT</th><th className="p-2 border border-black">TOTAL</th><th className="p-2 border border-black">ADRESSE</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-black uppercase">
                        <td className="p-2 border border-black">{o.date}</td>
                        <td className="p-2 border border-black">{o.phone}</td>
                        <td className="p-2 border border-black">{o.total} F</td>
                        <td className="p-2 border border-black italic truncate max-w-[150px]">{o.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-black text-white p-8 text-center text-[10px] font-black tracking-widest border-t-8 border-red-600 uppercase mt-auto">
        YOVO MALL TOGO - LOME | QUALITÉ GARANTIE
      </footer>
    </div>
  );
}
