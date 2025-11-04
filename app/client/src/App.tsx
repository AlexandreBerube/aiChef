import {Header} from "@/components/header/Header.tsx";
import {Footer} from "@/components/footer/Footer.tsx";
import './styles/style.css';
import {Home} from "./components/home/Home.tsx";

function App() {


    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <div>
                <Home/>
            </div>
            <Footer/>
        </div>
    )
}

export default App