//React Imports
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Components
import MyButton from "../../util/MyButton";
import DeleteQuack from "./DeleteQuack";
import QuackDialog from "./QuackDialog";
import LikeButton from "./LikeButton";

//Material UI imports
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
//Icons
import ChatIcon from "@material-ui/icons/Chat";

//Extra tools
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//Redux
import { connect } from "react-redux";

const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 16
  },
  image: {
    minWidth: 100,
    minHeight: 100
  },
  content: {
    marginLeft: 10
  }
};

export class Quack extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      quack: {
        body,
        created,
        userImage,
        userNN,
        quackId,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { nickname }
      }
    } = this.props;

    const deleteButton =
      authenticated && userNN === nickname ? (
        <DeleteQuack quackId={quackId} />
      ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userNN}`}
            color="primary"
          >
            {userNN}
          </Typography>
          {deleteButton}
          <Typography variant="body2">{dayjs(created).fromNow()}</Typography>
          <Typography variant="body1">{body}</Typography>
          <LikeButton quackId={quackId} />
          <span>{likeCount} Likes </span>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} Comments</span>
          <QuackDialog quackId={quackId} userNN={userNN} />
        </CardContent>
      </Card>
    );
  }
}

Quack.propTypes = {
  user: PropTypes.object.isRequired,
  quack: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Quack));
