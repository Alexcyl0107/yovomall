
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
  items: { name: string; price: number }[];
  total: number;
  paymentMethod: string;
  phoneNumber: string;
  address: string;
  date: string;
}

// CATALOGUE DE 10 PRODUITS EXACTEMENT
const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Ordinateur Portable HP", price: 450000, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80" },
  { id: 2, name: "Téléphone Samsung Galaxy", price: 350000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80" },
  { id: 3, name: "Montre Connectée Sport", price: 45000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" },
  { id: 4, name: "Casque Bluetooth Pro", price: 25000, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { id: 5, name: "Sac à Dos Voyage", price: 15000, image: "https://images.unsplash.com/photo-1553062407-98eeb94c6a62?w=500&q=80" },
  { id: 6, name: "Appareil Photo Reflex", price: 120000, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80" },
  { id: 7, name: "Chaussures de Sport", price: 30000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80" },
  { id: 8, name: "Tablette Graphique", price: 180000, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80" },
  { id: 9, name: "Machine à Café", price: 55000, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80" },
  { id: 10, name: "Paire de Lunettes", price: 10000, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80" }
];

export default function App() {
  // Navigation
  const [view, setView] = useState<'home' | 'products' | 'cart' | 'payment' | 'address' | 'success' | 'admin-login' | 'admin-dashboard' | 'contact'>('home');
  
  // Données (on change la clé storage pour forcer le reset à 10 produits)
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Champs Client
  const [payMethod, setPayMethod] = useState('TMoney');
  const [payNumber, setPayNumber] = useState('');
  const [payCode, setPayCode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Champs Admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('');

  // Initialisation
  useEffect(() => {
    const savedProducts = localStorage.getItem('yovomall_db_v4');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('yovomall_db_v4', JSON.stringify(INITIAL_PRODUCTS));
    }
    const savedOrders = localStorage.getItem('yovomall_orders_v4');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Actions Client
  const addToCart = (p: Product) => {
    setCart([...cart, p]);
    alert(p.name + " ajouté au panier.");
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const goToAddressStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payNumber || !payCode) return alert("Veuillez remplir les informations de paiement.");
    setView('address');
  };

  const finishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress) return alert("Veuillez indiquer une adresse de livraison.");
    
    const newOrder: Order = {
      id: Date.now(),
      items: cart.map(i => ({ name: i.name, price: i.price })),
      total: cartTotal,
      paymentMethod: payMethod,
      phoneNumber: payNumber,
      address: deliveryAddress,
      date: new Date().toLocaleString()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('yovomall_orders_v4', JSON.stringify(updatedOrders));
    setCart([]);
    setView('success');
  };

  // Actions Admin
  const loginAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === "admin@gmail.com" && adminPass === "1234") setView('admin-dashboard');
    else alert("Email ou Code incorrect.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProdImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdImage) return alert("Remplissez tout.");
    const p: Product = { id: Date.now(), name: newProdName, price: parseInt(newProdPrice), image: newProdImage };
    const updated = [...products, p];
    setProducts(updated);
    localStorage.setItem('yovomall_db_v4', JSON.stringify(updated));
    setNewProdName(''); setNewProdPrice(''); setNewProdImage('');
    alert("Produit ajouté.");
  };

  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('yovomall_db_v4', JSON.stringify(updated));
  };

  const Header = () => (
    <header className="bg-[#131921] text-white p-4 sticky top-0 z-50 border-b-4 border-orange-500 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-black text-orange-400 cursor-pointer uppercase tracking-tighter" onClick={() => setView('home')}>
          YOVO MALL
        </h1>
        <nav className="flex items-center space-x-4 font-bold text-xs uppercase">
          <button onClick={() => setView('home')} className="hover:text-orange-400">Accueil</button>
          <button onClick={() => setView('products')} className="hover:text-orange-400">Magasin</button>
          <button onClick={() => setView('cart')} className="bg-orange-500 text-black px-3 py-1 rounded">Panier ({cart.length})</button>
          <button onClick={() => setView('admin-login')} className="text-gray-400">Admin</button>
        </nav>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header />

      <main className="flex-grow container mx-auto p-4">
        
        {/* VUE ACCUEIL : DESIGN VITRINE CLASSIQUE (PAS MODERNE) */}
        {view === 'home' && (
          <div className="py-6 max-w-5xl mx-auto">
            <div className="border-[10px] border-gray-800 bg-white p-4 shadow-xl">
              
              {/* Enseigne Magasin */}
              <div className="bg-red-700 text-white text-center py-6 mb-8 border-b-8 border-gray-800">
                <h2 className="text-4xl font-black uppercase tracking-widest">GRANDE VITRINE YOVO MALL</h2>
                <p className="font-bold italic mt-1 uppercase">Vente en Gros et Détail - Qualité Supérieure</p>
              </div>

              {/* Contenu Principal Vitrine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b-8 border-gray-800">
                <div className="bg-gray-50 p-10 flex flex-col justify-center border-r-8 border-gray-800">
                  <h3 className="text-5xl font-black text-gray-900 leading-none mb-6">BIENVENUE DANS NOTRE BOUTIQUE !</h3>
                  <p className="text-lg text-gray-700 font-bold mb-8 uppercase">Découvrez notre catalogue complet d'articles importés. Prix imbattables à Lomé.</p>
                  <button 
                    onClick={() => setView('products')}
                    className="bg-blue-800 text-white font-black py-4 px-12 text-xl rounded-none border-b-8 border-blue-950 active:translate-y-2 active:border-b-0 uppercase"
                  >
                    Entrer et Acheter
                  </button>
                </div>
                <div className="bg-gray-200">
                  <img src={INITIAL_PRODUCTS[0].image} alt="Promotion" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Échantillons en bas de vitrine */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-0">
                {products.slice(0, 5).map(p => (
                  <div key={p.id} className="border-r-8 border-gray-800 last:border-r-0 p-4 hover:bg-yellow-50 cursor-pointer" onClick={() => setView('products')}>
                    <img src={p.image} alt={p.name} className="h-32 w-full object-cover border-4 border-gray-800 mb-2" />
                    <p className="text-[10px] font-black uppercase truncate">{p.name}</p>
                    <p className="text-red-700 font-black">{p.price.toLocaleString()} F</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations du bas */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-4 border-gray-800 p-6 text-center font-black uppercase">Livraison Gratuite</div>
              <div className="bg-white border-4 border-gray-800 p-6 text-center font-black uppercase">Paiement TMoney / Flooz</div>
              <div className="bg-white border-4 border-gray-800 p-6 text-center font-black uppercase">Articles Garantis</div>
            </div>
          </div>
        )}

        {/* PRODUITS (CATALOGUE) */}
        {view === 'products' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase border-b-4 border-gray-800 pb-2 inline-block">Notre Catalogue</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white border-4 border-gray-800 p-3 shadow-md">
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-2 border-2 border-gray-800" />
                  <h3 className="font-bold text-xs h-8 overflow-hidden uppercase">{p.name}</h3>
                  <p className="text-lg font-black text-red-700 mb-3">{p.price.toLocaleString()} F</p>
                  <button 
                    onClick={() => addToCart(p)}
                    className="w-full bg-[#ffd814] py-2 border-2 border-gray-800 font-black uppercase text-[10px]"
                  >
                    Ajouter au Panier
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANIER */}
        {view === 'cart' && (
          <div className="max-w-xl mx-auto bg-white border-8 border-gray-800 p-8">
            <h2 className="text-2xl font-black mb-6 uppercase border-b-4 border-gray-800 pb-2">Votre Panier</h2>
            {cart.length === 0 ? <p className="text-center py-10 font-bold uppercase text-gray-400">Le panier est vide.</p> : (
              <div className="space-y-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b-2 border-gray-100">
                    <div>
                      <p className="font-black uppercase text-sm">{item.name}</p>
                      <p className="text-red-700 font-bold">{item.price.toLocaleString()} F</p>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-red-600 font-bold underline text-xs uppercase">Retirer</button>
                  </div>
                ))}
                <div className="pt-4 border-t-4 border-gray-800 flex justify-between items-center text-xl font-black uppercase">
                  <span>Total :</span>
                  <span>{cartTotal.toLocaleString()} F</span>
                </div>
                <button 
                  onClick={() => setView('payment')}
                  className="w-full mt-6 bg-orange-500 text-white py-4 font-black text-xl uppercase border-b-8 border-orange-800 active:translate-y-1 active:border-b-0"
                >
                  Passer au Paiement
                </button>
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 1 : PAIEMENT */}
        {view === 'payment' && (
          <div className="max-w-sm mx-auto bg-white border-8 border-gray-800 p-8">
            <h2 className="text-xl font-black text-center mb-6 uppercase border-b-4 border-orange-500 pb-2">Paiement Mobile</h2>
            <form onSubmit={goToAddressStep} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase">Réseau :</label>
                <select className="w-full border-4 border-gray-800 p-2 font-bold" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                  <option value="TMoney">TMoney</option>
                  <option value="Flooz">Flooz</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase">Numéro :</label>
                <input type="tel" className="w-full border-4 border-gray-800 p-2 font-bold" required value={payNumber} onChange={e => setPayNumber(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-black uppercase">Code Secret :</label>
                <input type="password" placeholder="****" className="w-full border-4 border-gray-800 p-2 font-bold" required value={payCode} onChange={e => setPayCode(e.target.value)} />
              </div>
              <div className="bg-gray-100 p-4 border-2 border-gray-800 text-center font-black text-xl">
                Total : {cartTotal.toLocaleString()} F
              </div>
              <button className="w-full bg-blue-700 text-white py-4 font-black uppercase border-b-8 border-blue-950 active:translate-y-1 active:border-b-0">Étape 2 : Livraison</button>
              <button type="button" onClick={() => setView('cart')} className="w-full text-xs underline uppercase mt-2">Annuler</button>
            </form>
          </div>
        )}

        {/* ÉTAPE 2 : ADRESSE */}
        {view === 'address' && (
          <div className="max-w-sm mx-auto bg-white border-8 border-gray-800 p-8">
            <h2 className="text-xl font-black text-center mb-6 uppercase border-b-4 border-blue-500 pb-2">Adresse Livraison</h2>
            <form onSubmit={finishOrder} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase">Indiquez votre adresse :</label>
                <textarea className="w-full border-4 border-gray-800 p-2 font-bold h-32" required value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} />
              </div>
              <button className="w-full bg-green-700 text-white py-4 font-black uppercase border-b-8 border-green-900 active:translate-y-1 active:border-b-0">Confirmer la Commande</button>
            </form>
          </div>
        )}

        {/* SUCCÈS */}
        {view === 'success' && (
          <div className="text-center py-16 bg-white border-8 border-gray-800 max-w-lg mx-auto shadow-2xl">
            <h2 className="text-3xl font-black text-green-700 mb-4 uppercase">COMMANDE VALIDÉE</h2>
            <p className="px-10 text-lg font-bold uppercase mb-8 leading-tight">
              Merci pour votre achat chez Yovo Mall.<br/>
              Votre colis sera bientôt livré !
            </p>
            <button onClick={() => setView('home')} className="bg-gray-900 text-white px-10 py-3 font-black uppercase border-b-8 border-black active:translate-y-1 active:border-b-0">Retour Magasin</button>
          </div>
        )}

        {/* ADMIN LOGIN */}
        {view === 'admin-login' && (
          <div className="max-w-xs mx-auto mt-12 bg-white p-8 border-8 border-gray-800">
            <h2 className="text-center font-black mb-6 uppercase border-b-4 border-gray-800 pb-2">Espace Admin</h2>
            <form onSubmit={loginAdmin} className="space-y-4">
              <input type="email" placeholder="Email (admin@gmail.com)" className="w-full border-4 border-gray-800 p-2 font-bold" onChange={e => setAdminEmail(e.target.value)} required />
              <input type="password" placeholder="Code (1234)" className="w-full border-4 border-gray-800 p-2 font-bold" onChange={e => setAdminPass(e.target.value)} required />
              <button className="w-full bg-gray-900 text-white py-3 font-black uppercase border-b-4 border-black">Connexion</button>
            </form>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {view === 'admin-dashboard' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-gray-900 text-white p-4 border-b-8 border-orange-500">
              <h2 className="font-black uppercase tracking-tighter">GESTION YOVO MALL</h2>
              <button onClick={() => setView('home')} className="bg-red-600 px-4 py-1 text-xs font-black uppercase">Quitter</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ajouter */}
              <div className="bg-white p-6 border-8 border-gray-800">
                <h3 className="font-black mb-4 border-b-4 border-gray-800 pb-2 uppercase text-sm">Ajouter un produit</h3>
                <form onSubmit={addProduct} className="space-y-4 text-sm">
                  <input type="text" placeholder="Nom de l'article" className="w-full border-4 border-gray-800 p-2 font-bold" value={newProdName} onChange={e => setNewProdName(e.target.value)} required />
                  <input type="number" placeholder="Prix (F)" className="w-full border-4 border-gray-800 p-2 font-bold" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} required />
                  <div>
                    <input type="text" placeholder="Lien image" className="w-full border-4 border-gray-800 p-2 font-bold mb-2" value={newProdImage} onChange={e => setNewProdImage(e.target.value)} />
                    <div className="p-2 bg-gray-100 border-2 border-dashed border-gray-400 text-center">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="text-xs font-bold" />
                    </div>
                  </div>
                  {newProdImage && <img src={newProdImage} className="h-20 mx-auto border-2 border-gray-800" alt="" />}
                  <button className="w-full bg-blue-700 text-white py-3 font-black uppercase border-b-4 border-blue-950">Enregistrer</button>
                </form>
              </div>

              {/* Inventaire */}
              <div className="bg-white p-6 border-8 border-gray-800 h-96 overflow-auto">
                <h3 className="font-black mb-4 border-b-4 border-gray-800 pb-2 uppercase text-sm">Stock Actuel</h3>
                {products.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b-2 border-gray-100">
                    <div className="flex items-center space-x-2">
                      <img src={p.image} className="w-8 h-8 object-cover border-2 border-gray-800" alt="" />
                      <span className="font-black text-[10px] uppercase truncate w-32">{p.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-red-700">{p.price.toLocaleString()} F</span>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-600 font-black uppercase text-xs">X</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ventes */}
            <div className="bg-white p-6 border-8 border-gray-800 overflow-auto">
              <h3 className="font-black mb-4 border-b-4 border-gray-800 pb-2 uppercase text-sm">Commandes Reçues</h3>
              <table className="w-full text-[10px] text-left">
                <thead className="bg-gray-100 font-black uppercase">
                  <tr>
                    <th className="p-2 border-2 border-gray-800">Date</th>
                    <th className="p-2 border-2 border-gray-800">Client</th>
                    <th className="p-2 border-2 border-gray-800">Adresse</th>
                    <th className="p-2 border-2 border-gray-800">Panier</th>
                    <th className="p-2 border-2 border-gray-800">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="font-bold border-b-2 border-gray-800">
                      <td className="p-2">{o.date}</td>
                      <td className="p-2 uppercase text-blue-700">{o.phoneNumber} ({o.paymentMethod})</td>
                      <td className="p-2 italic">{o.address}</td>
                      <td className="p-2 uppercase">
                        {o.items.map((it, idx) => <span key={idx}>{it.name}, </span>)}
                      </td>
                      <td className="p-2 font-black text-red-700">{o.total.toLocaleString()} F</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-gray-800 text-white p-8 mt-12 text-center text-xs font-black uppercase tracking-widest border-t-8 border-gray-900">
        &copy; 2024 YOVO MALL - BOUTIQUE AUTHENTIQUE DU TOGO
      </footer>
    </div>
  );
}
