import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import Routes from './routers';
import AuthContextProvider from './context/AuthContext';
import { useEffect, useRef } from 'react';

const browserHistory = createBrowserHistory();

function App() {

  // const observedDivRef = useRef(null);
  // const resizingDelayTimer = useRef(null);
  // useEffect(() => {
  //     const observer = new ResizeObserver(() => {
  //       clearTimeout(resizingDelayTimer.current);
  //       resizingDelayTimer.current = setTimeout(() => {
  //         // check if the observed div is still mounted
  //         // else this will cause memory leak   
  //         if (observedDivRef.current) {
  //     //  setMatchingDivWidth(observedDivRef.current.clientWidth)
  //         }
  //       }, 100)
        
  //     });
  //     observer.observe(observedDivRef);
  //   return () => {
  //     if (observer && observedDivRef.current) observer.unobserve(observedDivRef.current);
  //   }
  // }, []);  

  return (
    <AuthContextProvider>
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </AuthContextProvider>
  );
}

export default App;
