import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';

import TopNav from 'Containers/TopNav'
import Sidebar from 'Containers/Sidebar';

import governance from './governance';

import { connect } from 'react-redux';

class MainApp extends Component {
	render() {
		const { match, containerClassnames } = this.props;
		return (
			<div id="app-container" className={containerClassnames}>
				<TopNav history={this.props.history} />
				<Sidebar />
				<main>
					<div className="container-fluid">
						<Switch>

							<Route path={`${match.url}/`} exact component={governance} />
							<Redirect to="/governance" />
						</Switch>
					</div>
				</main>
			</div>
		);
	}
}
const mapStateToProps = ({ menu }) => {
	const { containerClassnames } = menu;
	return { containerClassnames };
}

export default withRouter(connect(mapStateToProps, {})(MainApp));
