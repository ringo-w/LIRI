import { Meteor } from "meteor/meteor";

export const Users = Meteor.users;

// if (Meteor.isServer) {
//   Meteor.publish("user", function userPublication() {
//     return Users.find(
//       { _id: this.userId },
//       { fields: { profile: 1, username: 1, email: 1 } }
//     );
//   });
// }

if (Meteor.isServer) {
  Meteor.publish("user", function userPublication() {
    return Users.find({ _id: this.userId });
  });
}

Meteor.methods({
  "user.newAccount"(userId) {
    Meteor.users.update(userId, {
      $set: { tasksCompleted: 0, currentTasks: [], streak: 1, exp: 100 }
    });
  },
<<<<<<< HEAD
  "user.addExp"(userId, exp) {
    Meteor.users.update(userId, {
      $inc: { exp: exp }
    });
  },
  "user.updateFocus"(userId, focuses) {
=======
  "user.addTask"(userId, task) {
>>>>>>> master
    Meteor.users.update(userId, {
      $push: { currentTasks: task }
    });
  },

  "user.findFriend"() {
    if (Meteor.userId()) {
      const userIds = Meteor.users
        .find({})
        .fetch()
        .map(user => user.friends);
      return userIds;
    }
  },
  // Method to add friends
  "user.addFriend"(username) {
    if (!username) {
      throw new Meteor.Error(
        "user.addFriend.not-authorized",
        "Unable to add user to friends list."
      );
    }

    const newFriend = Meteor.users.findOne({ username });

    if (newFriend) {
      Meteor.users.update(Meteor.userId(), {
        $push: { "profile.friends": newFriend._id }
      });
    }
  },
  // Method to remove friends
  "user.removeFriend"(username) {
    if (!username) {
      throw new Meteor.Error(
        "users.removeFriend.not-authorized",
        "Unable to remove user"
      );
    }

    // Meteor.users.update(Meteor.userId(), {
    //   profile: {
    //     $pull: {
    //       friends: { $in: [friendUserId] }
    //     }
    //   }
    // });

    // Meteor.users.update(Meteor.userId(), {
    //   $pull: { "profile.friends": { $in: [friendUserId] } }
    // });

    const friendToRemove = Meteor.users.findOne({ username });

    if (friendToRemove && friendToRemove._id !== Meteor.userId()) {
      Users.update(Meteor.userId(), {
        $pull: { "profile.friends": friendToRemove._id }
      });
    }
  }
});
