import type { Route } from "./+types/payment";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "会社概要 - Remixオフィスコンビニ" },
    { name: "description", content: "私たちについて" },
  ];
}

export default function Payment() {
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-orange-500 dark:bg-orange-600 shadow-sm border-b border-orange-600 dark:border-orange-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Remixオフィスコンビニ
                            </h1>
                            <p className="text-sm text-orange-100 dark:text-orange-200 mt-1">
                                支払い方法を選択してください
                            </p>
                        </div>
                        <a
                            href="/"
                            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
                        >
                            ← トップに戻る
                        </a>
                        <form
                            role="search"
                            aria-label="商品検索"
                            className="relative w-48 sm:w-64"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const q = new FormData(e.currentTarget).get('q')?.toString().trim();
                                if (!q) return;
                                console.log('search:', q);
                            }}
                        >
                            <input
                                type="search"
                                name="q"
                                placeholder="商品名で検索"
                                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/20 placeholder-white/70 text-white
                focus:outline-none focus:ring-2 focus:ring-white/70 focus:bg-white/25
                transition-colors text-sm"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/80"
                            >
                                🔍
                            </span>
                        </form>
                    </div>
                </div>
            </header>
    
      
      
    

        <div className=" flex text-center justify-center items-center gap-[100px] h-[500px] ">
      
        <button className=" bg-[#EDEDED] text-black text-[30px] py-[25px] px-[40px] flex mr-[20px] font-bold font-medium rounded-lg " > 🪙現金 </button>
      
        <button className=" bg-[#EDEDED] text-black text-[30px] py-[25px] px-[40px] flex mr-[20px] font-bold font-medium rounded-lg " > 📱PayPay</button>
        <button onClick={() => window.history.back()} className=" fixed bottom-[20px] left-[50px] py-[5px] px-[50px] text-[35px] bg-[#FF7835] text-white font-medium rounded-lg " > 戻る </button>
        <div className=" fixed top-25 right-15 bg-white text-black border border-black rounded-lg px-4 py-2 text-[25px] font-bold font-medium shadow " > 合計 1,200円 </div>
        
        
    </div>
  </div>
  )
}
  
    
        
    
  
  




