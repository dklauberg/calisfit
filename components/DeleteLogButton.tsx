"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DeleteLogButton({ logId }: { logId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    if (!confirm) { setConfirm(true); return; }
    setLoading(true);
    const res = await fetch(`/api/logs/${logId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      toast.success("Treino removido.");
      router.refresh();
    } else {
      toast.error("Erro ao remover treino.");
      setConfirm(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      onBlur={() => setConfirm(false)}
      className={`text-xs font-bold py-1.5 px-3 rounded-xl shrink-0 transition-colors ${
        confirm
          ? "bg-red-500 text-white"
          : "bg-gray-200 text-gray-500 hover:bg-red-100 hover:text-red-500"
      }`}
    >
      {loading ? "..." : confirm ? "Confirmar?" : "Excluir"}
    </button>
  );
}
