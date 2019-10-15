import React, { Component } from "react";
import { injectIntl} from 'react-intl';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Input,
  Button
} from "reactstrap";
import IntlMessages from "Util/IntlMessages";

import PerfectScrollbar from "react-perfect-scrollbar";

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  setContainerClassnames,
  changeLocale
} from "Redux/actions";

import { menuHiddenBreakpoint, searchPath,localeOptions } from "Constants/defaultValues";

import notifications from "Data/topnav.notifications.json";
import Search from 'Components/Search'

class TopNav extends Component {
  constructor(props) {
    super(props);
  }

  handleChangeLocale = locale => {
    this.props.changeLocale(locale);
  };


  render() {
    const { containerClassnames, menuClickCount, locale } = this.props;
    const {messages} = this.props.intl;
    return (
      <nav className="navbar fixed-top">
        <NavLink
          to="#"
          className="menu-button d-none d-md-block"
        >

        </NavLink>
        <NavLink
          to="#"
          className="menu-button-mobile d-xs-block d-sm-block d-md-none"
        >
        </NavLink>




        <a className="navbar-logo" href="/blockexplorer">
        <img alt="Logo" width="75px" src="/assets/img/Ledgerium_logo_blue.svg" />
        </a>

        <div className="ml-auto">
          <div className="header-icons d-inline-block align-middle">
            <div className="search" data-search-path="/app/pages/search">
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({ menu, settings }) => {
  const { containerClassnames,} = menu;
  const { locale } = settings;
  return { containerClassnames, locale };
};
export default injectIntl(connect(
  mapStateToProps,
  { setContainerClassnames, changeLocale }
)(TopNav));
