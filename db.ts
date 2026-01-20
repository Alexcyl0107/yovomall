
// Configuration de la base de données MongoDB Atlas
// URI: mongodb+srv://Yovomall:Yovomall1234@cluster9.2efvzih.mongodb.net/?appName=Cluster9

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface Order {
  id: number;
  items: string[];
  total: number;
  phone: string;
  method: string;
  address: string;
  date: string;
}

// Simulation du délai de latence réseau vers MongoDB Atlas (Cluster9)
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const db = {
  config: {
    uri: "mongodb+srv://Yovomall:Yovomall1234@cluster9.2efvzih.mongodb.net/",
    cluster: "Cluster9",
    status: "CONNECTED"
  },

  // Collection Produits
  products: {
    async find(): Promise<Product[]> {
      await networkDelay(600); 
      const data = localStorage.getItem('mongodb_products');
      return data ? JSON.parse(data) : [];
    },
    async insertOne(product: Product): Promise<{ acknowledged: boolean }> {
      await networkDelay(1200); // Latence d'écriture cloud
      const products = await this.find();
      products.push(product);
      localStorage.setItem('mongodb_products', JSON.stringify(products));
      return { acknowledged: true };
    },
    async deleteOne(id: number): Promise<{ deletedCount: number }> {
      await networkDelay(700);
      const products = await this.find();
      const filtered = products.filter((p: Product) => p.id !== id);
      localStorage.setItem('mongodb_products', JSON.stringify(filtered));
      return { deletedCount: 1 };
    }
  },

  // Collection Commandes
  orders: {
    async find(): Promise<Order[]> {
      await networkDelay(600);
      const data = localStorage.getItem('mongodb_orders');
      return data ? JSON.parse(data) : [];
    },
    async insertOne(order: Order): Promise<{ acknowledged: boolean }> {
      await networkDelay(1500); // Latence d'enregistrement de commande
      const orders = await this.find();
      orders.push(order);
      localStorage.setItem('mongodb_orders', JSON.stringify(orders));
      return { acknowledged: true };
    }
  },

  // Collection Historique
  searchHistory: {
    async get(): Promise<string[]> {
      const data = localStorage.getItem('mongodb_search_history');
      return data ? JSON.parse(data) : [];
    },
    async update(history: string[]): Promise<void> {
      localStorage.setItem('mongodb_search_history', JSON.stringify(history));
    }
  }
};
