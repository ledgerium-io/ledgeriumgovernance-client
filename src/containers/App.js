import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { defaultStartPath } from 'Constants/defaultValues'
import { connect } from "react-redux";
import AppLocale from '../lang';
import MainRoute from 'Routes';
import error from 'Routes/pages/error'
import 'Assets/css/vendor/bootstrap.min.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import io from 'socket.io-client';

import Proposal from "../routes/proposals"
import ProposalDetail from "../routes/proposals/detail"
import ProposalCreate from "../routes/proposals/create"
import NodeList from "../routes/nodes"

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
						<Route path={`/governance/legacy`} exact component={MainRoute} />
							<Route path={`/governance/nodes`} exact component={NodeList} />
							<Route path={`/governance/proposals`} exact component={Proposal} />
							<Route path={`/governance/proposal/create`} exact component={ProposalCreate} />
							<Route path={`/governance/proposal/detail/:slug`} exact component={ProposalDetail} />
							<InitialPath
								path={`${match.url}governance`}
								component={Proposal}
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
