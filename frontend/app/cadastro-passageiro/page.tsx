"use client";

export default function CadastroPassageiro() {
const inputStyle = {
  background: "#F1ECE6",
  padding: "16px",
  border: "none",
  borderRadius: "50px",
  marginBottom: "24px",
  fontSize: "16px",
  width: "600px"
};
const labelStyle = {
  fontSize: "14px",
  color: "#777",
  fontWeight: "500",
  marginBottom: "8px"
};
const buttonStyle = {
  background: "#CC6A43",
  color: "white",
  padding: "20px",
  border: "none",
  borderRadius: "50px",
  fontSize: "18px",
  width: "600px",
  fontWeight: "bold",
  cursor: "pointer"
};

  return (
    <main style={{display:"flex",minHeight:"100vh"}}>

        <section style={{display:"flex",
            flexDirection:"column",
            flex:"1",
             background:"#CC6A43",
              color:"white",
              padding:"80px",
              justifyContent: "space-between"}}>
                
            <div>
           <header style={{display:"flex",alignItems:"center", background:"white", gap:"12px", padding:"24px 40px", }}>
            <h1>AgresteGo</h1>
           <span style={{background:"#CC6A43",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            width: "fit-content",
            fontSize:"16px"}}>PARA PASSAGEIROS</span>
             </header>
            </div>
            
            <div>
            <p style={{fontSize: "52px",
            fontWeight: "500",
            lineHeight: "1.1"}}>Chame uma corrida com a confiança de quem é da terra.</p>
            <p style={{marginTop:"32px"}}>Cadastro rápido para começar a viajar com motoristas locais verificados.</p>
            </div>

            <small>
            <p >AGRESTE GO. DAQUI PRA ALI, SEM ARRODEIO.</p>
            </small>
        </section>


        <section style={{display: "flex",flexDirection:"column",flex:"1", background:"#f8f6f2", color:"black", padding:"80px"}}>
         <p style={{alignSelf: "flex-end", fontSize:"14px"}}>← Voltar ao início</p>

        <h2 style={{fontSize: "56px",fontWeight: "500"}}>Cadastro de passageiro</h2>

        <p>Em menos de um minuto você está pronto para a primeira corrida.</p>

        <form style={{display:"flex", flexDirection:"column",marginTop: "40px"}}>
            <label style={labelStyle}>NOME COMPLETO</label>
            <input  style={inputStyle}
             type="text"placeholder="Maria"maxLength={50}/>
            
            <label style={labelStyle}>EMAIL</label>
            <input style={inputStyle} type="email" placeholder="voce@gmail.com" maxLength={50}/>
            
            <label style={labelStyle}>CELULAR(WHATSAPP)</label>
            <input style={inputStyle} type="text" placeholder="(81)90000-0000"maxLength={15}/>
            <label style={labelStyle}>SENHA</label>
            <input style={inputStyle} type="password" placeholder="No mínimo 8 caracteres" minLength={8} maxLength={50}/>
            
            <button style={buttonStyle} type="submit">Criar minha conta</button>

        </form>
        </section>

    </main>
  );
}