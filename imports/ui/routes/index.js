import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Stats from "../pages/Stats";
import Scoreboard from "../pages/Scoreboard";
import Calendar from "../pages/Calendar";
import Goals from "../pages/Goals";
import AddGoals from "../pages/AddGoals";
import Friends from "../pages/Friends";
import Settings from "../pages/Settings";
import Navigation from "../components/Navigation";
import Login from "../pages/Login";
import Focuses from "../pages/Focuses";

// import FullScreenLoader from "../components/FullScreenLoader";

const Routes = props => {
  return props.userId ? (
    <>
      <Switch>
        <Route exact path="/focus" component={Focuses} />
        <Route exact path="/stats" component={Stats} />
        <Route exact path="/scoreboard" component={Scoreboard} />
        <Route exact path="/calendar" component={Calendar} />
        <Route exact path="/goals" component={Goals} />
        <Route exact path="/addgoals" component={AddGoals} />
        <Route exact path="/friends" component={Friends} />
        <Route exact path="/settings" component={Settings} />
        <Redirect from="*" to="/stats" />
      </Switch>
    </>
  ) : (
    <Route exact path="/login" component={Login} />
  );
};

export default withTracker(() => {
  return {
    userId: Meteor.userId()
  };
})(Routes);
