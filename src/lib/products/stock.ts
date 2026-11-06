/** Recorded inventory, or null when this catalog entry does not track stock. */
export function trackedStock(stockQuantity: number | undefined): number | null {
  if (typeof stockQuantity !== "number" || !Number.isFinite(stockQuantity)) {
    return null;
  }
  return Math.max(0, stockQuantity);
}

export function stockIssue(
  stockQuantity: number | undefined,
  quantity: number,
  name: string,
): string | null {
  const stock = trackedStock(stockQuantity);
  if (stock === null) return null;
  if (stock <= 0) return `${name} is out of stock`;
  if (quantity > stock) return `${name} has only ${stock} left`;
  return null;
}
