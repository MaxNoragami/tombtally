document.getElementById("4").style.display = "none";

// Initialize yearMonthsArray
var yearMonthsArray = [];

// Define the printDateRange function
function printDateRange() {
    var startDateInput = document.getElementById('startDate');
    var endDateInput = document.getElementById('endDate');
    
    var startDate = moment(startDateInput.value);
    var endDate = moment(endDateInput.value);

    // Clear the array before populating it with new values
    yearMonthsArray = [];

    // Check if start year is less than 1900
    if (startDate.year() < 1900) {
        throw "Start year cannot be less than 1900.";
    }

    // Check if end year is greater than 2050
    if (endDate.year() > 2050) {
        throw "End year cannot be greater than 2050.";
    }

    if (endDate.isBefore(startDate)) {
        throw "End date must be greater than start date.";
    }      

    // Initialize variables to keep track of the current year and month
    var currentYear = startDate.year();
    var currentMonth = startDate.month();

    // Push the start year to the array
    yearMonthsArray.push(currentYear);

    // Loop through each month between the start and end dates
    while (startDate.isBefore(endDate)) {
        // If the year changes, push the new year to the array
        if (startDate.year() !== currentYear) {
            currentYear = startDate.year();
            yearMonthsArray.push(currentYear);
        }

        // Push the current month name to the array
        yearMonthsArray.push(startDate.format("MMMM"));
        startDate.add(1, 'month');
    }  
}

// Attach event listeners to the input fields
document.getElementById('startDate').addEventListener('change', function() {
    printDateRange();
    console.log(yearMonthsArray); // Optionally log the array when start date changes
});

document.getElementById('endDate').addEventListener('change', function() {
    printDateRange();
    console.log(yearMonthsArray); // Optionally log the array when end date changes
});


var data_period = [];

// Function to extract date values and store them in data_period array
function storeDateValues() {
    // Get the start date input element
    var startDateInput = document.getElementById('startDate');
    // Get the end date input element
    var endDateInput = document.getElementById('endDate');

    // Extract day, month, and year from start date
    var startDate = new Date(startDateInput.value);
    var startDay = startDate.getDate().toString(); // Convert to string
    var startMonth = (startDate.getMonth() + 1).toString(); // Adding 1 because getMonth() returns zero-based month index, and convert to string
    var startYear = startDate.getFullYear().toString(); // Convert to string

    // Extract day, month, and year from end date
    var endDate = new Date(endDateInput.value);
    var endDay = endDate.getDate().toString(); // Convert to string
    var endMonth = (endDate.getMonth() + 1).toString(); // Adding 1 because getMonth() returns zero-based month index, and convert to string
    var endYear = endDate.getFullYear().toString(); // Convert to string

    // Push the extracted values into the data_period array as strings
    data_period = [startDay, startMonth, startYear, endDay, endMonth, endYear];
}

// Adding the job value
function addSelectedOptionToDataPeriod() {
  // Get the select element
  var jobsSelect = document.getElementById('jobs');

  // Get the selected option value
  var selectedOptionValue = jobsSelect.value;

  // Push the selected option value into the data_period array
  data_period.push(selectedOptionValue);
}


function clearInputs() {
  // Clear input fields with id "startDate" and "endDate"
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  // Clear input fields within divs with class "content-collapse"
  const inputFields = document.querySelectorAll('.content-collapse input');
  inputFields.forEach(input => input.value = '');
}



// Define a variable to store the period amount
var period_amount;
var clickCount = 0;
var currentPeriodNumber = 1;
// Event listener for the button with id "button1"
document.getElementById('button1').addEventListener('click', function(event) {
  event.preventDefault();
  // Retrieve the value from the input with id "period"
  var periodInput = document.getElementById('period');
  
  // Store the value in the variable period_amount
  period_amount = parseInt(periodInput.value);
  
  // Log the value to verify
  console.log("Period Amount:", period_amount);
  
});


// Event listener for the button with id "button2"
document.getElementById('button2').addEventListener('click', function(event) {
  clickCount++;
  storeDateValues();
  addSelectedOptionToDataPeriod()
  console.log(data_period);
  event.preventDefault();
  
  if(currentPeriodNumber == 1){
    data_period.unshift(period_amount);
  }


     // Check if the current period number is less than the maximum limit (amountOfPeriods)
     if (currentPeriodNumber < parseInt(period_amount)) {
      // Increment the current period number
      currentPeriodNumber++;
  
      // Update the value of the span with the id "period_number"
      document.getElementById('period_number').innerText = currentPeriodNumber;
  }

    
  // For data_period
 // Send form data array to PHP file using AJAX
 $.ajax({
    url: "../php/save_noncontributory.php", // Path to your PHP file
    type: "POST",
    data: { 
        data_period: data_period,
    }, // Send formDataArray, data_period, and data_salary to PHP file
    success: function (response) {
        // Display the response from the PHP file (if any)
        console.log(response);
    },
    error: function (xhr, status, error) {
        // Handle errors here
        console.error(xhr);
    }
  });
  clearInputs();
  data_period = [];
  if (clickCount === parseInt(period_amount)) {
    window.location.href = "../dashboard.html";
  }

});

$("#button1").click(function () {
  $("#3").fadeOut();
  $(this).parent().closest('.container_d').hide();
  $("#4").fadeIn(1000);
  document.getElementById("4").style.display = "block"; // or "inline" depending on the element 
});

$("#button2").click(function () {
  $("#4").fadeOut();
  document.getElementById("4").style.display = "none";
  $(this).parent().closest('.container_d').hide();
  $("#4").fadeIn(1000);
  document.getElementById("4").style.display = "block"; // or "inline" depending on the element 
});

// Function to handle form submission of the 6th card
$(".link").click(function () {
  $.ajax({
      type: "GET",
      url: "../php/cancel_reg.php",
      success: function (response) {
          console.log(response);
          window.location.href = "../signup.html";
      },
      error: function (xhr, status, error) {
          console.error(xhr.responseText);
          // Handle error
      }
  });

});
