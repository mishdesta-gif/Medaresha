"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Receipt, Plus, Download } from "lucide-react";

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = React.useState([
    {
      id: "exp-1",
      category: "supplies",
      title: "Sidama Roast Coffee Beans (50kg)",
      amount: 42500,
      currency: "ETB",
      expense_date: "2026-10-20",
      paid_to: "Sidama Highland Roasters PLC",
      receipt_reference: "INV-SHR-9921",
    },
    {
      id: "exp-2",
      category: "utilities",
      title: "Ethiopian Electric Power (EEP) Commercial Grid",
      amount: 18450,
      currency: "ETB",
      expense_date: "2026-10-15",
      paid_to: "EEP Bole Branch",
      receipt_reference: "EEP-REC-8841",
    },
    {
      id: "exp-3",
      category: "maintenance",
      title: "Elevator Inspection & Hydraulic Service",
      amount: 14000,
      currency: "ETB",
      expense_date: "2026-10-12",
      paid_to: "Otis East Africa PLC",
      receipt_reference: "SRV-OTIS-104",
    },
  ]);

  const [showAdd, setShowAdd] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [paidTo, setPaidTo] = React.useState("");
  const [category, setCategory] = React.useState("supplies");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    expenses.unshift({
      id: `exp-${Date.now()}`,
      category,
      title,
      amount: Number(amount),
      currency: "ETB",
      expense_date: new Date().toISOString().split("T")[0],
      paid_to: paidTo,
      receipt_reference: `REC-${Date.now().toString().slice(-4)}`,
    });
    setExpenses([...expenses]);
    setShowAdd(false);
    setTitle("");
    setAmount("");
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meda-border pb-5">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-botanical font-medium">
            Financial Management
          </span>
          <h1 className="font-serif text-3xl font-medium text-meda-text">
            Operational Expenses & Disbursements
          </h1>
          <p className="text-xs text-meda-muted mt-1">
            Track hotel operating expenses, utility payments, and vendor settlements.
          </p>
        </div>

        <Button
          onClick={() => setShowAdd(true)}
          variant="primary"
          size="sm"
          className="rounded-full text-xs flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Record Expense
        </Button>
      </div>

      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] p-5 shadow-subtle">
        <span className="text-xs uppercase tracking-wider text-meda-muted">Total Recorded Expenses</span>
        <div className="font-serif text-3xl font-medium text-[#A3322B] mt-1">
          {formatCurrency(totalExpenses)}
        </div>
      </div>

      <div className="rounded-2xl border border-meda-border bg-[#FAF7F2] overflow-hidden shadow-subtle">
        <table className="w-full text-left text-xs text-meda-text">
          <thead className="border-b border-meda-border bg-[#F5F0E6] text-[10px] font-semibold uppercase tracking-wider text-meda-muted">
            <tr>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5">Expense Item</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Vendor / Payee</th>
              <th className="px-5 py-3.5">Receipt #</th>
              <th className="px-5 py-3.5 text-right">Amount (ETB)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-meda-border/60">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-sand/30 transition-colors">
                <td className="px-5 py-4 text-meda-muted">{exp.expense_date}</td>
                <td className="px-5 py-4 font-medium text-meda-text">{exp.title}</td>
                <td className="px-5 py-4 uppercase text-meda-muted">{exp.category}</td>
                <td className="px-5 py-4">{exp.paid_to}</td>
                <td className="px-5 py-4 font-mono text-meda-muted">{exp.receipt_reference}</td>
                <td className="px-5 py-4 text-right font-serif text-sm font-medium text-[#A3322B]">
                  -{formatCurrency(exp.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-meda-border bg-[#FDFBF7] p-6 shadow-modal space-y-4">
            <h3 className="font-serif text-2xl text-olive">Record Expense</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs text-meda-muted mb-1">Expense Title</label>
                <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-meda-muted mb-1">Amount (ETB)</label>
                <Input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-meda-muted mb-1">Payee / Vendor</label>
                <Input required value={paidTo} onChange={(e) => setPaidTo(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-meda-muted mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-meda-border bg-ivory p-2.5 text-xs text-meda-text"
                >
                  <option value="supplies">Supplies & Consumables</option>
                  <option value="utilities">Utilities & Energy</option>
                  <option value="maintenance">Maintenance & Repairs</option>
                  <option value="payroll">Staff Payroll</option>
                  <option value="marketing">Marketing & Digital</option>
                </select>
              </div>
              <div className="flex gap-2 pt-3">
                <Button type="submit" variant="primary" size="sm" className="flex-1 rounded-full">
                  Save Expense
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAdd(false)}
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
