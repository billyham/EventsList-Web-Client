import angular from 'angular';
import app from './app';
import routes from './routes';
import './styles/base.scss';
import './styles/layout.scss';
import './styles/module.scss';
import './styles/state.scss';
import './styles/theme.scss';

app.config(routes);

angular.bootstrap( document, [app.name] );
