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

db.collection('trains').orderBy('name').onSnapshot(function (snapshot) {
    trains = snapshot.docs.map(function (doc) {
        return doc.data();
    });
    var tableBody = $("#table-body");
    tableBody.html("");
    for (var i = 0; i < trains.length; i++) {
        var tr = $("<tr>");
        tr.append("<td>" + trains[i].name + "</td>");
        tr.append("<td>" + trains[i].destination + "</td>");
        tr.append("<td>" + trains[i].frequency + "</td>");
        var nextTrain = getNextTime(trains[i].time, trains[i].frequency); // trains.time is start time

        tr.append("<td>" + nextTrain + "</td>");
        var minutesAway = getMinutesAway(trains[i].time, trains[i].frequency)
        tr.append("<td>" + minutesAway + "</td>");
        tableBody.append(tr);
    }
});

db.collection('trains').doc("WoeqSmrQ3wr8Yt4v1cC4").delete().then(console.log('deleted'));

function getNextTime(firstTime, frequency) {
    var firstTimeConverted = moment(firstTime, "HH:mm")
    // Current Time
    var currentTime = moment();
    // Difference between the times
    var diffTime = currentTime.diff(firstTimeConverted, "minutes");
    // Time apart (remainder)
    var remainder = diffTime % frequency;
    // Minute Until Train
    var tMinutesTillTrain = frequency - remainder;
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    return nextTrain;
}

function getMinutesAway(firstTime, frequency) {
    var firstTimeConverted = moment(firstTime, "HH:mm")
    // Current Time
    var currentTime = moment();
    // Difference between the times
    var diffTime = currentTime.diff(firstTimeConverted, "minutes");
    // Time apart (remainder)
    var remainder = diffTime % frequency;
    // Minute Until Train
    var minutesAway = frequency - remainder;
    return minutesAway;
}

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
