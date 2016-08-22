import angular from 'angular';
import app from './app';
import routes from './routes';
import './css/main.css';

app.config(routes);

angular.bootstrap( document, [app.name] );
