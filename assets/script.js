
  //Web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDB0tkEFKu-BqYALCYGMm6YoJQCC_ZIs0o",
    authDomain: "hw-train-31724.firebaseapp.com",
    databaseURL: "https://hw-train-31724.firebaseio.com",
    projectId: "hw-train-31724",
    storageBucket: "hw-train-31724.appspot.com",
    messagingSenderId: "581347034792",
    appId: "1:581347034792:web:57901de326204327a8e49d"
  };
  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);


  
 var dataRef = firebase.database(); 

 // Show current time 
 
 var datetime = null,
 date = null;
 
 var update = function () {
   date = moment(new Date())
   datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
 };
 
 $(document).ready(function(){
   datetime = $('#currentStatus')
   update();
   setInterval(update, 1000);
 
 });
 
 // Defining Global Variables //
 
 var name = "";
 var destination = "";
 var startTime = 0;
 var frequency = 0; 
 
 // Button for adding trains //
 
 $("#addTrain").on("click", function(event) {
     event.preventDefault();
 
 // Grab user input from "Add Train" section 
 
 name = $("#trainNameInput").val().trim();
 destination = $("#trainDestination").val().trim();
 startTime = $("#startTime").val().trim();
 frequency = $("#trainFrequency").val().trim();
 
 console.log(name);
 console.log(destination);
 console.log(startTime);
 console.log(frequency);
 
 // Uploading train data to firebase dataRef 
 
 dataRef.ref().push({
     name: name, 
     destination: destination, 
     startTime: startTime, 
     frequency: frequency,
     dateAdded: firebase.database.ServerValue.TIMESTAMP
 });
 
 // clear text boxes 
 
 $("#trainNameInput").val("");
 $("#trainDestination").val(""); 
 $("#startTime").val("");
 $("#trainFrequency").val(""); 
 
 }); // Event (adding Trains) 
 
 
 // Creating a way to retrieve train information from train dataRef  
 // Creating a Firebase event for adding Train infomation to the dataRef and a row in the HTML whenever the user // adds an entry.
 
 // Page loads or children are added run this function
 dataRef.ref().on("child_added", function (childSnapshot, prevChildKey) {
 
 
 // Time Variables 
 
 var getName = childSnapshot.val().name; 
 var getDestination = childSnapshot.val().destination;
 var getTime = childSnapshot.val().startTime;
 var getFrequency = parseInt(childSnapshot.val().frequency); 
 
 // Calculating the time of next train arrival, and the minute until the next train arrives. Also, convert the start time : of the train to HH:mm (to be used by Momment.JS)
 
 var currentTime = moment();
 
 
 // Used this as first time (pushed back 1 year to make sure it comes before current time)    
 var convertedFirstTime = moment(getTime, "hh:mm").subtract(1, "years");
 
 // Difference between the start time and the current time 
 var diffTime = moment().diff(moment(convertedFirstTime), "minutes");
 
 // Divide the difference by the frequency to get the time apart remainder 
 var tRemainder = diffTime % getFrequency;
 
  
 // Figure out when the next train will come by subracting the time remainder from the frequency of when each train comes 
 
 var minutesAway = getFrequency - tRemainder; 
 
 // Figure out when the next train will come by adding the minutes from arrival to current time 
 
 var nextTrain = moment().add(minutesAway, "minutes");
 
 // Store arrival time 
 
 var nextArrival = moment(nextTrain, "HHmm").format("h:mm A");
 
 // Adding entry 
 
 var row = $('<tr>');
 
 row.append('<td>' + getName + "</td>")
 row.append('<td>' + getDestination + "</td>")
 row.append('<td>' + getFrequency + " mins" + "</td>")
 row.append('<td>' + nextArrival + "</td>")
 row.append('<td>' + minutesAway + "</td>")
 
 $("#trainTable > tbody").append(row)
 

 $("#clearTrain").on("click", function(event) {
      event.preventDefault();
      $('#trainTable').find("tr:gt(0)").remove();
      reset;
 });
      
 
 });
 