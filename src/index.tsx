// @ts-ignore
import * as React from 'react';
// @ts-ignore
import * as ReactDOM from 'react-dom';
// @ts-ignore
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import * as serviceWorker from './sw';

import Home from './Pages/Home';
import './assets/css/styles.css';

import GamePage from './Pages/GamePage';
import Languages from './Pages/Languages';
import Hub from './Pages/Hub';

// const GamePage = React.lazy(() => import('./Pages/GamePage'));

// @ts-ignore
class App extends React.Component {
    render(): React.ReactNode {
        return (
            <Router>
                <React.Suspense fallback={<progress/>}>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/languages" component={Languages}/>
                        <Route exact path="/hub" component={Hub}/>
                        <Route exact path="/game" component={GamePage}/>
                    </Switch>
                </React.Suspense>
            </Router>
        );
    }
}

// @ts-ignore
ReactDOM.render(<App/>, document.getElementById('root'));

serviceWorker.unregister();
