//React
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

//MaterialUI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Extra Tools
import dayjs from "dayjs";

const styles = {
  separator: {
    border: "none",
    margin: 4
  },
  visSeparator: {
    width: "100%",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    marginBottom: "20px"
  },
  commentImage: {
    witdh: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "50%"
  },
  commentData: {
    marginLeft: "40px"
  }
};

class Comments extends Component {
  state = {};
  render() {
    const { classes, comments } = this.props;
    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { body, created, userImage, userNN } = comment;
          return (
            <Fragment key={created}>
              <Grid item sm={12}>
                <Grid container spacing={2}>
                  <Grid item sm={2}>
                    <img
                      src={userImage}
                      alt="comment"
                      className={classes.commentImage}
                    />
                  </Grid>
                  <Grid item sm={9}>
                    <div className={classes.commentData}>
                      <Typography
                        variant="h5"
                        component={Link}
                        to={`/users/${userNN}`}
                        color="primary"
                      >
                        {userNN}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {dayjs(created).format("h:mm a, MMMM DD YYYY")}
                      </Typography>
                      <hr className={classes.separator} />
                      <Typography variant="body1">{body}</Typography>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {index !== comments.length - 1 && (
                <hr className={classes.visSeparator} />
              )}
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired
};

export default withStyles(styles)(Comments);
