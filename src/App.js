import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from "./components/errors/ErrorFallback";
import { loadActivities } from "./store/actions/activitiesActions";
import { loadRoutine } from "./store/actions/routineActions";
import { loadSession } from "./store/actions/sessionActions";
import { loadHistory } from "./store/actions/historyActions";
import Routine from "./views/Routine";
import AddActivity from "./views/AddActivity";
import EditActivity from "./views/EditActivity";
import Session from "./views/Session";
import History from "./views/History";
import { hideAllMenus } from "./utils/helpers";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation()

  useEffect(() => {
    dispatch(loadActivities())
    dispatch(loadRoutine())
    dispatch(loadSession())
    dispatch(loadHistory())
  }, [dispatch]);
  useEffect(()=>{
    window.removeEventListener("click", hideAllMenus)
    return () =>{
      window.removeEventListener("click", hideAllMenus)
    };
  },[location])

return <>
    <Routes>
      {/*}
      <button onClick={() => { throw Error('BOOM!') }} ></button>
      {*/}
      <Route path="/" element={<Routine />} />
      <Route path="/:routine" element={<Routine />} />
      <Route path="/:routine/:activityIndex" element={<EditActivity />} />
      <Route path="/:routine/add" element={<AddActivity />} />
      <Route path="/:routine/add/:activityId" element={<EditActivity />} />
      <Route path="/:routine/session" element={<Session />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<Routine />} />
    </Routes>
  </>
}






const Wrapped = () => {
  return <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      // Handle error, maybe send it to a logging service
    }}>
    <App />
  </ErrorBoundary>;
}


export default Wrapped;
