//React
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
//Components
import Quack from "../components/quack/Quack";
import Profile from "../components/profile/Profile";
//Redux
import { connect } from "react-redux";
import { getQuacks } from "../redux/actions/dataActions";

export class home extends Component {
  componentDidMount() {
    this.props.getQuacks();
  }
  render() {
    const { quacks, loading } = this.props.data;
    let recentQuacksMarkup = !loading ? (
      quacks.map(quack => <Quack key={quack.created} quack={quack} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={4}>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
        <Grid item sm={8} xs={12}>
          {recentQuacksMarkup}
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getQuacks: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getQuacks })(home);
