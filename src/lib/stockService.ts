import { Product, ProductVariant, OrderItem } from '../types';

export interface StockValidationResult {
  valid: boolean;
  unavailableItem?: {
    productName: string;
    size: string;
    color: string;
    requestedQty: number;
    availableQty: number;
  };
}

/**
 * Validates stock availability across all requested order items
 */
export function validateOrderStock(
  products: Product[],
  items: Array<{ productId: string; variantId: string; quantity: number }>
): StockValidationResult {
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return {
        valid: false,
        unavailableItem: {
          productName: 'Unknown Product',
          size: '',
          color: '',
          requestedQty: item.quantity,
          availableQty: 0,
        },
      };
    }

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant || variant.stock < item.quantity) {
      return {
        valid: false,
        unavailableItem: {
          productName: product.name,
          size: variant?.size || '',
          color: variant?.color || '',
          requestedQty: item.quantity,
          availableQty: variant?.stock || 0,
        },
      };
    }
  }

  return { valid: true };
}

/**
 * Decreases stock atomically when order is confirmed
 */
export function decrementStock(
  products: Product[],
  items: Array<{ productId: string; variantId: string; quantity: number }>
): Product[] {
  return products.map((product) => {
    const matchedItems = items.filter((i) => i.productId === product.id);
    if (matchedItems.length === 0) return product;

    const updatedVariants = product.variants.map((v) => {
      const match = matchedItems.find((i) => i.variantId === v.id);
      if (match) {
        return { ...v, stock: Math.max(0, v.stock - match.quantity) };
      }
      return v;
    });

    const newTotalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);

    return {
      ...product,
      variants: updatedVariants,
      totalStock: newTotalStock,
    };
  });
}

/**
 * Restores stock when order is cancelled or refunded
 */
export function restoreStock(products: Product[], orderItems: OrderItem[]): Product[] {
  return products.map((product) => {
    const matchedOrderItems = orderItems.filter((i) => i.productId === product.id);
    if (matchedOrderItems.length === 0) return product;

    const updatedVariants = product.variants.map((v) => {
      const match = matchedOrderItems.find((i) => i.variantSku === v.sku || i.size === v.size);
      if (match) {
        return { ...v, stock: v.stock + match.quantity };
      }
      return v;
    });

    const newTotalStock = updatedVariants.reduce((sum, v) => sum + v.stock, 0);

    return {
      ...product,
      variants: updatedVariants,
      totalStock: newTotalStock,
    };
  });
}
