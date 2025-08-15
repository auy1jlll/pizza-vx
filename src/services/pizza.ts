import { BaseService } from './base';
import { ToppingCategory } from '@prisma/client';

export interface PizzaComponent {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
}

export interface PizzaSize extends PizzaComponent {
  diameter: string;
  basePrice: number;
  description?: string;
}

export interface PizzaCrust extends PizzaComponent {
  description?: string;
  priceModifier: number;
}

export interface PizzaSauce extends PizzaComponent {
  description?: string;
  color?: string;
  spiceLevel: number;
  priceModifier: number;
}

export interface PizzaTopping extends PizzaComponent {
  description?: string;
  category: ToppingCategory;
  price: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
}

export class PizzaService extends BaseService {
  
  // Get all pizza components for the builder
  async getPizzaBuilderData() {
    try {
      const [sizes, crusts, sauces, toppings] = await Promise.all([
        this.db.pizzaSize.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }),
        this.db.pizzaCrust.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }),
        this.db.pizzaSauce.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }),
        this.db.pizzaTopping.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        })
      ]);

      return {
        sizes,
        crusts,
        sauces,
        toppings
      };
    } catch (error) {
      this.handleError(error, 'Get Pizza Builder Data');
    }
  }

  // Sizes management
  async getSizes(includeInactive = false) {
    try {
      const where = includeInactive ? {} : { isActive: true };
      return await this.db.pizzaSize.findMany({
        where,
        orderBy: { sortOrder: 'asc' }
      });
    } catch (error) {
      this.handleError(error, 'Get Sizes');
    }
  }

  async createSize(sizeData: Omit<PizzaSize, 'id'>) {
    try {
      return await this.db.pizzaSize.create({
        data: sizeData
      });
    } catch (error) {
      this.handleError(error, 'Create Size');
    }
  }

  async updateSize(id: string, updates: Partial<Omit<PizzaSize, 'id'>>) {
    try {
      return await this.db.pizzaSize.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      this.handleError(error, 'Update Size');
    }
  }

  async deleteSize(id: string) {
    try {
      return await this.db.pizzaSize.delete({
        where: { id }
      });
    } catch (error) {
      this.handleError(error, 'Delete Size');
    }
  }

  // Crusts management
  async getCrusts(includeInactive = false) {
    try {
      const where = includeInactive ? {} : { isActive: true };
      return await this.db.pizzaCrust.findMany({
        where,
        orderBy: { sortOrder: 'asc' }
      });
    } catch (error) {
      this.handleError(error, 'Get Crusts');
    }
  }

  async createCrust(crustData: Omit<PizzaCrust, 'id'>) {
    try {
      return await this.db.pizzaCrust.create({
        data: crustData
      });
    } catch (error) {
      this.handleError(error, 'Create Crust');
    }
  }

  async updateCrust(id: string, updates: Partial<Omit<PizzaCrust, 'id'>>) {
    try {
      return await this.db.pizzaCrust.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      this.handleError(error, 'Update Crust');
    }
  }

  // Sauces management
  async getSauces(includeInactive = false) {
    try {
      const where = includeInactive ? {} : { isActive: true };
      return await this.db.pizzaSauce.findMany({
        where,
        orderBy: { sortOrder: 'asc' }
      });
    } catch (error) {
      this.handleError(error, 'Get Sauces');
    }
  }

  async createSauce(sauceData: Omit<PizzaSauce, 'id'>) {
    try {
      return await this.db.pizzaSauce.create({
        data: sauceData
      });
    } catch (error) {
      this.handleError(error, 'Create Sauce');
    }
  }

  async updateSauce(id: string, updates: Partial<Omit<PizzaSauce, 'id'>>) {
    try {
      return await this.db.pizzaSauce.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      this.handleError(error, 'Update Sauce');
    }
  }

  // Toppings management
  async getToppings(includeInactive = false) {
    try {
      const where = includeInactive ? {} : { isActive: true };
      return await this.db.pizzaTopping.findMany({
        where,
        orderBy: { sortOrder: 'asc' }
      });
    } catch (error) {
      this.handleError(error, 'Get Toppings');
    }
  }

  async getToppingsByCategory(category?: string) {
    try {
      const where: any = { isActive: true };
      if (category) {
        where.category = category;
      }
      
      return await this.db.pizzaTopping.findMany({
        where,
        orderBy: { sortOrder: 'asc' }
      });
    } catch (error) {
      this.handleError(error, 'Get Toppings by Category');
    }
  }

  async createTopping(toppingData: Omit<PizzaTopping, 'id'>) {
    try {
      return await this.db.pizzaTopping.create({
        data: toppingData
      });
    } catch (error) {
      this.handleError(error, 'Create Topping');
    }
  }

  async updateTopping(id: string, updates: Partial<Omit<PizzaTopping, 'id'>>) {
    try {
      return await this.db.pizzaTopping.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      this.handleError(error, 'Update Topping');
    }
  }

  async deleteTopping(id: string) {
    try {
      return await this.db.pizzaTopping.delete({
        where: { id }
      });
    } catch (error) {
      this.handleError(error, 'Delete Topping');
    }
  }

  // Specialty pizzas
  async getSpecialtyPizzas(includeInactive = false) {
    try {
      const where = includeInactive ? {} : { isActive: true };
      return await this.db.specialtyPizza.findMany({
        where,
        include: {
          sizes: {
            include: {
              pizzaSize: true
            }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });
    } catch (error) {
      this.handleError(error, 'Get Specialty Pizzas');
    }
  }

  async getSpecialtyPizza(id: string) {
    try {
      return await this.db.specialtyPizza.findUnique({
        where: { id },
        include: {
          sizes: {
            include: {
              pizzaSize: true
            }
          }
        }
      });
    } catch (error) {
      this.handleError(error, 'Get Specialty Pizza');
    }
  }

  // Calculate pizza price based on components
  async calculatePizzaPrice(sizeId: string, crustId: string, sauceId: string, toppingIds: string[] = []) {
    try {
      const [size, crust, sauce, toppings] = await Promise.all([
        this.db.pizzaSize.findUnique({ where: { id: sizeId } }),
        this.db.pizzaCrust.findUnique({ where: { id: crustId } }),
        this.db.pizzaSauce.findUnique({ where: { id: sauceId } }),
        toppingIds.length > 0 
          ? this.db.pizzaTopping.findMany({ where: { id: { in: toppingIds } } })
          : []
      ]);

      if (!size || !crust || !sauce) {
        throw new Error('Invalid pizza components');
      }

      const basePrice = size.basePrice;
      const crustModifier = crust.priceModifier;
      const sauceModifier = sauce.priceModifier;
      const toppingsTotal = toppings.length > 0 
        ? toppings.map(t => t.price).reduce((sum, price) => sum + price, 0)
        : 0;

      const totalPrice = basePrice + crustModifier + sauceModifier + toppingsTotal;

      return {
        basePrice,
        crustModifier,
        sauceModifier,
        toppingsTotal,
        totalPrice: +totalPrice.toFixed(2)
      };
    } catch (error) {
      this.handleError(error, 'Calculate Pizza Price');
    }
  }
}
