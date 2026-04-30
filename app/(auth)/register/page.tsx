"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Erro ao criar conta.");
    } else {
      toast.success("Conta criada! Faça login.");
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            CALIS<span className="text-brand-yellow">FIT</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">Train Smarter. Move Better.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5"
        >
          <h2 className="text-white font-bold text-xl uppercase">Criar Conta</h2>

          <div className="space-y-1">
            <label className="text-white/60 text-xs uppercase tracking-wide">Nome</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-yellow transition-colors"
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/60 text-xs uppercase tracking-wide">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-yellow transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/60 text-xs uppercase tracking-wide">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-yellow transition-colors"
              placeholder="Min. 6 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-yellow text-brand-black font-black uppercase py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>

          <p className="text-center text-white/40 text-sm">
            Já tem conta?{" "}
            <Link href="/login" className="text-brand-yellow hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
