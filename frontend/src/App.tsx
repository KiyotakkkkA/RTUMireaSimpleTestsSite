import { BrowserRouter } from "react-router-dom";
import { useEffect, useMemo } from "react";

import { Footer, Header } from "./components/layouts";
import { Router } from "./router";
import { authStore } from "./stores/authStore";

function App() {
    useEffect(() => {
        authStore.init();
    }, []);

    const router = useMemo(() => new Router(), []);

    return (
        <BrowserRouter>
            <div className="min-h-screen overflow-auto bg-slate-100 flex flex-col">
                <Header />
                {router.build()}
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
