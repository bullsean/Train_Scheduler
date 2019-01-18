var config = {
    apiKey: "AIzaSyAuqWjsh4QNYw457DPjvaIsanDdNt7-8gU",
    authDomain: "trainschedulersb.firebaseapp.com",
    databaseURL: "https://trainschedulersb.firebaseio.com",
    projectId: "trainschedulersb",
    storageBucket: "",
    messagingSenderId: "717591959352"
  };
  firebase.initializeApp(config);
var database = firebase.database();

var trainName;
var destination;
var firstTime;
var frequency;
var timeOfDay = moment().format("HH:mm");

$("#submitBtn").on("click", function() {
    event.preventDefault();
    trainName = $("#trainName").val().trim();
    console.log(trainName);
    destination = $("#destination").val().trim();
    console.log(destination);
    firstTime = $("#firstTrainTime").val().trim();
    console.log(firstTime);
    frequency = $("#frequency").val().trim();
    console.log(frequency);

    database.ref().push({
        "trainName": trainName,
        "destination": destination,
        "firstTrainTime": firstTime,
        "frequency": frequency,
        "currentTime": timeOfDay
    })
})

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot)
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().frequency);

    var databaseTrainName = childSnapshot.val().trainName;
    console.log(databaseTrainName);
    var databaseDestination = childSnapshot.val().destination;
    console.log(databaseDestination);
    var databaseFirstTime = childSnapshot.val().firstTrainTime;
    console.log(databaseFirstTime);
    var databaseFrequency = childSnapshot.val().frequency;
    console.log(databaseFrequency);
    
    var firstArrivalConverted = moment(databaseFirstTime, "HH:mm").subtract(1, "years");
    console.log(firstArrivalConverted);

    var currentTime = moment();
    console.log("Current Time:" + moment(currentTime).format("HH:mm"));

    var differenceInTime = currentTime.diff(moment(firstArrivalConverted), "minutes");
    console.log(differenceInTime);
    console.log(moment(differenceInTime).format("mm"));

    var minutesSinceTrain = differenceInTime % databaseFrequency;
    console.log(minutesSinceTrain);

    var minutesUntilNextTrain = databaseFrequency - minutesSinceTrain;
    console.log(minutesUntilNextTrain);

    var nextTrainTime = currentTime.add(minutesUntilNextTrain, "minutes");
    
    var nextTrainTimeFormatted = (moment(nextTrainTime).format("HH:mm"));
    console.log(nextTrainTimeFormatted);

    var newTrainAdded = '<tr><th scope="row">'+ databaseTrainName +'</th><td>'+ databaseDestination +'</td><td>'+ databaseFrequency +'</td><td>'+ nextTrainTimeFormatted +'</td><td>'+ minutesUntilNextTrain +'</td></tr>'

    $("#tableBody").append(newTrainAdded);

    $("#jumbo").html('<h1 class="display-4">Train Schedule</h1><p class="lead">CURRENT TIME: '+ moment().format("HH:mm") +'</p>')
})