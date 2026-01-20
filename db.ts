
// Simulation d'un client MongoDB pour le stockage des données
// Dans un vrai projet, ces fonctions feraient des appels fetch() vers un serveur Node.js/MongoDB

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const db = {
  // Collection Produits
  products: {
    async find(): Promise<any[]> {
      await delay(500); // Simule le temps de réponse du serveur
      const data = localStorage.getItem('mongodb_products');
      return data ? JSON.parse(data) : [];
    },
    async insertOne(product: any) {
      await delay(800);
      const products = await this.find();
      products.push(product);
      localStorage.setItem('mongodb_products', JSON.stringify(products));
      return { acknowledged: true };
    },
    async deleteOne(id: number) {
      await delay(500);
      const products = await this.find();
      const filtered = products.filter((p: any) => p.id !== id);
      localStorage.setItem('mongodb_products', JSON.stringify(filtered));
      return { deletedCount: 1 };
    }
  },

  // Collection Commandes
  orders: {
    async find(): Promise<any[]> {
      await delay(500);
      const data = localStorage.getItem('mongodb_orders');
      return data ? JSON.parse(data) : [];
    },
    async insertOne(order: any) {
      await delay(1000);
      const orders = await this.find();
      orders.push(order);
      localStorage.setItem('mongodb_orders', JSON.stringify(orders));
      return { acknowledged: true };
    }
  },

  // Collection Historique de Recherche
  searchHistory: {
    async get(): Promise<string[]> {
      const data = localStorage.getItem('mongodb_search_history');
      return data ? JSON.parse(data) : [];
    },
    async update(history: string[]) {
      localStorage.setItem('mongodb_search_history', JSON.stringify(history));
    }
  }
};
