import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { setLocale } from "../redux/modules/translations"

export class GlobalContextContainer extends PureComponent {
  componentDidMount() {
    this.props.setLocale("en")
  }

  render() {
    return (
      <React.Fragment>
        <select onChange={e => this.props.setLocale(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
        {this.props.children}
      </React.Fragment>
    )
  }
}

GlobalContextContainer.propTypes = {
  children: PropTypes.node.isRequired,
  setLocale: PropTypes.func,
}

export default connect(null, { setLocale })(GlobalContextContainer)
