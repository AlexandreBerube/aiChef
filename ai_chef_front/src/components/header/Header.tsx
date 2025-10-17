import logo from "@/assets/Logo_AI_Chef.png";
import "@/styles/style.css";

export function Header() {

    return (
        <header>
            <img src={logo} alt="Logo AI Chef" className="header-logo"/>
        </header>
    );
}