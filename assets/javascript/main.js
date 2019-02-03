var config = {
  apiKey: "AIzaSyAHCvFl2dXkUCgIJIzSOyae4OIwQG9vO8w",
  authDomain: "train-scheduler-c241d.firebaseapp.com",
  databaseURL: "https://train-scheduler-c241d.firebaseio.com",
  projectId: "train-scheduler-c241d",
  storageBucket: "train-scheduler-c241d.appspot.com",
  messagingSenderId: "595361391083"
};
firebase.initializeApp(config);

var db = firebase.firestore();

var trains = [];

// db.collection('trains').onSnapshot(function (snapshot) {
//   snapshot.forEach(function (doc) {
//     trains.push(doc.data());
//   })
// })

db.collection('trains').onSnapshot(function (snapshot) {
  trains = snapshot.docs.map(function (doc) {
    return doc.data();
  });
  var tableBody = $("#table-body");
  tableBody.html("");
  for (var i = 0; i < trains.length; i++) {
    var tr = $("<tr>");
    tr.append("<td>" + trains[i].name + "</td>");
    tr.append("<td>" + trains[i].destination + "</td>");
    tr.append("<td>" + trains[i].time + "</td>");
    tr.append("<td>" + trains[i].frequency + "</td>");

    tableBody.append(tr);

  }

});


$("#submit-train").on('click', function (e) {
  e.preventDefault();
  var inputTrainName = $("#input-train-name").val().trim();
  var inputDestination = $("#input-destination").val().trim();
  var inputTrainTime = $("#input-first-train-time").val().trim();
  var inputFrequency = $("#input-frequency").val().trim();

  db.collection('trains').add({
    name: inputTrainName,
    destination: inputDestination,
    time: inputTrainTime,
    frequency: inputFrequency
  }).then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });

});
