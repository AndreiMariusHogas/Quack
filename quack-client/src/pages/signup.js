//React Imports
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppLogo from "../images/quackLogo.png";
import { Link } from "react-router-dom";

//Axios
import axios from "axios";

//MaterialUI imports
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

axios.defaults.baseURL =
  "https://europe-west1-quack-1d8e3.cloudfunctions.net/api";

const styles = {
  form: {
    textAlign: "center"
  },
  image: {
    margin: "1rem auto 0 auto",
    width: "4rem"
  },
  pageTitle: {
    fontSize: "3.5rem"
  },
  button: {
    marginTop: "2rem",
    position: "relative"
  },
  textField: {
    margin: "1rem auto 0 auto"
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    margin: "1rem auto 0 auto"
  },
  progress: {
    position: "absolute"
  }
};

export class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      nickname: "",
      loading: false,
      errors: {}
    };
  }
  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      nickname: this.state.nickname
    };
    axios
      .post("/signup", newUserData)
      .then(res => {
        console.log(res.data);
        localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        this.props.history.push("/");
      })
      .catch(err => {
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loading: false
        });
      });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;
    return (
      <Grid container justify="center" className={classes.form}>
        <Grid item sm={6} xs={12}>
          <img src={AppLogo} alt="quackLogo" className={classes.image} />
          <Typography
            variant="h1"
            className={classes.pageTitle}
            color="primary"
          >
            Signup
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange}
              helperText={errors.email}
              error={errors.email ? true : false}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange}
              helperText={errors.password}
              error={errors.password ? true : false}
              fullWidth
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.textField}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              fullWidth
            />
            <TextField
              id="nickname"
              name="nickname"
              type="nickname"
              label="Nickname"
              className={classes.textField}
              value={this.state.nickname}
              onChange={this.handleChange}
              helperText={errors.nickname}
              error={errors.nickname ? true : false}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Signup
              {loading && (
                <CircularProgress className={classes.progress} size={30} />
              )}
            </Button>
            <br />
            <br />
            <Typography variant="caption" className={classes.signup}>
              Already have an account? Login <Link to="/login"> here </Link>
            </Typography>
          </form>
        </Grid>
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(signup);
