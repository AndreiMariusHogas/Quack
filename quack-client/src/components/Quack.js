//React Imports
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";

//Material UI imports
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

//Extra tools
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const styles = {
  card: {
    display: "flex",
    marginBottom: 16
  },
  image: {
    minWidth: 150,
    minHeight: 150
  },
  content: {
    padding: 25,
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
      }
    } = this.props;
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
          <Typography variant="body2">{dayjs(created).fromNow()}</Typography>
          <Typography variant="body1">{body}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Quack);
