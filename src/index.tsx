import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {AnimatedSwitch} from 'react-router-transition';
import Home from './Pages/Home';
// import registerServiceWorker from './registerServiceWorker';

// import GamePage from './Pages/GamePage';
// registerServiceWorker()

const GamePage = React.lazy(() => import('./Pages/GamePage'));

function App() {
    return (
        <Router>
            <React.Suspense fallback={<div>Loading...</div>}>
                <AnimatedSwitch
                    atEnter={{opacity: 0}}
                    atLeave={{opacity: 0}}
                    atActive={{opacity: 1}}
                    className="switch-wrapper"
                >
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/game" component={GamePage}/>
                </AnimatedSwitch>
            </React.Suspense>
        </Router>
    );
}

const rootElement: HTMLElement = document.getElementById('app');
ReactDOM.render(<App/>, rootElement);