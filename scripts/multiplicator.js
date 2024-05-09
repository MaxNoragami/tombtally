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

let tempDivs = [];

function duplicateDivs() {
    // Get the container div where the divs will be duplicated
    const containerDiv = document.querySelector('.content[name="Insides"]');
  
    // Select the first two divs within the container div
    const existingDivs = containerDiv.querySelectorAll('.content-collapse');

    // Store existing divs in the temp array
    tempDivs = Array.from(existingDivs);

    // Loop through the yearMonthsArray
    for (let i = 0; i < yearMonthsArray.length; i++) {
        // Check if the element is a year or a month
        if (typeof yearMonthsArray[i] === 'number') {
            // Duplicate YearManipulator div
            duplicateYearManipulator(containerDiv, yearMonthsArray[i]);
        } else {
            // Duplicate MonthlyStatus div
            duplicateMonthlyStatus(containerDiv, yearMonthsArray[i]);
        }
    }

    // Remove the stored divs from the container
    for (let i = 0; i < tempDivs.length; i++) {
        containerDiv.removeChild(tempDivs[i]);
    }
}


function setCommonSalaryToMonthlyStatus(commonSalary) {
  // Get all the MonthlyStatus divs
  const monthlyStatusDivs = document.querySelectorAll('.content-collapse[name="MonthlyStatus"]');

  // Loop through each MonthlyStatus div and set the commonSalary value to the input
  monthlyStatusDivs.forEach(monthlyStatus => {
      // Get the input element inside the MonthlyStatus div
      const inputElement = monthlyStatus.querySelector('.monthly_salary');

      // Set the commonSalary value to the input element
      inputElement.value = commonSalary;
  });
}

// Event listener for the button to set common salary
document.querySelector('.set_salary_common').addEventListener('click', function() {
  // Get the value from the CommonSalary input
  const commonSalary = document.querySelector('.salary_common').value;

  // Set the common salary value to the MonthlyStatus inputs
  setCommonSalaryToMonthlyStatus(commonSalary);

  // Duplicate divs and remove the last YearManipulator
  if(yearMonthsArray.length >= 2){
      duplicateDivs();
      removeLastYearManipulator();
  }
});


function setSalaryByRate() {
    // Get the rate value from the input
    const rate = parseFloat(document.querySelector('.rate').value);

    // Get the starting salary value from the input
    let salary = parseFloat(document.querySelector('.salary_by_rate').value);

    // Calculate the monthly growth rate
    const monthlyGrowthRate = (rate / 1200) + 1;

    // Get all the MonthlyStatus divs
    const monthlyStatusDivs = document.querySelectorAll('.content-collapse[name="MonthlyStatus"]');

    // Loop through each MonthlyStatus div
    monthlyStatusDivs.forEach(monthlyStatus => {
        // Get the input element inside the MonthlyStatus div
        const inputElement = monthlyStatus.querySelector('.monthly_salary');

        // Set the salary value to the input element
        inputElement.value = salary.toFixed(2);

        // Multiply the salary by the monthly growth rate for the next iteration
        salary *= monthlyGrowthRate;
    });
}

// Event listener for the button to set salary by rate
document.querySelector('.set_salary_rate').addEventListener('click', function() {
    // Duplicate divs and remove the last YearManipulator
    if(yearMonthsArray.length >= 2){
      duplicateDivs();
      removeLastYearManipulator();
  }
    setSalaryByRate();
});



function setMonthlySalaryByRate() {
  // Get the rate value from the input
  const rate = parseFloat(document.querySelector('.rate').value);

  // Get the start salary value from the input
  const startSalary = parseFloat(document.querySelector('.salary_by_rate').value);

  // Calculate the monthly growth rate
  const monthlyGrowthRate = (rate / 1200) + 1;

  // Get all the MonthlyStatus divs
  const monthlyStatusDivs = document.querySelectorAll('.content-collapse[name="MonthlyStatus"]');

  // Initialize the current salary as the start salary
  let currentSalary = startSalary;

  // Loop through each MonthlyStatus div and update the salary input
  monthlyStatusDivs.forEach(monthlyStatus => {
      // Get the input element inside the MonthlyStatus div
      const inputElement = monthlyStatus.querySelector('.monthly_salary');

      // Set the current salary value to the input element with precision of 2 digits
      inputElement.value = currentSalary.toFixed(2);

      // Calculate the next salary based on the monthly growth rate
      currentSalary *= monthlyGrowthRate;

      // Round the salary to 2 decimal places
      currentSalary = Math.round(currentSalary * 100) / 100;
  });
}



// Add event listener to the "Set" button in YearManipulator div
document.addEventListener('click', function(event) {
  if (event.target && event.target.name === 'YearSalarySet') {
      // Get the value entered in YearSalaryInput
      const yearSalaryInput = event.target.parentNode.querySelector('input[name="YearSalaryInput"]').value;

      // Find all MonthlyStatus divs until the next YearManipulator
      let nextDiv = event.target.parentNode.nextElementSibling;
      while (nextDiv && nextDiv.getAttribute('name') !== 'YearManipulator') {
          // Set the value to year_salary input inside MonthlyStatus div
          const yearSalaryInputField = nextDiv.querySelector('input[name="year_salary"]');
          if (yearSalaryInputField) {
              yearSalaryInputField.value = yearSalaryInput;
          }
          nextDiv = nextDiv.nextElementSibling;
      }
  }
});






function duplicateYearManipulator(containerDiv, year) {
  // Clone the YearManipulator div
  const clone = document.querySelector('.content-collapse[name="YearManipulator"]').cloneNode(true);
  
  // Update year_number placeholder with the actual year value
  clone.querySelector('.input_above_collapse').innerText = year;
  
  // Append the cloned div to the container
  containerDiv.appendChild(clone);
}


function duplicateMonthlyStatus(containerDiv, month) {
  // Clone the MonthlyStatus div
  const clone = document.querySelector('.content-collapse[name="MonthlyStatus"]').cloneNode(true);
  
  // Update month_name placeholder
  clone.querySelector('.input_above_collapse').innerText = month;
  
  // Append the cloned div to the container
  containerDiv.appendChild(clone);
}




// Function to get month name from month index
function getMonthName(monthIndex) {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthIndex - 1];
}


function removeLastYearManipulator() {
  // Get the container div where the divs were duplicated
  const containerDiv = document.querySelector('.content[name="Insides"]');

  // Select the last child div within the container div
  const lastChildDiv = containerDiv.lastElementChild;

  // Check if the last child div is named "YearManipulator"
  if (lastChildDiv.getAttribute('name') === 'YearManipulator') {
      // Remove the last child div
      containerDiv.removeChild(lastChildDiv);
  }
}


// Event listener for the button to duplicate divs
document.querySelector('.set_salary_common').addEventListener('click', function() {
  console.log(yearMonthsArray.length);
  if(yearMonthsArray.length >= 2){
    duplicateDivs();
    removeLastYearManipulator();
  }
});


var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}



// Saving data in the array ------

// Start and End Date ------

// Initialize data_period array
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


// Initialize data_salary array
var data_salary = [];

// Function to store all the data within the input boxes named "year_salary" from each MonthlyStatus div
function storeMonthlySalaries() {
  // Clear the data_salary array before populating it with new values
  data_salary = [];

  // Get all the MonthlyStatus divs
  const monthlyStatusDivs = document.querySelectorAll('.content-collapse[name="MonthlyStatus"]');

  // Loop through each MonthlyStatus div
  monthlyStatusDivs.forEach(monthlyStatus => {
      // Get the input element inside the MonthlyStatus div
      const inputElement = monthlyStatus.querySelector('input[name="year_salary"]');
      
      // Get the salary value from the input element and convert it to a string
      const salary = inputElement.value.toString();
      
      // Push the salary value (as a string) into the data_salary array
      data_salary.push(salary);
  });
  var salary_length = data_salary.length.toString();
  data_salary.unshift(salary_length);
}

// Fader functions


$("#button1").click(function () {
  $("#3").fadeOut();
  document.getElementById("3").style.display = "none";
  $(this).parent().closest('.container_d').hide();
  $("#3").fadeIn(1000);
  document.getElementById("3").style.display = "block"; // or "inline" depending on the element 
});




var amountOfPeriods;
// Function to send XMLHttpRequest
function fetchDataFromServer() {
  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open('POST', '../php/get_period.php', true);

  // Set the request header
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Define what happens on successful data submission
  xhr.onload = function() {
      if (xhr.status === 200) {
          // Response received successfully
          console.log('Response received: ' + xhr.responseText);

          // Extract the value of amount_of_periods from the response
          var match = xhr.responseText.match(/var\s+amount_of_periods\s*=\s*'([^']+)';/);
          if (match) {
              amountOfPeriods = match[1];
              console.log('Amount of periods: ' + amountOfPeriods);

              // Use the variable amountOfPeriods as needed
          } else {
              console.error('Error: Variable "amount_of_periods" not found in the response.');
          }
      } else {
          // Error handling for unsuccessful request
          console.error('Request failed. Status: ' + xhr.status);
      }
  };

  // Define what happens in case of an error
  xhr.onerror = function() {
      console.error('Error: Request failed.');
  };

  // Send the request with the form data
  xhr.send();
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  fetchDataFromServer();
});


var nonc;
// Function to send XMLHttpRequest
function fetchNoncFromServer() {
  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open('POST', '../php/get_nc.php', true);

  // Set the request header
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Define what happens on successful data submission
  xhr.onload = function() {
      if (xhr.status === 200) {
          // Response received successfully
          console.log('Response received: ' + xhr.responseText);

          // Extract the value of amount_of_periods from the response
          var match = xhr.responseText.match(/var\s+amount_of_periods\s*=\s*'([^']+)';/);
          if (match) {
              nonc = match[1];
              console.log('Considers non-contributory? ' + nonc);

              // Use the variable nonc as needed
          } else {
              console.error('Error: Variable "nonc" not found in the response.');
          }
      } else {
          // Error handling for unsuccessful request
          console.error('Request failed. Status: ' + xhr.status);
      }
  };

  // Define what happens in case of an error
  xhr.onerror = function() {
      console.error('Error: Request failed.');
  };

  // Send the request with the form data
  xhr.send();
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  fetchNoncFromServer();
});



function clearInputs() {
  // Clear input fields with id "startDate" and "endDate"
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';

  // Clear input fields with name "rate", "salary_by_rate", "CommonSalary"
  document.getElementsByName('rate').forEach(input => input.value = '');
  document.getElementsByName('salary_by_rate').forEach(input => input.value = '');
  document.getElementsByName('set_salary_rate').forEach(input => input.value = '');
  document.getElementsByName('CommonSalary').forEach(input => input.value = '');

  // Clear input fields within divs with class "content-collapse"
  const inputFields = document.querySelectorAll('.content-collapse input');
  inputFields.forEach(input => input.value = '');
}


// Define a variable to keep track of the current period number
var currentPeriodNumber = 1;
var clickCount = 0;
// Event listener for the button with id "3b"
document.getElementById('button1').addEventListener('click', function(event) {
  // Prevent the default behavior of the button (e.g., form submission)
  event.preventDefault();
  clickCount++;
  
  // Call the function to extract and store date values
  storeDateValues();
  addSelectedOptionToDataPeriod();
  storeMonthlySalaries();

  console.log(data_period);
  console.log(data_salary);
  // Log the data_period array to verify
  
   // Check if the current period number is less than the maximum limit (amountOfPeriods)
   if (currentPeriodNumber < parseInt(amountOfPeriods)) {
    // Increment the current period number
    currentPeriodNumber++;

    // Update the value of the span with the id "period_number"
    document.getElementById('period_number').innerText = currentPeriodNumber;
}

// For data_period
 // Send form data array to PHP file using AJAX
 $.ajax({
  url: "../php/save_period_info.php", // Path to your PHP file
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

// For data_salary
 // Send form data array to PHP file using AJAX
 $.ajax({
  url: "../php/save_salary_info.php", // Path to your PHP file
  type: "POST",
  data: { 
      data_salary: data_salary,
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
  data_salary = [];
console.log("nonc: ",nonc);
  if (clickCount === parseInt(amountOfPeriods)) {
    // Print "beeep" to the console
    console.log(nonc);
    if(nonc == 0){
      console.log(nonc);
      window.location.href = "../dashboard.html";
    }
    else if(nonc == 1){
      console.log(nonc);
      window.location.href = "../periods_noncontributory.html";
    }
  }
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

