//React Imports
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppLogo from "../images/quackLogo.png";
import { Link } from "react-router-dom";

//MaterialUI imports
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//Redux
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

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

export class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = event => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const {
      classes,
      UI: { loading }
    } = this.props;
    const { errors } = this.state;
    return (
      <Grid container justify="center" className={classes.form}>
        <Grid item sm={6} xs={12}>
          <img src={AppLogo} alt="quackLogo" className={classes.image} />
          <Typography
            variant="h1"
            className={classes.pageTitle}
            color="primary"
          >
            Login
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
              Login
              {loading && (
                <CircularProgress className={classes.progress} size={30} />
              )}
            </Button>
            <br />
            <br />
            <Typography variant="caption" className={classes.signup}>
              Don't have an account? Sign up <Link to="/signup"> here </Link>
            </Typography>
          </form>
        </Grid>
      </Grid>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});
const mapActionsToProps = {
  loginUser
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(login));
