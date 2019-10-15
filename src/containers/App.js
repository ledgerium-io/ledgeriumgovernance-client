import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { defaultStartPath} from 'Constants/defaultValues'
import { connect } from "react-redux";
import AppLocale from '../lang';
import MainRoute from 'Routes';
import error from 'Routes/pages/error'
import 'Assets/css/vendor/bootstrap.min.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import io from 'socket.io-client';



const InitialPath = ({ component: Component, authUser, ...rest }) =>
	<Route
		{...rest}
		render={props =>
			authUser
				? <Component {...props} />
				: <Component {...props} />}
	/>;

class App extends Component {
	render() {
		const { location, match, user, locale } = this.props;
		const currentAppLocale = AppLocale[locale];
		if (location.pathname === '/' || location.pathname === '/app' || location.pathname === '/app/') {
			return (<Redirect to={defaultStartPath} />);
		}
		return (
			<Fragment>
				<IntlProvider
					locale={currentAppLocale.locale}
					messages={currentAppLocale.messages}
				>

					<Fragment>
						<Switch>
							<InitialPath
								path={`${match.url}governance`}
								authUser={user}
								component={MainRoute}
							/>
							<Redirect to="/error" />
						</Switch>
					</Fragment>
				</IntlProvider>
			</Fragment>
		);
	}
}

const mapStateToProps = ({ authUser, settings }) => {
	const { user } = authUser;
	const { locale } = settings;
	return { user, locale };
};

export default connect(mapStateToProps, {})(App);
