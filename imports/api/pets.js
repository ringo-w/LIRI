import { Mongo } from "meteor/mongo";

export const Pets = new Mongo.Collection("pets");

if (Meteor.isServer) {
  Meteor.publish("pets", function petsPublication() {
    return Pets.find({ owner: this.userId });
  });
}
Meteor.methods({
  // This method will only be called when the user accounts gets created to initialize their pet
  "pets.addPet"(petName, series) {
    if (!this.userId) {
      // Checks if the user matches
      throw new Meteor.Error(
        "pets.addPet.not-authorized",
        "You are not allowed to add pets for other users."
      );
    }
    Pets.insert({
      name: petName ? petName : "Your Liri",
      hp: 100,
      stage: 1,
      species: series ? series : 1,
      ownerId: this.userId
    });
  },
  "pets.switchPet"(pet, user, specie) {
    if (user._id !== this.userId) {
      // Checks if the user matches
      throw new Meteor.Error(
        "pets.switchPet.not-authorized",
        "You are not allowed to switch to this pet."
      );
    }
    Pets.update(pet._id, {
      $set: { species: specie }
    });
  },
  "pets.evolve"(pet, user) {
    if (user._id !== this.userId) {
      // Checks if the user matches
      throw new Meteor.Error(
        "pets.evolve.not-authorized",
        "You are not allowed to evolve this pet."
      );
    }
    Pets.update(pet._id, {
      $set: { stage: pet.stage + 1 }
    });
  }
  // "pets.displayLiri"(pet) {
  //   if (task.owner !== this.userId) {
  //     // Checks if the user matches
  //     throw new Meteor.Error(
  //       "pets.displayLiri.not-authorized",
  //       "You are not allowed to display this pet."
  //     );
  //   }
  //   Pets;
  // }
});