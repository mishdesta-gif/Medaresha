"use client";

import * as React from "react";
import { hotelStore } from "@/lib/booking-engine";
import { InventoryItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Boxes, Plus, AlertCircle, TrendingDown, TrendingUp, RefreshCw } from "lucide-react";

export default function AdminInventoryPage() {
  const [items, setItems] = React.useState(() => [...hotelStore.inventory]);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [adjustModalItem, setAdjustModalItem] = React.useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = React.useState("");
  const [adjustType, setAdjustType] = React.useState<"receipt" | "issue">("receipt");
  const [adjustReason, setAdjustReason] = React.useState("");

  // New item form
  const [sku, setSku] = React.useState("");
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<any>("food_beverage");
  const [unitOfMeasure, setUnitOfMeasure] = React.useState("kg");
  const [currentStock, setCurrentStock] = React.useState(20);
  const [reorderThreshold, setReorderThreshold] = React.useState(10);
  const [unitCost, setUnitCost] = React.useState(500);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      property_id: hotelStore.property.id,
      sku,
      name,
      category,
      unit_of_measure: unitOfMeasure,
      current_stock: Number(currentStock),
      reorder_threshold: Number(reorderThreshold),
      unit_cost: Number(unitCost),
    };

    hotelStore.inventory.push(newItem);
    setItems([...hotelStore.inventory]);
    setShowAddModal(false);
    setSku("");
    setName("");
  };

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalItem || !adjustQty) return;

    const qty = Number(adjustQty);
    if (adjustType === "receipt") {
      adjustModalItem.current_stock += qty;
    } else {
      adjustModalItem.current_stock = Math.max(0, adjustModalItem.current_stock - qty);
    }

    setItems([...hotelStore.inventory]);
    setAdjustModalItem(null);
    setAdjustQty("");
    setAdjustReason("");
  };

  const totalValuation = items.reduce((sum, item) => sum + item.current_stock * item.unit_cost, 0);
  const lowStockCount = items.filter((item) => item.current_stock <= item.reorder_threshold).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Supply Chain & Warehousing
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Consumable Stock & Inventory
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Track hotel consumables (Buna beans, toiletries, Sheba linens, cleaning supplies) with auditable stock movements.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          size="sm"
          className="rounded-full text-xs flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Inventory Item
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
          <span className="text-xs uppercase tracking-wider text-meda-muted">Total Stock Valuation</span>
          <div className="font-serif text-2xl font-medium text-olive mt-1">
            {formatCurrency(totalValuation)}
          </div>
          <span className="text-[11px] text-meda-muted mt-1 block">Cost of physical inventory on-hand</span>
        </div>

        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
          <span className="text-xs uppercase tracking-wider text-meda-muted">Active SKUs</span>
          <div className="font-serif text-2xl font-medium text-olive mt-1">{items.length} Items</div>
          <span className="text-[11px] text-meda-muted mt-1 block">Across food, linen, bath, and housekeeping</span>
        </div>

        <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
          <span className="text-xs uppercase tracking-wider text-meda-muted">Low Stock Warnings</span>
          <div className="font-serif text-2xl font-medium text-[#A3322B] mt-1">
            {lowStockCount} {lowStockCount === 1 ? "Item" : "Items"}
          </div>
          <span className="text-[11px] text-meda-muted mt-1 block">Below reorder safety threshold</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs text-meda-text">
          <thead className="border-b border-meda-border bg-[#F5F0E6] text-[10px] font-semibold uppercase tracking-wider text-meda-muted">
            <tr>
              <th className="px-5 py-3.5">SKU</th>
              <th className="px-5 py-3.5">Item Name</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Current Stock</th>
              <th className="px-5 py-3.5">Reorder Level</th>
              <th className="px-5 py-3.5">Unit Cost</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-meda-border/60">
            {items.map((item) => {
              const isLow = item.current_stock <= item.reorder_threshold;

              return (
                <tr key={item.id} className="hover:bg-sand/30 transition-colors">
                  <td className="px-5 py-4 font-mono font-semibold text-olive">{item.sku}</td>
                  <td className="px-5 py-4 font-medium text-meda-text">{item.name}</td>
                  <td className="px-5 py-4 uppercase text-meda-muted">{item.category.replace("_", " ")}</td>
                  <td className="px-5 py-4 font-semibold text-sm">
                    {item.current_stock} {item.unit_of_measure}
                  </td>
                  <td className="px-5 py-4 text-meda-muted">
                    {item.reorder_threshold} {item.unit_of_measure}
                  </td>
                  <td className="px-5 py-4">{formatCurrency(item.unit_cost)}</td>
                  <td className="px-5 py-4">
                    {isLow ? (
                      <Badge variant="dirty" className="flex items-center gap-1 w-fit">
                        <AlertCircle className="h-3 w-3" />
                        Reorder Required
                      </Badge>
                    ) : (
                      <Badge variant="clean">Optimal</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      onClick={() => setAdjustModalItem(item)}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-3"
                    >
                      Stock Movement
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Movement Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-meda-border bg-[#FDFBF7] p-6 shadow-modal space-y-4">
            <h3 className="font-serif text-2xl text-olive">Record Stock Movement</h3>
            <p className="text-xs text-meda-muted">
              {adjustModalItem.name} ({adjustModalItem.sku}) • Current Stock: {adjustModalItem.current_stock} {adjustModalItem.unit_of_measure}
            </p>

            <form onSubmit={handleAdjustStock} className="space-y-3">
              <div>
                <label className="block text-xs text-meda-muted mb-1">Movement Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full rounded-xl border border-meda-border bg-ivory p-2.5 text-xs text-meda-text"
                >
                  <option value="receipt">Stock Receipt (Supplier delivery / Purchase)</option>
                  <option value="issue">Stock Issue (Consumption to Housekeeping / Kitchen)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-meda-muted mb-1">Quantity ({adjustModalItem.unit_of_measure})</label>
                <Input
                  type="number"
                  required
                  placeholder="e.g. 10"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-meda-muted mb-1">Audit Reason / Note</label>
                <Input
                  required
                  placeholder="e.g. Received PO-8812 from Sidama Highland Roasters"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-3">
                <Button type="submit" variant="primary" size="sm" className="flex-1 rounded-full">
                  Commit Movement
                </Button>
                <Button
                  type="button"
                  onClick={() => setAdjustModalItem(null)}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
