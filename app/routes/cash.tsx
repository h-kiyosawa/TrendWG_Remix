import type { Route } from "./+types/cash";

export function meta({}: Route.MetaArgs) {
    return [
    { title: "会社概要 - Remixオフィスコンビニ" },
    { name: "description", content: "私たちについて" },
    ];
}

export default function Payment() {

    return (
        <div>
        {/*画面上部の青いバー */}
        <div
        style={{
            backgroundColor: "#6F9CEF",
            color: "black",
            padding: "30px",
            fontSize: "40px",
            fontWeight: "bold",
            display: "flex", 
            justifyContent: "space-between", // 左右に配置 alignItems: "flex-start",

        }}
        >
        オフィスコンビニ在庫管理
        
        <div style={{ textAlign: "right" }}>
            <input
                type="tyext"
                placeholder="検索..."
                style={{
                backgroundColor: "#FFFFFF",
                padding: "20px 45px",
                borderRadius: "5px",   // 角を丸く
                border: "1px solid #4e4c4cff",
                fontSize: "25px",
            
            
        }}
        />
        </div>
    </div>
    <div style={{ textAlign: "left" }}>
        <h1 style={{ 
            fontSize: "25px",
            fontFamily: "メイリオ",
            
            }}
        >
            支払い選択画面＞現金
        </h1>
        
    </div>
    <div style={{ width: "100%" }}>
        <h1 style={{ 
            fontSize: "50px",
            fontFamily: "メイリオ",
            marginLeft: "150px",
            marginRight: "200px",
            marginTop:"50px",
            padding: "20px",// ← 文字と枠の間に余白
            border: "3px solid black", // ← 黒い線で囲む
            display: "inline-block", // ← 枠を文字サイズに合わせる
            }}
        >
            合計金額○○円
        </h1>
        
    </div>
    <div style={{ width: "100%" }}>
        <h1 style={{ 
            fontSize: "50px",
            fontFamily: "メイリオ",
            marginLeft: "150px",
            marginRight: "200px",
            marginTop:"60px",
            
            }}
        >
            ○○円を貯金箱に入れてください。<br />
            入れ終わったら「終了」ボタンを押してください。
        </h1>
        
    </div>
    <button
        style={{ 
            backgroundColor: "#FF7678", 
            color: "white", 
            fontSize: "50px", 
            padding: "25px 40px", 
            display: "flex", 
            fontWeight: "bold",
            borderRadius: "10px",
            position: "fixed", 
            fontFamily: "メイリオ",
            bottom: "20px", // ← 下から20px
            left: "1800px", // ← 左から20px
            }}
        >
        完了
    </button>
    <button 
        onClick={() => window.history.back()} 
        style={{ position: "fixed", 
        bottom: "20px", 
        left: "20px", 
        padding: "25px 40px", 
        fontSize: "50px", 
        fontWeight: "bold",
        backgroundColor: "#FF7678" , 
        color: "white", 
        fontFamily: "メイリオ",
        borderRadius: "5px",
        }} 
        > 
        戻る 
        </button>
    
</div>
    
);
}