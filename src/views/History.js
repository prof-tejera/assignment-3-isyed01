import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HistoryList from "../components/history/HistoryList";
import '../components/history/history.css'
const History = () => {
    const header = useRef(null)
    const body = useRef(null)
    const navigate = useNavigate();
    const handleBack = () => navigate('/')

    useEffect(() => {
        const headerEl = header.current;
        const bodyEl = body.current;
        const scrollHandler = () => bodyEl.scrollTop > 1 ?
             headerEl.classList.add("is-scrolling") : 
             headerEl.classList.remove("is-scrolling");
        bodyEl.addEventListener("scroll", scrollHandler);
        return () => bodyEl.removeEventListener("scroll", scrollHandler);
    }, []);

    return <>
        <header ref={header}>
            <div  className='top-app-bar' style={{ width:'100%' }}>
            <div>
                <button className="icon-button" onClick={handleBack}>
                    <i className="icon material-symbols-outlined">arrow_back</i>
                </button>
            </div>
            <div className='top-app-bar-headline' style={{ alignSelf: 'center' }}>
                History
            </div>
            </div>
        </header>
        <main ref={body}>
            <div className='container'>
                <HistoryList />
            </div>
        </main>
    </>
}

export default History;