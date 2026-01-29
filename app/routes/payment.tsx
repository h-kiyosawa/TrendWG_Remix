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
      {/*画面上部のオレンジのバー */}
      <div
      style={{
        backgroundColor: "#FF7835",
        color: "white",
        padding: "30px",
        fontSize: "40px",
        fontWeight: "bold",
        display: "flex", 
        flexDirection: "column",
        alignItems: "flex-start" // 左右に配置 

        }}
      >
        <div style={{ width: "100%", 
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",}}>
          
          <div style={{fontSize: "40px"}}>
            Remixオフィスコンビニ
          </div>
          <input
              type="text"
              placeholder="検索..."
              style={{
                backgroundColor: "#fcf8f8ff",
                padding: "20px 45px",
                borderRadius: "5px",   // 角を丸く
                border: "1px solid #f7f2f2ff",
                fontSize: "25px",
              }}
          
            />
        </div>
      
        <div style={{fontSize: "20px",marginTop: "10px"}}>
        支払い選択
        </div>
      </div>
    
      
      <p 
      style={{ 
        fontSize: "35px", 
        fontFamily: "メイリオ" 
      }}>
      支払方法を選択してください。
    </p>
    

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
            backgroundColor: "#EDEDED",
            color: "black",
            fontSize: "55px",      // 文字サイズを大きく
            padding: "25px 40px",  // ボタンの内側余白を広げる
            display:"flex",       // 画像と文字を横並びに
            marginRight: "20px",   // 右側に余白をつけて距離を離
            fontWeight:"bold",
            borderRadius: "10px",
          }}
          >
            
          現金
        </button>
      
        <button
        
          style={{ 
            backgroundColor: "#EDEDED" ,
            color:"red",
            fontSize: "55px",      // 文字サイズを大きく
            padding: "25px 40px",  // ボタンの内側余白を広げる
            display:"flex",       // 画像と文字を横並びに
            marginRight: "20px",   // 右側に余白をつけて距離を離
            fontWeight:"bold",
            borderRadius: "10px",
            
          }}
          >
          
            
          PayPay
        </button>
        </div>
        <button 
          onClick={() => window.history.back()} 
            style={{ position: "fixed", 
            bottom: "20px", 
            left: "20px", 
            padding: "5px 90px", 
            fontSize: "35px", 
            backgroundColor: "#FF7835" , 
            color: "white", 
            fontFamily: "メイリオ",
            
          }} 
        > 
          戻る 
        </button>
        
        
    </div>
  
    
        
    
  );
  

}


