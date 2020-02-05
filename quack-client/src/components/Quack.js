//React Imports
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Components
import MyButton from "../util/MyButton";
import DeleteQuack from "./DeleteQuack";
import QuackDialog from "./QuackDialog";

//Material UI imports
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
//Icons
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
//Extra tools
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//Redux
import { connect } from "react-redux";
import { likeQuack, unlikeQuack } from "../redux/actions/dataActions";

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
  likedQuack = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        like => like.quackId === this.props.quack.quackId
      )
    ) {
      return true;
    } else {
      return false;
    }
  };
  likeQuack = () => {
    this.props.likeQuack(this.props.quack.quackId);
  };
  unlikeQuack = () => {
    this.props.unlikeQuack(this.props.quack.quackId);
  };
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
    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : this.likedQuack() ? (
      <MyButton tip="Undo like" onClick={this.unlikeQuack}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeQuack}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
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
            to={`/users/{userNN}`}
            color="primary"
          >
            {userNN}
          </Typography>
          {deleteButton}
          <Typography variant="body2">{dayjs(created).fromNow()}</Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
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
  likeQuack: PropTypes.func.isRequired,
  unlikeQuack: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  quack: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});
const mapActionsToProps = {
  likeQuack,
  unlikeQuack
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Quack));
