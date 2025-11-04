import logo from "@/assets/Logo_AI_Chef.png";
import "@/styles/style.css";

export function Header() {

    return (
        <div className="inline-flex flex-col">
            <header>
                <img src={logo} alt="Logo AI Chef" className="header-logo"/>
            </header>
        </div>
    );
}