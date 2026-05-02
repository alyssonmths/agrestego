"use client";
 import Link from "next/link";
 import "./perfil-passageiro.css";

export default function PerfilPassageiro(){
    return(
        <div className="perfil-passageiro">
            <header className="header-perfil">
                <div className="logo ">
                    <div className="dot"></div>
                    <h1>AgresteGo</h1>
                </div>
                <nav className="links">
                <Link href={"/"}>Início</Link>
                <Link href={"corridas"}>Corridas</Link>
                <Link href={"perfil"}>Perfil</Link>
                </nav>
            </header>
        </div>
    );
}