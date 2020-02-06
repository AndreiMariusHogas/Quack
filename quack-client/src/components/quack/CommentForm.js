//React
import React, { Component } from "react";
import PropTypes from "prop-types";

//MaterialUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/Textfield";

//Redux
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = {
  textField: {
    margin: "1rem auto 1rem auto"
  },
  visSeparator: {
    width: "100%",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    marginBottom: "20px"
  }
};

export class CommentForm extends Component {
  state = {
    body: "",
    errors: {}
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.erros && !nextProps.UI.loading) {
      this.setState({ body: "" });
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.submitComment(this.props.quackId, { body: this.state.body });
    this.setState({ errors: {} });
  };
  render() {
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;
    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: "center" }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Leave a comment"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Submit
          </Button>
        </form>
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  quackId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});
export default connect(mapStateToProps, { submitComment })(
  withStyles(styles)(CommentForm)
);
