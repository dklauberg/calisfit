import BottomNav from "@/components/BottomNav";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-brand-black z-30 px-4 py-4">
        <h1 className="text-white font-black uppercase text-xl tracking-tight">
          CALIS<span className="text-brand-yellow">FIT</span>
        </h1>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="font-black uppercase text-2xl tracking-tight text-brand-black mb-4">Community</h2>
        <div className="card-black rounded-2xl p-8 text-center">
          <p className="text-white/50 text-sm">Em breve — fase 4</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
