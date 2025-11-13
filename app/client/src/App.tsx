// App.tsx
import {Header} from "@/components/header/Header.tsx";
import {Footer} from "@/components/footer/Footer.tsx";
import {Home} from "./components/home/Home.tsx";
import "./styles/style.css";

function App() {
    return (
        <div className="app-layout">
            <div className="app-header">
                <Header />
            </div>
                <Home />
            <div className="app-footer">
                <Footer />
            </div>
        </div>
    );
}

export default App;
