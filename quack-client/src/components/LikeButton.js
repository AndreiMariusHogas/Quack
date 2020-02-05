//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Components
import MyButton from "../util/MyButton";

//Icons
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

//Redux
import { connect } from "react-redux";
import { likeQuack, unlikeQuack } from "../redux/actions/dataActions";

export class LikeButton extends Component {
  likedQuack = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.quackId === this.props.quackId)
    ) {
      return true;
    } else {
      return false;
    }
  };
  likeQuack = () => {
    this.props.likeQuack(this.props.quackId);
  };
  unlikeQuack = () => {
    this.props.unlikeQuack(this.props.quackId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedQuack() ? (
      <MyButton tip="Undo like" onClick={this.unlikeQuack}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeQuack}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  quackId: PropTypes.string.isRequired,
  likeQuack: PropTypes.func.isRequired,
  unlikeQuack: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeQuack,
  unlikeQuack
};

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
