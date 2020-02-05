//React
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

//Components
import MyButton from "../util/MyButton";

//MaterialUI
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";

//Redux
import { connect } from "react-redux";
import { getQuack } from "../redux/actions/dataActions";

//Extra Tools
import dayjs from "dayjs";

const styles = {
  separator: {
    border: "none",
    margin: 4
  },
  profileImage: {
    maxWidth: 150,
    maxHeight: 150,
    borderRadius: "50%",
    objectFit: "cover"
  },
  dialogContent: {
    padding: "20px"
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  }
};

class QuackDialog extends Component {
  state = {
    open: false
  };
  handleOpen = () => {
    this.setState({ open: true });
    this.props.getQuack(this.props.quackId);
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const {
      classes,
      quack: {
        quackId,
        body,
        created,
        likeCount,
        commentCount,
        userImage,
        userNN
      },
      UI: { loading }
    } = this.props;
    const dialogMarkup = loading ? (
      <CircularProgress size={100} />
    ) : (
      <Grid container spacing={16}>
        <Grid item sm={5}>
          <img src={userImage} alt="Profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/users/${userNN}`}
          >
            @{userNN}
          </Typography>
          <hr className={classes.separator} />
          <Typography variant="body2" color="textSecondary">
            {dayjs(created).format("h:mm a, MMMM DD YYYY")}
          </Typography>
          <hr className={classes.separator} />
          <Typography variant="body1">{body}</Typography>
        </Grid>
      </Grid>
    );
    return (
      <Fragment>
        <MyButton
          onClick={this.handleOpen}
          tip="Expand Quack"
          tipClassName={classes.expandButton}
        >
          <UnfoldMore color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="Close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

QuackDialog.propTypes = {
  getQuack: PropTypes.func.isRequired,
  quackId: PropTypes.string.isRequired,
  userNN: PropTypes.string.isRequired,
  quack: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  quack: state.data.quack,
  UI: state.UI
});
const mapActionsToProps = {
  getQuack
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(QuackDialog));
