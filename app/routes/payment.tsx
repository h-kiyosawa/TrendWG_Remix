import type { Route } from "./+types/payment";

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

      }}
      >
        オフィスコンビニ在庫管理
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
     <div style={{ textAlign: "center" }}>
        <h1 style={{ 
              fontSize: "36px",
              fontFamily: "メイリオ",
              marginTop: "50px",  //縦方向の余白出す
              }}
          >
              支払い選択画面
          </h1>
        <p style={{ 
              fontSize: "32px", 
              fontFamily: "メイリオ" 
              }}
          >
            支払方法を選択してください。
          </p>
      </div>

      {/* ボタンの位置*/}
      <div style={{ 
        display:"flex",
        textAlign: "center",
        justifyContent: "center", // 横方向中央寄せ
        alignItems: "center",     // 縦方向中央寄せ
        gap: "100px",              // ボタン同士の間隔
        height: "500px",          // 親要素の高さを確保（調整可能）

        }}>
      
      
        
        <button
          style={{ 
            backgroundColor: "lightgray",
            color: "black",
            fontSize: "32px",      // 文字サイズを大きく
            padding: "25px 40px",  // ボタンの内側余白を広げる
            display:"flex",       // 画像と文字を横並びに
            marginRight: "20px",   // 右側に余白をつけて距離を離
            fontWeight:"bold",
            borderRadius: "10px",
           }}
          >
            <img
              src=""
              style={{width:"50px", height:"50px"}}
              />
          現金
        </button>
      
        <button
        
          style={{ 
            backgroundColor: "lightgray" ,
            color:"red",
            fontSize: "32px",      // 文字サイズを大きく
            padding: "25px 40px",  // ボタンの内側余白を広げる
            display:"flex",       // 画像と文字を横並びに
            marginRight: "20px",   // 右側に余白をつけて距離を離
            fontWeight:"bold",
            borderRadius: "10px",
            
          }}
          >
            <img
            src=""
            style={{width:"50px", height:"50px"}}
            />
            
          PayPay
        </button>
        </div>
    </div>

    
  );

}


