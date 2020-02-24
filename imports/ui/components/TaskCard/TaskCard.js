import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton
} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import DoneIcon from "@material-ui/icons/Done";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import moment from "moment";
import Box from "@material-ui/core/Box";
import "../../../api/tasks";
import "../../../api/users";
import { Pets } from "../../../api/pets";
import { withTracker } from "meteor/react-meteor-data";

class TaskCard extends Component {
  handleComplete = () => {
    console.log("Completed");

    // Meteor.removeTask
    Meteor.call("task.removeTask", this.props.task);
    Meteor.call("user.addCounters", this.props.task.exp);
    console.log(this.props.task.exp);
    console.log("This is being called");
    Meteor.call(
      "pets.addCounters",
      this.props.task.exp,
      this.props.pets[0].ownerId
    );
    Meteor.call("user.addStreak");
  };
  handleDelete = () => {
    console.log("Deleted");
    Meteor.call("task.removeTask", this.props.task);
    Meteor.call("pets.takeHP", this.props.pets[0]);
    Meteor.call("user.removeStreak");
    // Updates pets health
  };
  render() {
    const { classes, task, pets, userid } = this.props;
    const handleComplete = () => {
      console.log("Completed");
      // Meteor.removeTask
      Meteor.call("task.removeTask", task);
      Meteor.call("user.addExp", task.exp);
      Meteor.call("user.addStreak");
    };
    const handleDelete = () => {
      console.log("Deleted");
      Meteor.call("task.removeTask", task);
      // Updates pets health
    };
    console.log("EXP", task.exp);
    console.log("Props", this.props);
    return (
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <span className={classes.userInfo}>{task && task.task}</span>
          <br />
          <Divider />
          <Box className={classes.split}>
            <div>
              <Typography variant="caption">Start/Started: </Typography>
              {task && moment(task.startDate).fromNow()}
            </div>
            <div>
              <IconButton onClick={this.handleComplete}>
                <DoneIcon />
              </IconButton>
              <IconButton onClick={this.handleDelete}>
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          </Box>
        </CardContent>
      </Card>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("pets");
  return {
    userId: Meteor.userId(),
    pets: Pets.find({}).fetch()
  };
})(withStyles(styles)(TaskCard));
