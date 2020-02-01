import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Quack from "../components/Quack";

export class home extends Component {
  state = {
    quacks: null
  };
  componentDidMount() {
    axios
      .get("/quacks")
      .then(res => {
        this.setState({
          quacks: res.data
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    let recentQuacksMarkup = this.state.quacks ? (
      this.state.quacks.map(quack => (
        <Quack key={quack.created} quack={quack} />
      ))
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={8}>
        <Grid item sm={8} xs={12}>
          {recentQuacksMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile..</p>
        </Grid>
      </Grid>
    );
  }
}

export default home;
