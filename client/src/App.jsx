import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import DetailsPage from './pages/DetailsPage';
import './styles/main.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/results" component={ResultsPage} />
        <Route path="/details/:id" component={DetailsPage} />
      </Switch>
    </Router>
  );
};

export default App;