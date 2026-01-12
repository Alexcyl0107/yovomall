
import React, { useState, useEffect } from 'react';

// --- STRUCTURES DE DONNÉES ---
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

// CATALOGUE STRICT DE 10 PRODUITS
const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "ORDINATEUR PORTABLE HP", price: 450000, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500" },
  { id: 2, name: "TELEPHONE SAMSUNG GALAXY", price: 350000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
  { id: 3, name: "MONTRE CONNECTEE SPORT", price: 45000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
  { id: 4, name: "CASQUE BLUETOOTH PRO", price: 25000, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { id: 5, name: "SAC A DOS VOYAGE", price: 15000, image: "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?w=500" },
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

  // Formulaires
  const [payNum, setPayNum] = useState('');
  const [payCode, setPayCode] = useState('');
  const [payMethod, setPayMethod] = useState('TMONEY');
  const [address, setAddress] = useState('');
  
  // Admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('yovo_vfinal');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('yovo_vfinal', JSON.stringify(INITIAL_PRODUCTS));
    }
    const savedOrders = localStorage.getItem('yovo_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const addToCart = (p: Product) => {
    setCart([...cart, p]);
    alert("Produit ajouté !");
  };

  const total = cart.reduce((acc, curr) => acc + curr.price, 0);

  const confirmOrder = (e: any) => {
    e.preventDefault();
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
    localStorage.setItem('yovo_orders', JSON.stringify(updated));
    setCart([]);
    setView('success');
  };

  return (
    <div className="min-h-screen flex flex-col font-mono text-black">
      
      {/* BARRE DE NAVIGATION CLASSIQUE */}
      <nav className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-red-600">
        <h1 className="text-2xl font-black cursor-pointer" onClick={() => setView('home')}>YOVO MALL</h1>
        <div className="space-x-4 font-bold text-sm">
          <button onClick={() => setView('home')} className="hover:text-red-500">ACCUEIL</button>
          <button onClick={() => setView('products')} className="hover:text-red-500">MAGASIN</button>
          <button onClick={() => setView('cart')} className="bg-red-600 px-4 py-1">PANIER ({cart.length})</button>
          <button onClick={() => setView('login')} className="text-gray-400">ADMIN</button>
        </div>
      </nav>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-grow p-4 md:p-8">

        {/* PAGE ACCUEIL : VITRINE CLASSIQUE */}
        {view === 'home' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-8 border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-red-600 text-white p-8 text-center border-4 border-black mb-6">
                <h2 className="text-4xl font-black mb-2">GRANDE VITRINE YOVO MALL</h2>
                <p className="text-lg font-bold italic">QUALITE SUPERIEURE - PRIX IMBATTABLES</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h3 className="text-3xl font-black leading-tight">BIENVENUE DANS NOTRE BOUTIQUE PHYSIQUE EN LIGNE</h3>
                  <p className="font-bold text-gray-700">TOUS NOS ARTICLES SONT IMPORTES ET GARANTIS. NOUS LIVRONS PARTOUT A LOME.</p>
                  <button 
                    onClick={() => setView('products')}
                    className="bg-black text-white text-xl font-black py-4 px-8 border-b-4 border-gray-600 active:border-b-0 hover:bg-gray-800 w-full"
                  >
                    VOIR LE CATALOGUE
                  </button>
                </div>
                <img src={INITIAL_PRODUCTS[1].image} className="border-4 border-black" alt="Magasin" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-4 border-black p-4 bg-yellow-400 font-black text-center">PAIEMENT TMONEY / FLOOZ</div>
              <div className="border-4 border-black p-4 bg-blue-400 font-black text-center">LIVRAISON RAPIDE</div>
              <div className="border-4 border-black p-4 bg-green-400 font-black text-center">ARTICLES 100% NEUFS</div>
            </div>
          </div>
        )}

        {/* PAGE PRODUITS */}
        {view === 'products' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-black mb-6 border-b-4 border-black inline-block">NOS 10 PRODUITS DU MOMENT</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white border-4 border-black p-3 flex flex-col">
                  <img src={p.image} className="h-40 w-full object-cover border-2 border-black mb-2" alt="" />
                  <h3 className="font-black text-[10px] uppercase h-8 overflow-hidden">{p.name}</h3>
                  <p className="text-red-600 font-black text-lg my-2">{p.price.toLocaleString()} FCFA</p>
                  <button 
                    onClick={() => addToCart(p)}
                    className="bg-black text-white text-[10px] font-black py-2 mt-auto border-b-2 border-gray-500"
                  >
                    ACHETER
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANIER & PAIEMENT */}
        {view === 'cart' && (
          <div className="max-w-xl mx-auto bg-white border-8 border-black p-8 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black mb-6 uppercase border-b-4 border-black">VOTRE PANIER</h2>
            {cart.length === 0 ? (
              <p className="font-bold text-gray-400 text-center py-10">PANIER VIDE</p>
            ) : (
              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between font-bold border-b-2 border-black pb-2">
                    <span>{item.name}</span>
                    <span className="text-red-600">{item.price.toLocaleString()} F</span>
                  </div>
                ))}
                <div className="text-2xl font-black flex justify-between pt-4 border-t-4 border-black">
                  <span>TOTAL :</span>
                  <span>{total.toLocaleString()} FCFA</span>
                </div>
                
                <div className="bg-gray-100 p-6 border-4 border-black space-y-4">
                  <h3 className="font-black underline">MODE DE PAIEMENT</h3>
                  <div className="flex gap-4">
                    <button onClick={() => setPayMethod('TMONEY')} className={`flex-1 p-2 border-2 border-black font-black ${payMethod === 'TMONEY' ? 'bg-yellow-400' : 'bg-white'}`}>TMONEY</button>
                    <button onClick={() => setPayMethod('FLOOZ')} className={`flex-1 p-2 border-2 border-black font-black ${payMethod === 'FLOOZ' ? 'bg-white text-blue-600' : 'bg-white'}`}>FLOOZ</button>
                  </div>
                  <input type="tel" placeholder="NUMERO DE TELEPHONE" className="w-full p-3 border-2 border-black font-bold" value={payNum} onChange={e => setPayNum(e.target.value)} required />
                  <input type="password" placeholder="CODE SECRET" className="w-full p-3 border-2 border-black font-bold" value={payCode} onChange={e => setPayCode(e.target.value)} required />
                  <textarea placeholder="ADRESSE DE LIVRAISON (Quartier, Maison...)" className="w-full p-3 border-2 border-black font-bold h-24" value={address} onChange={e => setAddress(e.target.value)} required />
                  <button onClick={confirmOrder} className="w-full bg-green-600 text-white font-black py-4 text-xl border-b-4 border-green-900 active:border-b-0">VALIDER LA COMMANDE</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUCCES */}
        {view === 'success' && (
          <div className="max-w-md mx-auto text-center border-8 border-black p-10 bg-white">
            <h2 className="text-3xl font-black text-green-600 mb-4">BRAVO !</h2>
            <p className="font-bold mb-8">VOTRE COMMANDE A ETE ENREGISTREE. NOUS VOUS CONTACTERONS POUR LA LIVRAISON.</p>
            <button onClick={() => setView('home')} className="bg-black text-white font-black py-3 px-8">RETOUR</button>
          </div>
        )}

        {/* LOGIN ADMIN */}
        {view === 'login' && (
          <div className="max-w-xs mx-auto border-4 border-black p-6 bg-white">
            <h2 className="text-center font-black mb-4 underline">ACCES GERANT</h2>
            <div className="space-y-4">
              <input type="email" placeholder="EMAIL" className="w-full p-2 border-2 border-black" onChange={e => setAdminEmail(e.target.value)} />
              <input type="password" placeholder="CODE" className="w-full p-2 border-2 border-black" onChange={e => setAdminPass(e.target.value)} />
              <button 
                onClick={() => {
                  if(adminEmail === "admin@gmail.com" && adminPass === "1234") setView('admin');
                  else alert("ERREUR");
                }}
                className="w-full bg-black text-white font-black py-2"
              >
                CONNEXION
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD ADMIN */}
        {view === 'admin' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-black text-white p-4 flex justify-between">
              <h2 className="font-black">PANNEAU DE GESTION</h2>
              <button onClick={() => setView('home')} className="text-red-500 font-black">DECONNEXION</button>
            </div>
            
            <div className="bg-white border-4 border-black p-4">
              <h3 className="font-black mb-4 underline">HISTORIQUE DES COMMANDES</h3>
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">DATE</th>
                    <th className="p-2 border">CLIENT</th>
                    <th className="p-2 border">ARTICLES</th>
                    <th className="p-2 border">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-b font-bold">
                      <td className="p-2">{o.date}</td>
                      <td className="p-2">{o.phone} ({o.method})</td>
                      <td className="p-2">{o.items.join(', ')}</td>
                      <td className="p-2 text-red-600">{o.total.toLocaleString()} F</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-black text-white p-6 text-center text-[10px] font-black tracking-widest border-t-4 border-red-600">
        COPYRIGHT 2024 - YOVO MALL TOGO - TOUS DROITS RESERVES
      </footer>
    </div>
  );
}
