import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {AnimatedSwitch} from 'react-router-transition';
import Home from './Pages/Home';
import './styles.css';
// import registerServiceWorker from './registerServiceWorker';

import Layout from './Pages/Layout';
import GamePage from './Pages/GamePage';
import Languages from './Pages/Languages';
import Hub from './Pages/Hub';
// registerServiceWorker()

// const GamePage = React.lazy(() => import('./Pages/GamePage'));

class App extends React.Component {
    render(): React.ReactNode {
        return (
            <Router>
                <React.Suspense fallback={<progress/>}>
                    <Layout>
                        <AnimatedSwitch
                            atEnter={{opacity: 0}}
                            atLeave={{opacity: 0}}
                            atActive={{opacity: 1}}
                            className="switch-wrapper w100"
                        >
                            <Route exact path="/" component={Home}/>
                            <Route exact path="/game" component={GamePage}/>
                            <Route exact path="/languages" component={Languages}/>
                            <Route exact path="/hub" component={Hub}/>
                        </AnimatedSwitch>
                    </Layout>
                </React.Suspense>
            </Router>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
