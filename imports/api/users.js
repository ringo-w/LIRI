import { Meteor } from "meteor/meteor";

export const Users = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish("friends", function friendPublication() {
    return Users.find(
      { "profile.friends": { $in: [Meteor.userId()] } },
      { fields: { username: 1, profile: 1, emails: 1, createdAt: 1 } }
    );
  });

  if (Meteor.isServer) {
    Meteor.publish("user", function userPublication() {
      return Users.find(Meteor.userId());
    });
  }
}

Meteor.methods({
  "user.newAccount"(userId) {
    Meteor.users.update(userId, {
      $set: { tasksCompleted: 0, streak: 1, exp: 1 }
    });
  },
  "user.addCounters"(exp) {
    const currentUserXP = Meteor.users.find(Meteor.userId()).fetch()[0].exp;
    const totalExp = currentUserXP + exp;
    console.log(currentUserXP);
    if (totalExp > 99) {
      let remainingExp = totalExp % 100;
      Meteor.users.update(Meteor.userId(), {
        $inc: { level: 1 },
        $set: { exp: 1 + remainingExp }
      });
    } else {
      Meteor.users.update(Meteor.userId(), {
        $inc: { exp: exp, tasksCompleted: 1 }
      });
    }
  },
  "user.addStreak"() {
    Meteor.users.update(Meteor.userId(), {
      $inc: { streak: 1 }
    });
  },
  "user.removeStreak"() {
    Meteor.users.update(Meteor.userId(), {
      $set: { streak: 1 }
    });
  },
  "user.updateFocus"(userId, focuses) {
    Meteor.users.update(userId, {
      $push: { currentTasks: task }
    });
  },

  "friend.friends"() {
    console.log("find users with friends containing", Meteor.userId());
    const response = Users.find({
      "profile.friends": { $in: [Meteor.userId()] }
    }).fetch();
    console.log("server response", response);
    return response;
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

    if (newFriend && newFriend._id !== Meteor.userId()) {
      Meteor.users.update(Meteor.userId(), {
        $push: { "profile.friends": newFriend._id }
      });
      Meteor.users.update(newFriend._id, {
        $push: { "profile.friends": Meteor.userId() }
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
