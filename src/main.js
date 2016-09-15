import angular from 'angular';
import app from './app';
import routes from './routes';
import './styles/style.scss';

app.config(routes);

angular.bootstrap( document, [app.name] );
