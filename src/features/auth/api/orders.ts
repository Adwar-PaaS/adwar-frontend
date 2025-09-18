// shared order item fields
interface BaseOrderItem {
  sku: string;
  name: string;
  description: string;
  weight: number;
  quantity: number;
  unitPrice: number;
}

// for creating order (no id needed)
export interface CreateOrderItem extends BaseOrderItem {}

// for updating order (requires id)
export interface UpdateOrderItem extends BaseOrderItem {
  id: string;
}

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type OrderStatus =
  | "PENDING"
  | "APPROVED"
  | "ASSIGNED_FOR_PICKUP"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED_TO_ORIGIN";

export interface FailedReason {
  code: string;
  message: string;
}

// create order payload
export interface CreateOrderInput {
  orderNumber: string;
  specialInstructions: string;
  priority: Priority;
  estimatedDelivery: string;
  items: CreateOrderItem[];
}

// update order payload
export interface UpdateOrderInput {
  id: string;
  orderNumber: string;
  specialInstructions: string;
  priority: Priority;
  estimatedDelivery: string;
  status: OrderStatus;
  failedReason?: FailedReason;
  items: UpdateOrderItem[];
}
