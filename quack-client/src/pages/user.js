//React
import React, { Component } from "react";
import PropTypes from "prop-types";

//Components
import Quack from "../components/quack/Quack";
import StaticProfile from "../components/profile/StaticProfile";

//Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";

//Redux
import { connect } from "react-redux";
import { getUserProfile } from "../redux/actions/dataActions";

//Extra tools
import axios from "axios";

axios.defaults.baseURL =
  "https://europe-west1-quack-1d8e3.cloudfunctions.net/api";

const styles = {};

export class user extends Component {
  state = {
    profile: null,
    quackIdParam: null
  };
  componentDidMount() {
    const nickname = this.props.match.params.nickname;
    const quackId = this.props.match.params.quackId;

    if (quackId) this.setState({ quackIdParam: quackId });
    this.props.getUserProfile(nickname);
    axios
      .get(`/user/${nickname}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    const { quacks, loading } = this.props.data;
    const { quackIdParam } = this.state;
    const quacksMarkup = loading ? (
      <p>Loading data...</p>
    ) : quacks === null ? (
      <p>No posts for this user</p>
    ) : !quackIdParam ? (
      quacks.map(quack => <Quack key={quack.quackId} quack={quack} />)
    ) : (
      quacks.map(quack => {
        if (quack.quackId !== quackIdParam) {
          return <Quack key={quack.quackId} quack={quack} />;
        } else {
          return <Quack key={quack.quackId} quack={quack} openDialog />;
        }
      })
    );
    return (
      <Grid container spacing={4}>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <p> Loading profile...</p>
          ) : (
            <StaticProfile profile={this.state.profile} />
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {quacksMarkup}
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(mapStateToProps, { getUserProfile })(
  withStyles(styles)(user)
);
