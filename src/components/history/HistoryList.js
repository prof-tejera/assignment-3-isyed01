import { useSelector } from "react-redux";
import HistoryCard from "./HistoryCard";

const HistoryList = () => {
    const state = useSelector((state) => state.history.items);

    return <ul className='reorderable no-border card-list-gap-8'>
        {
            state.map((item, index) =>
                <li key={index}>
                    <HistoryCard {...item} />
                </li>
            )
        }
    </ul>
}




export default HistoryList;