//React
import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import MyButton from "../../util/MyButton";
//Material UI imports
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
//Material Icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";
//Redux
import { connect } from "react-redux";
import { deleteQuack } from "../../redux/actions/dataActions";

const styles = {
  warning: {
    color: "red",
    margin: "0 1rem 0 2rem"
  },
  deleteButton: {
    position: "absolute",
    top: "5%",
    left: "90%"
  }
};

export class DeleteQuack extends Component {
  state = {
    open: false
  };
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  deleteQuack = () => {
    this.props.deleteQuack(this.props.quackId);
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Delete Quack"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color="secondary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Are you sure you want to delete this quack?</DialogTitle>
          <small className={classes.warning}>
            {" "}
            This action is not reversibile{" "}
          </small>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteQuack} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DeleteQuack.propTypes = {
  deleteQuack: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  quackId: PropTypes.string.isRequired
};
export default connect(null, { deleteQuack })(withStyles(styles)(DeleteQuack));
