// Code to handle form transitions
document.getElementById("q2").style.display = "none";
document.getElementById("q3").style.display = "none";
document.getElementById("q4").style.display = "none";
document.getElementById("q5").style.display = "none";
document.getElementById("q6").style.display = "none";
document.getElementById("con").style.display = "none";
document.getElementById("non").style.display = "none";
document.getElementById("scion").style.display = "none";
document.getElementById("pension_result").style.display = "none";
document.getElementById("pension_info").style.display = "none";
document.getElementById("pension_income").style.display = "none";
document.getElementById("pension_date").style.display = "none";
document.getElementById("disa").style.display = "none";
document.getElementById("disar").style.display = "none";
document.getElementById("ddd").style.display = "none";
document.getElementById("mdl").style.display = "none";
document.getElementById("mdl1").style.display = "none";
document.getElementById("mdl2").style.display = "none";
document.getElementById("vv").style.display = "none";

var amount_con_periods;
var noncontributory;
var disability;
var data_personal_original;
var data_personal_temp;
var changed = 0;
var username;
var noncon;
var concon;
var amount_non_periods;
var age_lim_pen;
var clicko = 0;


// Array to store form data
var formDataArray = [];

// Function to save form data
function saveFormData(formId) {
    var formData = $("#" + formId).serializeArray();
    var formDataValues = []; // Array to store form data values

    // Extract and push each form data value into the array
    formData.forEach(function(input) {
        if (input.name === 'date') {
            // Extract day, month, and year from the date input
            var dateParts = input.value.split('-');
            var day = dateParts[2];
            var month = dateParts[1];
            var year = dateParts[0];

            // Push day, month, and year as separate elements into the array
            formDataValues.push(day);
            formDataValues.push(month);
            formDataValues.push(year);
        } else if (input.name === 'dis_grade') {
            // Get the value of the selected radio button
            var selectedGrade = $("input[name='dis_grade']:checked").val();
            console.log("Selected Grade Value:", selectedGrade); // Log selected value

            // Push the selected grade value into the array
            formDataValues.push(selectedGrade);

            // Perform specific actions based on the selected grade value
            if (selectedGrade === '0') {
                // If grade is 0, show the 5th card
                showSixthCard();
                formDataValues.push('0');
                formDataValues.push('0');
                formDataValues.push('0');
            } else {
                // If grade is not 0, show the 6th card
                showFifthCard();
            }
        } else if (input.name === 'checker') {

            if (document.getElementById('my_checker').checked) {
                formDataValues.push('1');
            }  
            
        } else {
            // Push input value into the array
            formDataValues.push(input.value);
        }
    });

    // Push form data values array into the main form data array
    formDataArray = formDataArray.concat(formDataValues);
    if (
      formDataArray.length < 12 && // Check if array length is smaller than 12
      formDataArray[1] !== undefined && formDataArray[1] !== '' && // Check index 1
      formDataArray[2] !== undefined && formDataArray[2] !== '' && // Check index 2
      formDataArray[3] !== undefined && formDataArray[3] !== '' && // Check index 3
      formDataArray[4] !== undefined && formDataArray[4] !== '' && // Check index 4
      formDataArray[5] !== undefined && formDataArray[5] !== '' && // Check index 5
      formDataArray[6] !== undefined && formDataArray[6] !== '' && // Check index 6
      formDataArray[7] !== undefined && formDataArray[7] !== '' && // Check index 7
      formDataArray[8] !== undefined && formDataArray[8] !== '' && // Check index 8
      formDataArray[9] !== undefined && formDataArray[9] !== '' && // Check index 9
      formDataArray[10] !== undefined && formDataArray[10] !== '' // Check index 10
  ) {
      formDataArray.push('0');
  }
  

    // Clear form inputs
    $("#" + formId)[0].reset();

    // Log form data array to console (for testing purposes)
    //console.log(formDataArray);

    // Return false to prevent form submission
    return false;
}

// The good stuff --------------------------------------------------------------

// Saving Login Data
var personal_data;

// Function to send XMLHttpRequest
function fetchLinesFromServer() {
  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open('POST', '../php/get_personal_data.php', true);

  // Set the request header
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Define what happens on successful data submission
  xhr.onload = function() {
      if (xhr.status === 200) {
          // Response received successfully
          console.log('Response received: ' + xhr.responseText);

          // Parse the JSON response into an array
          try {
              personal_data = JSON.parse(xhr.responseText);
              console.log('Login Data Array: ', personal_data);
              
              // Initialize original and temp arrays with personal_data
              data_personal_original = [...personal_data];
              data_personal_temp = [...personal_data];

              get_username();
              populateFormData();
              checkRadioButtons();
              checkNonContributory();
              getUsername();
              getNoncon();
              getConcon();

              console.log("Username: ",username);
             
              // Use the linesArray as needed
          } catch (error) {
              console.error('Error parsing JSON response: ', error);
              window.location.href = "../index.html";
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

function getUsername() {
  // Check if personal_data array is populated
  if (personal_data && personal_data.length > 0) {
      username = personal_data[0]; // Get the username from the first element of the array
      console.log('Username: ' + username);
      
      // Use the username as needed
      // For example, you can set it to a global variable or display it in the UI
  } else {
      console.error('Error: personal_data array is empty or not populated.');
  }
}

function getNoncon() {
  // Check if personal_data array is populated
  if (personal_data && personal_data.length > 0) {
      noncon = personal_data[13]; // Get the username from the first element of the array
      console.log('Noncon: ' + noncon);
      
      // Use the username as needed
      // For example, you can set it to a global variable or display it in the UI
  } else {
      console.error('Error: personal_data array is empty or not populated.');
  }
}

function getConcon() {
  // Check if personal_data array is populated
  if (personal_data && personal_data.length > 0) {
      concon = personal_data[12]; // Get the username from the first element of the array
      console.log('Concon: ' + concon);
      
      // Use the username as needed
      // For example, you can set it to a global variable or display it in the UI
  } else {
      console.error('Error: personal_data array is empty or not populated.');
  }
}

// Function to check radio buttons based on personal_data
function checkRadioButtons() {
  // Check if personal_data array is populated
  if (personal_data && personal_data.length >= 9) {
      var disGrade = personal_data[8]; // Data from line 9 (index 8)
      disability = disGrade.toString();
      var radioButtons = document.querySelectorAll('.dis_grade_quest');
      // Iterate through radio buttons to find a match with disGrade
      for (var i = 0; i < radioButtons.length; i++) {
          if (radioButtons[i].value === disGrade) {
              radioButtons[i].checked = true; // Set checked property if value matches
              break; // Exit loop if match found
          }
      }
  } else {
      console.error('Error: personal_data array is not populated or does not have enough elements.');
  }
}


// Function to check the non-contributory checkbox based on personal_data
function checkNonContributory() {
  // Check if personal_data array is populated
  if (personal_data && personal_data.length >= 14) {
      var nonContributoryValue = personal_data[13]; // Data from line 14 (index 13)
      var checkerCheckbox = document.querySelector('.checker_quest');
      // Set noncontributory variable
      noncontributory = nonContributoryValue;
      // Check or uncheck the checkbox based on nonContributoryValue
      if (nonContributoryValue === '1') {
          checkerCheckbox.checked = true;
      } else {
          checkerCheckbox.checked = false;
      }
  } else {
      console.error('Error: personal_data array is not populated or does not have enough elements.');
  }
}

// greetings
function get_username(){
  document.getElementById('master').innerText = personal_data[0];
}

// Function to populate form data from personal_data
function populateFormData() {
  // Check if personal_data array is populated
  if (personal_data && personal_data.length >= 13) {
      // Accessing the input boxes with class "name_quest", "surname_quest", "date_quest", "pnumber_quest", "date_quest_2", and "years_quest"
      var nameInput = document.querySelector('.name_quest');
      var surnameInput = document.querySelector('.surname_quest');
      var dateInput = document.querySelector('.date_quest');
      var numberInput = document.querySelector('.pnumber_quest');
      var dateInput2 = document.querySelector('.date_quest_2');
      var yearsInput = document.querySelector('.years_quest');

      // Set the value of the input boxes
      nameInput.value = personal_data[2]; // Data from line 3 (index 2)
      surnameInput.value = personal_data[3]; // Data from line 4 (index 3)

      // Combine day, month, and year from lines 5, 6, and 7 respectively
      var day = personal_data[4];
      var month = personal_data[5];
      var year = personal_data[6];
      // Format date string in yyyy-mm-dd format for input type date
      var dateString = year + '-' + month + '-' + day;
      // Set the value of the date input
      dateInput.value = dateString;

      // Set the value of the number input
      numberInput.value = personal_data[7]; // Data from line 8 (index 7)

      // Check the value from line 9
      var disGrade = personal_data[8];
      if (disGrade === '0') {
          // If line 9 is '0', don't populate the second date input
          dateInput2.value = ''; // Clear the value of the date input
      } else {
          // If line 9 is not '0', populate the second date input
          // Combine day, month, and year from lines 10, 11, and 12 respectively
          var day2 = personal_data[9];
          var month2 = personal_data[10];
          var year2 = personal_data[11];
          // Format date string in yyyy-mm-dd format for input type date
          var dateString2 = year2 + '-' + month2 + '-' + day2;
          // Set the value of the second date input
          dateInput2.value = dateString2;
      }

      // Set the value of the years input and store the value in amount_con_periods
      yearsInput.value = personal_data[12]; // Data from line 13 (index 12)
      amount_con_periods = parseInt(personal_data[12]); // Store as integer
  } else {
      console.error('Error: personal_data array is not populated or does not have enough elements.');
  }
}

// Function to update temp array on input change
function updateTempArray() {
  var nameInput = document.querySelector('.name_quest');
  var surnameInput = document.querySelector('.surname_quest');

  // Update name in temp array if changed
  if (nameInput.value !== data_personal_temp[2]) {
      data_personal_temp[2] = nameInput.value;
  }

  // Update surname in temp array if changed
  if (surnameInput.value !== data_personal_temp[3]) {
      data_personal_temp[3] = surnameInput.value;
  }
}

// Event listener for input change on name_quest and surname_quest
document.querySelectorAll('.name_quest, .surname_quest').forEach(function(input) {
  input.addEventListener('input', function() {
      updateTempArray();
  });
});

// Function to update temp array with changes in date_quest and pnumber_quest
function updateTempArrayWithDateAndPNumber() {
  var dateInput = document.querySelector('.date_quest');
  var pnumberInput = document.querySelector('.pnumber_quest');

  // Split date string into day, month, and year
  var dateValue = dateInput.value.split('-');
  var day = dateValue[2];
  var month = dateValue[1];
  var year = dateValue[0];

  // Update temp array with new values
  data_personal_temp[4] = day; // Day
  data_personal_temp[5] = month; // Month
  data_personal_temp[6] = year; // Year

  // Update temp array with new pnumber value
  data_personal_temp[7] = pnumberInput.value;
}

// Event listener for input change on date_quest and pnumber_quest
document.querySelectorAll('.date_quest, .pnumber_quest').forEach(function(input) {
  input.addEventListener('input', function() {
      updateTempArrayWithDateAndPNumber();
  });
});

// Function to update temp array with selected radio button value
function updateTempArrayWithRadio() {
  var radioButtons = document.querySelectorAll('.dis_grade_quest');

  // Iterate through radio buttons to find the selected value
  for (var i = 0; i < radioButtons.length; i++) {
      if (radioButtons[i].checked) {
          // Update 9th element of temp array with selected value
          data_personal_temp[8] = radioButtons[i].value;
          disability = data_personal_temp[8];
          break; // Exit loop if value found
      }
  }
}

// Event listener for radio button change
document.querySelectorAll('.dis_grade_quest').forEach(function(radioButton) {
  radioButton.addEventListener('change', function() {
      updateTempArrayWithRadio();
  });
});

// Function to update temp array with changes in date_quest_2
function updateTempArrayWithDate2() {
  var dateInput2 = document.querySelector('.date_quest_2');

  // Split date string into day, month, and year
  var dateValue2 = dateInput2.value.split('-');
  var day2 = dateValue2[2];
  var month2 = dateValue2[1];
  var year2 = dateValue2[0];

  // Update temp array with new values
  data_personal_temp[9] = day2; // Day
  data_personal_temp[10] = month2; // Month
  data_personal_temp[11] = year2; // Year
}

// Event listener for input change on date_quest_2
document.querySelector('.date_quest_2').addEventListener('input', function() {
  updateTempArrayWithDate2();
});

// Function to update temp array with changes in years_quest
function updateTempArrayWithYearsQuest() {
  var yearsInput = document.querySelector('.years_quest');

  // Update temp array with new value
  data_personal_temp[12] = yearsInput.value;
}

// Event listener for input change on years_quest
document.querySelector('.years_quest').addEventListener('input', function() {
  updateTempArrayWithYearsQuest();
});

// Function to update temp array with changes in checker_quest
function updateTempArrayWithCheckerQuest() {
  var checkerCheckbox = document.querySelector('.checker_quest');

  // Update temp array with new value
  data_personal_temp[13] = checkerCheckbox.checked ? '1' : '0';
}

// Event listener for checkbox change on checker_quest
document.querySelector('.checker_quest').addEventListener('change', function() {
  updateTempArrayWithCheckerQuest();
});



//name surname
//debuggg
// Event listener for button click
$("#2b_quest_p").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#2b_quest_n").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#3b_quest_n").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#3b_quest_p").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#4b_quest_n").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#4b_quest_p").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#5b_quest_n").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#5b_quest_p").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#6b_quest_p").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});
$("#6b_quest_n").click(function () {
  // Update original array with temp array
  console.log(data_personal_temp);
});

//important
// Event listener for button click
$("#2b_quest_c").click(function () {

  // Check if at least one element in temp array is different from original
  for (var i = 0; i < data_personal_temp.length; i++) {
      if (data_personal_temp[i] !== data_personal_original[i]) {
          changed = 1; // Set changed flag to 1
          break; // Exit loop if difference found
      }
  }
  // Log changed flag
  console.log('changed:', changed);
  data_personal_original = [...data_personal_temp];
  
  if(changed == 1){
    $.ajax({
      url: "../php/modify_personal_data.php", // Path to your PHP file
      type: "POST",
      data: { 
        data_personal_original: data_personal_original,
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
    changed = 0;
  }
});

// Event listener for button click
$("#3b_quest_c").click(function () {

  // Check if at least one element in temp array is different from original
  for (var i = 0; i < data_personal_temp.length; i++) {
      if (data_personal_temp[i] !== data_personal_original[i]) {
          changed = 1; // Set changed flag to 1
          break; // Exit loop if difference found
      }
  }
  // Log changed flag
  console.log('changed:', changed);
  data_personal_original = [...data_personal_temp];
  if(changed == 1){
    $.ajax({
      url: "../php/modify_personal_data.php", // Path to your PHP file
      type: "POST",
      data: { 
        data_personal_original: data_personal_original,
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
    changed = 0;
  }
});

// Event listener for button click
$("#4b_quest_c").click(function () {

  // Check if at least one element in temp array is different from original
  for (var i = 0; i < data_personal_temp.length; i++) {
      if (data_personal_temp[i] !== data_personal_original[i]) {
          changed = 1; // Set changed flag to 1
          break; // Exit loop if difference found
      }
  }
  // Log changed flag
  console.log('changed:', changed);
  data_personal_original = [...data_personal_temp];
  if(changed == 1){
    $.ajax({
      url: "../php/modify_personal_data.php", // Path to your PHP file
      type: "POST",
      data: { 
        data_personal_original: data_personal_original,
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
    changed = 0;
  }
});
// Event listener for button click
$("#5b_quest_c").click(function () {

  // Check if at least one element in temp array is different from original
  for (var i = 0; i < data_personal_temp.length; i++) {
      if (data_personal_temp[i] !== data_personal_original[i]) {
          changed = 1; // Set changed flag to 1
          break; // Exit loop if difference found
      }
  }
  // Log changed flag
  console.log('changed:', changed);
  data_personal_original = [...data_personal_temp];
  if(changed == 1){
    $.ajax({
      url: "../php/modify_personal_data.php", // Path to your PHP file
      type: "POST",
      data: { 
        data_personal_original: data_personal_original,
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
    changed = 0;
  }
});
// Event listener for button click
$("#6b_quest_c").click(function () {

  // Check if at least one element in temp array is different from original
  for (var i = 0; i < data_personal_temp.length; i++) {
      if (data_personal_temp[i] !== data_personal_original[i]) {
          changed = 1; // Set changed flag to 1
          break; // Exit loop if difference found
      }
  }
  // Log changed flag
  console.log('changed:', changed);
  data_personal_original = [...data_personal_temp];
  if(changed == 1){
    $.ajax({
      url: "../php/modify_personal_data.php", // Path to your PHP file
      type: "POST",
      data: { 
        data_personal_original: data_personal_original,
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
    changed = 0;
  }
});



// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  fetchLinesFromServer();
});




// personal data menu  ------------------------------------------------------------



$("#button1").click(function () {
  if(clicko == 1){
    console.log("Window is active!");
  }
  else{
    $("#q2").fadeIn(1000);
    document.getElementById("q2").style.display = "block"; // or "inline" depending on the element   
  }
  clicko = 1;
 });

$("#2b_quest_c").click(function () {
    $("q2").fadeOut();
    $(this).parent().closest('.container_quest').hide(500);
    clicko = 0;
  });

  $("#6b_quest_c").click(function () {
    $("q6").fadeOut();
    $(this).parent().closest('.container_g_quest').hide(500);
    clicko = 0;
  });

  $("#3b_quest_c").click(function () {
    $("q3").fadeOut();
    $(this).parent().closest('.container_d_quest').hide(500);
    clicko = 0;
  });

  $("#4b_quest_c").click(function () {
    $("q4").fadeOut();
    $(this).parent().closest('.container_e_quest').hide(500);
    clicko = 0;
  });

  $("#5b_quest_c").click(function () {
    $("q5").fadeOut();
    $(this).parent().closest('.container_f_quest').hide(500);
    clicko = 0;
  });

  $("#2b_quest_n").click(function () {
    $("#q2").fadeOut();
    $(this).parent().closest('.container_quest').hide(500);
    $("#q3").fadeIn(1000);
    document.getElementById("q3").style.display = "block"; // or "inline" depending on the element 
  });

  $("#6b_quest_n").click(function () {
    $("#q6").fadeOut();
    $(this).parent().closest('.container_g_quest').hide(500);
    $("#q2").fadeIn(1000);
    document.getElementById("q2").style.display = "block"; // or "inline" depending on the element 
  });

  $("#5b_quest_n").click(function () {
    $("#q5").fadeOut();
    $(this).parent().closest('.container_f_quest').hide(500);
    $("#q6").fadeIn(1000);
    document.getElementById("q6").style.display = "block"; // or "inline" depending on the element 
  });

  $("#3b_quest_p").click(function () {
    $("#q3").fadeOut();
    $(this).parent().closest('.container_d_quest').hide(500);
    $("#q2").fadeIn(1000);
    document.getElementById("q2").style.display = "block"; // or "inline" depending on the element 
  });

  $("#2b_quest_p").click(function () {
    $("#q2").fadeOut();
    $(this).parent().closest('.container_quest').hide(500);
    $("#q6").fadeIn(1000);
    document.getElementById("q6").style.display = "block"; // or "inline" depending on the element 
  });

  $("#6b_quest_p").click(function () {
    $("#q6").fadeOut();
    $(this).parent().closest('.container_g_quest').hide(500);
    if(disability == "0"){
        $("#q4").fadeIn(1000);
        document.getElementById("q4").style.display = "block"; // or "inline" depending on the element 
    }
    else{
        $("#q5").fadeIn(1000);
        document.getElementById("q5").style.display = "block"; // or "inline" depending on the element 
    }
   
  });



$("#button1").click(function () {
  if(clicko == 1){
    console.log("Window is active!");
  }
  else{
    $("#q2").fadeIn(1000);
    document.getElementById("q2").style.display = "block"; // or "inline" depending on the element 
  }
  clicko = 1;
  });


  $("#3b_quest_n").click(function () {
    $("#q3").fadeOut();
    $(this).parent().closest('.container_d_quest').hide(500);
    $("#q4").fadeIn(1000);
    document.getElementById("q4").style.display = "block"; // or "inline" depending on the element 
  });
  
  $("#4b_quest_p").click(function () {
    $("#q4").fadeOut();
    $(this).parent().closest('.container_e_quest').hide(500);
    $("#q3").fadeIn(1000);
    document.getElementById("q3").style.display = "block"; // or "inline" depending on the element 
  });

  $("#5b_quest_p").click(function () {
    $("#q5").fadeOut();
    $(this).parent().closest('.container_f_quest').hide(500);
    $("#q4").fadeIn(1000);
    document.getElementById("q4").style.display = "block"; // or "inline" depending on the element 
  });

  $("#4b_quest_n").click(function () {
    $("#q4").fadeOut();
    $(this).parent().closest('.container_e_quest').hide(500);
    if(disability == "0"){
        $("#q6").fadeIn(1000);
        document.getElementById("q6").style.display = "block"; // or "inline" depending on the element 
    }
    else{
        $("#q5").fadeIn(1000);
        document.getElementById("q5").style.display = "block"; // or "inline" depending on the element 
    }
    
  });





// Collipsable--------------------------------------------------------
// Saving Contributory Data

// Global variable for contributory data
var con_data;
var index = 0;
var inputArray;
// Function to fetch contributory data from the server
function fetchConDataFromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/get_con_data.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                con_data = JSON.parse(xhr.responseText);
                data_con_original = [...con_data];
                data_con_temp = [...con_data];
              
                populateConFormData();
                printDateRange();

                console.log(con_data);
            } catch (error) {
                console.error('Error parsing JSON response: ', error);
            }
        } else {
            console.error('Request failed. Status: ' + xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error('Error: Request failed.');
    };
    xhr.send();
}

// Global variable for contributory data
var salary_data;
var arrays;
//var index = 0;
// Function to fetch contributory data from the server
function fetchSalaryDataFromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/get_salary_data.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                salary_data = JSON.parse(xhr.responseText);
                data_salary_original = [...salary_data];
                data_salary_temp = [...salary_data];
                inputArray = [...salary_data];
                populateConFormData();
                duplicateDivs();
                arrays = createArrays(amount_con_periods, inputArray);

                console.log(arrays[1]);
                console.log(arrays[2]);
                console.log(arrays[3]);
                console.log(arrays[0]);
                console.log(salary_data);
              
                populateSalaries(arrays[0]);
            } catch (error) {
                console.error('Error parsing JSON response: ', error);
            }
        } else {
            console.error('Request failed. Status: ' + xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error('Error: Request failed.');
    };
    xhr.send();
}



function populateSalaries(salaryArray) {
  // Check if salaryArray is defined and is an array
  if (Array.isArray(salaryArray)) {
      // Select all input boxes with class "monthly_salary_con"
      const salaryInputs = document.querySelectorAll('.monthly_salary_con');

      // Loop through each input box
      salaryInputs.forEach((input, index) => {
          // Clear the input value
          input.value = '';

          // Check if the index is within the range of the provided array
          if (index < salaryArray.length) {
              // Convert the array element to a number
              const salary = parseFloat(salaryArray[index]);

              // Check if the converted value is a valid number
              if (!isNaN(salary)) {
                  // Set the input box value to the salary
                  input.value = salary;
              } else {
                  // If the value is not a valid number, set the input box value to empty
                  input.value = '';
              }
          }
      });
  } else {
      // Handle cases where salaryArray is undefined or not an array
      console.error('Error: salaryArray is undefined or not an array.');
  }
}
var index_con=0;

// Functions to update the con data

// Function to update temp array with changes in date_quest_2
function updateTempArrayWithConDate() {
  let dateInput2 = document.querySelector('.date_con_1');

  // Split date string into day, month, and year
  let dateValue2 = dateInput2.value.split('-');
  let day2 = dateValue2[2];
  let month2 = dateValue2[1];
  let year2 = dateValue2[0];

  // Update temp array with new values
  data_con_temp[index_con + 0] = day2; // Day
  data_con_temp[index_con + 1] = month2; // Month
  data_con_temp[index_con + 2] = year2; // Year
}



function updateTempArrayWithConDate1() {
  let dateInput1 = document.querySelector('.date_con_2');

  // Split date string into day, month, and year
  let dateValue1 = dateInput1.value.split('-');
  let day1 = dateValue1[2];
  let month1 = dateValue1[1];
  let year1 = dateValue1[0];

  // Update temp array with new values
  data_con_temp[index_con + 3] = day1; // Day
  data_con_temp[index_con + 4] = month1; // Month
  data_con_temp[index_con + 5] = year1; // Year
}



// Function to update temp array with changes in select option
function updateTempArrayWithConOption() {
  let selectCon = document.querySelector('.select_con');
  let selectedOptionValue = selectCon.value;
  
  // Update temp array with new option value
  data_con_temp[index_con + 6] = selectedOptionValue;
}





// window switch
j = 0
var arr_index = 0;

$("#b_con_n").click(function () {
    
    if(j == amount_con_periods-1){
        j = 0;
        index = 0;
        index_con = index;
        populateConFormData();
    }
    else{
        j++;
        index += 7;
        index_con += 7;
        populateConFormData();
        console.log("index: ",index);
    }
    document.getElementById('period_number').innerText = j+1;
    $("#con").fadeOut();
    $(this).parent().closest('.container_d_con').hide(500);
    $("#con").fadeIn(1000);

    document.getElementById("con").style.display = "block"; // or "inline" depending on the element 
    console.log("Index:", index/7);
    arr_index = index/7;
    console.log("The subarray: ", arrays[index/7]) ;
    populateSalaries(arrays[arr_index]); // Call populateSalaries with arrays[index]
    console.log("Tem array: ", data_con_temp);
  }
);

  $("#button2").click(function () {

     if(clicko == 1){
        console.log("Window is active!");
      }
      else{
      $("#con").fadeIn(1000);
      document.getElementById("con").style.display = "block"; // or "inline" depending on the element 
    }
    clicko = 1;
  });

  $("#b_con_p").click(function () {
    
    if(j+1 == 1){
        j = amount_con_periods - 1;
        index = amount_con_periods*7 - 7;
        index_con = amount_con_periods*7 - 7;
        populateConFormData();
    }
    else{
        j--;
        index -= 7;
        index_con -= 7;
        populateConFormData();
    }
    document.getElementById('period_number').innerText = j+1;
    $("#con").fadeOut();
    $(this).parent().closest('.container_d_con').hide(500);
    $("#con").fadeIn(1000);

    document.getElementById("con").style.display = "block"; // or "inline" depending on the element
    console.log("Index:", index/7);
    arr_index = index/7;
    console.log("The subarray: ", arrays[index/7]) ;
    populateSalaries(arrays[arr_index]); // Call populateSalaries with arrays[index]
    console.log("Tem array: ", data_con_temp);
  
  });



var changes_c = 0;
$("#b_con_c, #b_con_n, #b_con_p").click(function () {
// Check if at least one element in temp array is different from original
for (var i = 0; i < data_con_temp.length; i++) {
  if (data_con_temp[i] !== data_con_original[i]) {
      changes_c = 1; // Set changed flag to 1
      break; // Exit loop if difference found
  }
}
// Moncomtributory changed flag
console.log('changes:', changes_c);
data_con_original = [...data_con_temp];
if(changes_c == 1){
$.ajax({
  url: "../php/modify_con_data.php", // Path to your PHP file
  type: "POST",
  data: { 
    data_con_original: data_con_original,
  }, // Send formDataArray, data_period, and data_salary to PHP file
  success: function (response) {
      // Display the response from the PHP file (if any)
      console.log(response);
      fetchConDataFromServer();
  },
  error: function (xhr, status, error) {
      // Handle errors here
      console.error(xhr);
  }
});
changes_c = 0;
}
});


var changes_con = 0;
$("#b_con_c").click(function () {
  clicko = 0;
  $("con").fadeOut();
  $(this).parent().closest('.container_d_con').hide(500);
  mergeArraysToArray();

// Check if at least one element in temp array is different from original
for (var i = 0; i < inputArray.length; i++) {
  if (inputArray[i] !== salary_data[i]) {
      changes_con = 1; // Set changed flag to 1
      break; // Exit loop if difference found
  }
}
// Moncomtributory changed flag
console.log('changes_con:', changes_con);
salary_data = [...inputArray];
if(changes_con == 1){
$.ajax({
  url: "../php/modify_salary_data.php", // Path to your PHP file
  type: "POST",
  data: { 
    salary_data: salary_data,
  }, // Send formDataArray, data_period, and data_salary to PHP file
  success: function (response) {
      // Display the response from the PHP file (if any)
      console.log(response);
      fetchSalaryDataFromServer();
  },
  error: function (xhr, status, error) {
      // Handle errors here
      console.error(xhr);
  }
});
changes_con = 0;
}

});


// Event listener for input change on date_quest_2
document.querySelector('.date_con_1').addEventListener('input', function() {
  updateTempArrayWithConDate();
});

// Event listener for select change
document.querySelector('.select_con').addEventListener('change', function() {
  updateTempArrayWithConOption();
});

// Event listener for input change on date_quest_2
document.querySelector('.date_con_2').addEventListener('input', function() {
  updateTempArrayWithConDate1();
});

function populateConFormData() {
  if (con_data && con_data.length >= 3) {
      var dateConInput = document.querySelector('.date_con_1');
      var dateConInput2 = document.querySelector('.date_con_2');
      var selectCon = document.querySelector('.select_con');
      if (dateConInput && dateConInput2) {
          var day = con_data[index+0];
          var month = con_data[index+1];
          var year = con_data[index+2];

          

          var day2 = con_data[index+3];
          var month2 = con_data[index+4];
          var year2 = con_data[index+5];

          var job_value = con_data[index + 6];
          selectCon.value = job_value;
          // Ensure month and day are zero-padded if necessary
          month2 = month2.padStart(2, '0');
          day2 = day2.padStart(2, '0');

          month = month.padStart(2, '0');
          day = day.padStart(2, '0');

          // Format date string in yyyy-mm-dd format for input type date
          var dateString = year + '-' + month + '-' + day;
          var dateString2 = year2 + '-' + month2 + '-' + day2;

          dateConInput.value = dateString;
          dateConInput2.value = dateString2;


          console.log('Start Date input value set:', dateString);
          console.log('End Date input value set:', dateString2);

          printDateRange();
          duplicateDivs();
      } else {
          console.error('Error: Date input element with class "date_con_1" or "date_con_2" not found.');
      }
  } else {
      console.error('Error: con_data array is not populated or does not have enough elements.');
  }
}

// Define the printDateRange function
function printDateRange() {
    var startDateInput = document.querySelector('.date_con_1');
    var endDateInput = document.querySelector('.date_con_2');

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

    // Print the ranges in the console
    console.log(yearMonthsArray);
}


let tempDivs = [];

function duplicateDivs() {
    // Get the container div where the divs will be duplicated
    const containerDiv = document.querySelector('.content_con[name="Insides"]');

    // Select the first two divs within the container div
    const existingDivs = containerDiv.querySelectorAll('.content-collapse_con');

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

function duplicateYearManipulator(containerDiv, year) {
    // Clone the YearManipulator div
    const clone = document.querySelector('.content-collapse_con[name="YearManipulator"]').cloneNode(true);

    // Update year_number placeholder with the actual year value
    clone.querySelector('.input_above_collapse_con_year').innerText = year;

    // Append the cloned div to the container
    containerDiv.appendChild(clone);
}

function duplicateMonthlyStatus(containerDiv, month) {
    // Clone the MonthlyStatus div
    const clone = document.querySelector('.content-collapse_con[name="MonthlyStatus"]').cloneNode(true);

    // Update month_name placeholder
    clone.querySelector('.input_above_collapse_con_month').innerText = month;

    // Append the cloned div to the container
    containerDiv.appendChild(clone);
}

function removeLastYearManipulator() {
    // Get the container div where the divs were duplicated
    const containerDiv = document.querySelector('.content_con[name="Insides"]');

    // Select the last child div within the container div
    const lastChildDiv = containerDiv.lastElementChild;

    // Check if the last child div is named "YearManipulator"
    if (lastChildDiv.getAttribute('name') === 'YearManipulator') {
        // Remove the last child div
        containerDiv.removeChild(lastChildDiv);
    }
}



function createArrays(amount_con_periods, inputArray) {
  arrays = [];
  let currentIndex = 0;

  for (let i = 0; i < amount_con_periods; i++) {
      const subArray = [];
      const elementsToAdd = parseInt(inputArray[currentIndex], 10);
      for (let j = 0; j < elementsToAdd; j++) {
          subArray.push(inputArray[currentIndex + j + 1]);
      }
      arrays.push(subArray);
      currentIndex += elementsToAdd + 1;
  }

  return arrays;
}


$(".set_salary_common_con").click(function() {
  // Get the value from the input box with class "salary_common_con"
  var commonSalary = $(".salary_common_con").val(); // No need to parse to float

  // Check if the value is not empty
  if (commonSalary.trim() !== '') {
      // Get the current subarray from arrays[arr_index]
      const currentSubarray = arrays[arr_index];

      // Update each element in the subarray with the new common salary as string
      for (let i = 0; i < currentSubarray.length; i++) {
          currentSubarray[i] = commonSalary; // Assign as string
      }

      // Repopulate the salaries with the updated subarray
      populateSalaries(currentSubarray);
  } else {
      // Handle cases where the value is empty
      console.error('Error: Salary value cannot be empty.');
  }
});


$(".set_salary_rate_con").click(function() {
  // Get the value from the input box with class "rate_con"
  var rate = $(".rate_con").val(); // No need to parse to float

  // Check if the value is not empty and is a valid number
  if (rate.trim() !== '' && !isNaN(rate)) {
      // Convert rate to monthly rate
      var monthlyRate = parseFloat(rate) / 1200 + 1;

      // Get the current subarray from arrays[arr_index]
      const currentSubarray = arrays[arr_index];

      // Loop through each element in the subarray
      for (let i = 0; i < currentSubarray.length; i++) {
          // Check if it's the first element in the subarray
          if (i === 0) {
              // For the first element, set the value from "salary_by_rate_con"
              currentSubarray[i] = $(".salary_by_rate_con").val();
          } else {
              // For subsequent elements, calculate the salary based on the previous element
              var previousSalary = parseFloat(currentSubarray[i - 1]);
              var newSalary = previousSalary * monthlyRate;
              currentSubarray[i] = newSalary.toFixed(2); // Store as string with two decimal places
          }
      }

      // Repopulate the salaries with the updated subarray
      populateSalaries(currentSubarray);
  } else {
      // Handle cases where the value is empty or not a valid number
      console.error('Error: Rate value must be a valid number.');
  }
});

function mergeArraysToArray() {
  // Reset the inputArray to an empty array
  inputArray = [];

  // Loop through each subarray in arrays
  arrays.forEach(subarray => {
      // Add the length of the subarray as the first element in the inputArray
      inputArray.push(subarray.length);

      // Add each element from the subarray to the inputArray
      subarray.forEach(element => {
          inputArray.push(element);
      });
  });

  // Log the updated inputArray
  console.log(inputArray);
}










// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchConDataFromServer();
});

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  fetchSalaryDataFromServer();
});

// Define the printDateRange function
function printDateRange() {
  var startDateInput = document.querySelector('.date_con_1');
  var endDateInput = document.querySelector('.date_con_2');

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

  // Print the ranges in the console
  console.log(yearMonthsArray);
}


// NONCONTRIBUTORY ---------------------------------------


// Saving Noncontributory Data
var non_data;
var index_non = 0;
var q = 0;
// Function to send XMLHttpRequest
function fetchNonFromServer() {
  // Create a new XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open('POST', '../php/get_non_data.php', true);

  // Set the request header
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Define what happens on successful data submission
  xhr.onload = function() {
      if (xhr.status === 200) {
          // Response received successfully
          console.log('Response received: ' + xhr.responseText);

          // Parse the JSON response into an array
          try {
              non_data = JSON.parse(xhr.responseText);
              console.log('Non Data Array: ', non_data);
              amount_non_periods = non_data[0];
              console.log('Non Data Periods: ',amount_non_periods);
              // Initialize original and temp arrays with personal_data
              data_non_original = [...non_data];
              data_non_temp = [...non_data];
              populateNonFormData();
              printNonDateRange();
              console.log(non_data);
              console.log("Temp Array:",data_non_temp);
              // Use the linesArray as needed
          } catch (error) {
              console.error('Error parsing JSON response: ', error);
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


$("#b_non_c").click(function () {
  $("non").fadeOut();
  $(this).parent().closest('.container_e_non').hide(500);
  clicko = 0;
});

$("#button3").click(function () {
  if(clicko == 1){
    console.log("Window is active!");
  }
  else{
    $("#non").fadeIn(1000);
    document.getElementById("non").style.display = "block";
  }
  clicko = 1;
   // or "inline" depending on the element 
});



k = 0
$("#b_non_n").click(function () {
    
    if(k == amount_non_periods-1){
      
        k = 0;
    }
    else{
        k++;
    }
    document.getElementById('period_number_non').innerText = k+1;
  });

  $("#b_non_p").click(function () {
    
    if(k+1 == 1){
        k = amount_non_periods - 1;
    }
    else{
        k--;
    }
    
   

    document.getElementById("non").style.display = "block"; // or "inline" depending on the element 
  });




// Function to update temp array with changes in date_quest_2
function updateTempArrayWithNonDate() {
  let dateInput2 = document.querySelector('.date_non_2');

  // Split date string into day, month, and year
  let dateValue2 = dateInput2.value.split('-');
  let day2 = dateValue2[2];
  let month2 = dateValue2[1];
  let year2 = dateValue2[0];

  // Update temp array with new values
  data_non_temp[index_non + 4] = day2; // Day
  data_non_temp[index_non + 5] = month2; // Month
  data_non_temp[index_non + 6] = year2; // Year
}

// Event listener for input change on date_quest_2
document.querySelector('.date_non_2').addEventListener('input', function() {
  updateTempArrayWithNonDate();
});

function updateTempArrayWithNonDate1() {
  let dateInput1 = document.querySelector('.date_non_1');

  // Split date string into day, month, and year
  let dateValue1 = dateInput1.value.split('-');
  let day1 = dateValue1[2];
  let month1 = dateValue1[1];
  let year1 = dateValue1[0];

  // Update temp array with new values
  data_non_temp[index_non + 1] = day1; // Day
  data_non_temp[index_non + 2] = month1; // Month
  data_non_temp[index_non + 3] = year1; // Year
}

// Event listener for input change on date_quest_2
document.querySelector('.date_non_1').addEventListener('input', function() {
  updateTempArrayWithNonDate1();
});

// Function to update temp array with changes in select option
function updateTempArrayWithNonOption() {
  let selectNon = document.querySelector('.select_non');
  let selectedOptionValue = selectNon.value;
  
  // Update temp array with new option value
  data_non_temp[index_non + 7] = selectedOptionValue;
}

// Event listener for select change
document.querySelector('.select_non').addEventListener('change', function() {
  updateTempArrayWithNonOption();
});


$("#b_non_n").click(function () {
  // Update original array with temp array
  console.log("Temp Array:",data_non_temp);
});

// window switch

$("#b_non_n").click(function () {
    
    if(q == amount_non_periods-1){
        q = 0;
        index_non = 0;
        populateNonFormData();
    }
    else{
        q++;
        index_non += 7;
        populateNonFormData();
        console.log("index: ",index_non);
    }
    document.getElementById('period_number_non').innerText = q+1;
    $("#non").fadeOut();
    $(this).parent().closest('.container_e_con').hide(500);
    $("#non").fadeIn(1000);

    document.getElementById("non").style.display = "block"; // or "inline" depending on the element 
  });

  $("#b_non_p").click(function () {
    
    if(q+1 == 1){
        q = amount_non_periods - 1;
        index_non = (amount_non_periods*7) - 7;
        populateNonFormData();
    }
    else{
        q--;
        index_non -= 7;
        populateNonFormData();
    }
    document.getElementById('period_number_non').innerText = q+1;
    $("#non").fadeOut();
    $(this).parent().closest('.container_e_non').hide(500);
    $("#non").fadeIn(1000);

    document.getElementById("non").style.display = "block"; // or "inline" depending on the element 
  });



  function populateNonFormData() {
    if (non_data && non_data.length >= 3) {
        var dateNonInput = document.querySelector('.date_non_1');
        var dateNonInput2 = document.querySelector('.date_non_2');
        var selectNon = document.querySelector('.select_non');
        if (dateNonInput && dateNonInput2) {
          
            var non_day = non_data[index_non+1];
            var non_month = non_data[index_non+2];
            var non_year = non_data[index_non+3];
  
            
  
            var non_day2 = non_data[index_non+4];
            var non_month2 = non_data[index_non+5];
            var non_year2 = non_data[index_non+6];
  
            var non_job_value = non_data[index_non+ 7];
            
            selectNon.value = non_job_value;
            // Ensure month and day are zero-padded if necessary
            non_month2 = non_month2.padStart(2, '0');
            non_day2 = non_day2.padStart(2, '0');
  
            non_month = non_month.padStart(2, '0');
            non_day = non_day.padStart(2, '0');
  
            // Format date string in yyyy-mm-dd format for input type date
            var non_dateString = non_year + '-' + non_month + '-' + non_day;
            var non_dateString2 = non_year2 + '-' + non_month2 + '-' + non_day2;
  
            dateNonInput.value = non_dateString;
            dateNonInput2.value = non_dateString2;
  
  
            console.log('Start Date input value set:', non_dateString);
            console.log('End Date input value set:', non_dateString2);
  
            printNonDateRange();
    
        } else {
            console.error('Error: Date input element with class "date_con_1" or "date_con_2" not found.');
        }
    } else {
        console.error('Error: con_data array is not populated or does not have enough elements.');
    }
  }
  
  // Define the printDateRange function
  function printNonDateRange() {
      var non_startDateInput = document.querySelector('.date_non_1');
      var non_endDateInput = document.querySelector('.date_non_2');
  
      var non_startDate = moment(non_startDateInput.value);
      var non_endDate = moment(non_endDateInput.value);
  
      // Clear the array before populating it with new values
      var non_yearMonthsArray = [];
  
      // Check if start year is less than 1900
      if (non_startDate.year() < 1900) {
          throw "Start year cannot be less than 1900.";
      }
  
      // Check if end year is greater than 2050
      if (non_endDate.year() > 2050) {
          throw "End year cannot be greater than 2050.";
      }
  
      if (non_endDate.isBefore(non_startDate)) {
          throw "End date must be greater than start date.";
      }      
  
      // Initialize variables to keep track of the current year and month
      var non_currentYear = non_startDate.year();
      var non_currentMonth = non_startDate.month();
  
      // Push the start year to the array
      non_yearMonthsArray.push(non_currentYear);
  
      // Loop through each month between the start and end dates
      while (non_startDate.isBefore(non_endDate)) {
          // If the year changes, push the new year to the array
          if (non_startDate.year() !== non_currentYear) {
              non_currentYear = non_startDate.year();
              non_yearMonthsArray.push(non_currentYear);
          }
  
          // Push the current month name to the array
          non_yearMonthsArray.push(non_startDate.format("MMMM"));
          non_startDate.add(1, 'month');
      }  
  
      // Print the ranges in the console
      console.log(non_yearMonthsArray);
  }
var changes = 0;
$("#b_non_n, #b_non_n, #b_non_c").click(function () {
// Check if at least one element in temp array is different from original
for (var i = 0; i < data_non_temp.length; i++) {
  if (data_non_temp[i] !== data_non_original[i]) {
      changes = 1; // Set changed flag to 1
      break; // Exit loop if difference found
  }
}
// Moncomtributory changed flag
console.log('changes:', changes);
data_non_original = [...data_non_temp];
if(changes == 1){
$.ajax({
  url: "../php/modify_non_data.php", // Path to your PHP file
  type: "POST",
  data: { 
    data_non_original: data_non_original,
  }, // Send formDataArray, data_period, and data_salary to PHP file
  success: function (response) {
      // Display the response from the PHP file (if any)
      console.log(response);
      fetchNonFromServer();
  },
  error: function (xhr, status, error) {
      // Handle errors here
      console.error(xhr);
  }
});
changes = 0;
}
});

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  fetchNonFromServer();
});
  

// ---------------------------
var coll = document.getElementsByClassName("collapsible_con");
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


// Descendant -----------------------------------------------------------

// Saving Login Data
var scion_data = ["username", "0"];





function updateUsernameArray() {
  let nameInput = document.querySelector('.name_scion');
  // Update name in temp array if changed
      scion_data[0] = nameInput.value;
}

// Event listener for input change on name_quest and surname_quest
document.querySelectorAll('.name_scion').forEach(function(input) {
  input.addEventListener('input', function() {
      updateUsernameArray();
  });
});


// Function to update temp array with changes in select option
function updateTempArrayWithScionOption() {
  let selectNon = document.querySelector('.select_scion');
  let selectedOptionValue = selectNon.value;
  
  // Update temp array with new option value
  scion_data[1] = selectedOptionValue;
}

// Event listener for select change
document.querySelector('.select_scion').addEventListener('change', function() {
  updateTempArrayWithScionOption();
});


$("#b_scion_c").click(function () {
  $("scion").fadeOut();
  $(this).parent().closest('.container_scion').hide(500);
  mergeArraysToArray();
  $.ajax({
    url: "../php/save_data_scion.php", // Path to your PHP file
    type: "POST",
    data: { 
      scion_data: scion_data,
    }, // Send formDataArray, data_period, and data_salary to PHP file
    success: function (response) {
        // Display the response from the PHP file (if any)
        console.log(response);
        fetchConDataFromServer();
    },
    error: function (xhr, status, error) {
        // Handle errors here
        console.error(xhr);
    }
  });
  });

  $("#b_scion_c").click(function () {
    console.log(username);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/execute_3_exe',
        data: {username: username},
        success: function (response) {
            console.log(response);
            setTimeout(function() {
                $.ajax({
                    type: 'POST',
                    url: '../php/copy_scion_pen.php',
                    data: {username: username},
                    success: function (response) {
                        console.log(response);
                        $.ajax({
                            type: 'GET',
                            url: `../users/${username}/scion_pen.txt`,
                            success: function (data) {
                                var scion_dates = data.split("\n").map(function(item) {
                                    return item.replace(/\r/g, '');
                                }).filter(Boolean);
                                setTimeout(function(){
                                  $("#pension_result, #pension_info, #mdl1, #mdl2").fadeIn(1000);
                                  document.getElementById("pension_result, pension_info, mdl, mdl1, mdl2").style.display = "block"; // or "inline" depending on the element 
                                  
                                },1000)
                                console.log(scion_dates);
                                document.getElementById("money").style.display = "none";
                                document.getElementById("pension_date").style.display = "none";
                                document.getElementById("pension_income").style.display = "none";
                                document.getElementById("ddd").style.display = "none";
                                document.getElementById("vv").style.display = "none";
                                document.getElementById("mdl").style.display = "none";
                                // Update HTML elements with values from disability_data array
                                $("#pension_result").text(scion_dates[0]);
                                updatePensionInfo(scion_dates[1]);
                                $("#pension_income").text(scion_dates[2]);
                                // $("#pension_date").text(disability_data[3]); // This line remains unchanged
                            },
                            error: function (xhr, status, error) {
                                console.error("Error fetching scion_pen.txt:", error);
                            }
                        });
                    },
                    error: function (xhr, status, error) {
                        console.error("Error copying scion_pen.txt:", xhr.responseText);
                    }
                });
            }, 1000); // 1 second delay
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        }
    });
  });




$("#button7").click(function () {
  $("#scion").fadeIn(1000);
  document.getElementById("scion").style.display = "block"; // or "inline" depending on the element 
});


$("#button8").click(function () {
  console.log("user to del ",username);
  // Send AJAX request to your PHP file
  $.ajax({
      url: "../php/logout.php",
      type: "POST",
      data: { username: username },
      success: function(response) {
          // Redirect to index.html after successful deletion
          window.location.href = "../index.html";
      },
      error: function(xhr, status, error) {
          // Handle error if any
          console.error(xhr.responseText);
      }
  });
});


$("#button5").click(function () {
  console.log(username);

  $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/execute_exe',
      data: {username: username},
      success: function (response) {
          console.log(response);
          setTimeout(function() {
              $.ajax({
                  type: 'POST',
                  url: '../php/copy_age_lim_pen.php',
                  data: {username: username},
                  success: function (response) {
                      console.log(response);
                      $.ajax({
                          type: 'GET',
                          url: `../users/${username}/age_lim_pen.txt`,
                          success: function (data) {
                              var age_pension = data.split("\n").map(function(item) {
                                  return item.replace(/\r/g, '');
                              }).filter(Boolean);
                              console.log(age_pension);
                              setTimeout(function(){
                                $("#pension_result, #pension_income, #pension_info, #pension_date, #ddd, #mdl, #mdl1, #mdl2, #vv").fadeIn(1000);
                                document.getElementById("pension_result, pension_income, pension_info, pension_date, ddd, mdl, mdl1, mdl2, vv").style.display = "block"; // or "inline" depending on the element 

                              },1000)
                              document.getElementById("money").style.display = "none";
                              // Update HTML elements with values from age_pension array
                              $("#pension_result").text(age_pension[0]);
                              updatePensionInfo(age_pension[1]);
                              $("#pension_income").text(age_pension[2]);
                              $("#pension_date").text(age_pension[3]);
                          },
                          error: function (xhr, status, error) {
                              console.error("Error fetching age_lim_pen.txt:", error);
                          }
                      });
                  },
                  error: function (xhr, status, error) {
                      console.error("Error copying age_lim_pen.txt:", xhr.responseText);
                  }
              });
          }, 1000); // 1 second delay
      },
      error: function (xhr, status, error) {
          console.error(xhr.responseText);
      }
  });
});

// Function to update pension info based on values
function updatePensionInfo(infoValue) {
  var pensionInfo = "";
  switch(infoValue) {
      case "1":
          pensionInfo = "Eligible for the age-limit pension";
          break;
      case "2":
          pensionInfo = "Eligible for the disability pension";
          break;
      case "3":
          pensionInfo = "Eligible for the descendant pension";
          break;
      case "4":
          pensionInfo = "Not eligible for the disability pension, due to not having enough stages of contribution";
          break;
      case "7":
          pensionInfo = "Not eligible, you're under age";
          break;
      case "10":
          pensionInfo = "Info for case 10";
          break;
      default:
          pensionInfo = "NaN";
          break;
  }
  $("#pension_info").text(pensionInfo);
}




$("#button6").click(function () {
  console.log(username);
  $.ajax({
      type: 'POST',
      url: 'http://localhost:5000/execute_2_exe',
      data: {username: username},
      success: function (response) {
          console.log(response);
          setTimeout(function() {
              $.ajax({
                  type: 'POST',
                  url: '../php/copy_disability_pen.php',
                  data: {username: username},
                  success: function (response) {
                      console.log(response);
                      $.ajax({
                          type: 'GET',
                          url: `../users/${username}/disability_pen.txt`,
                          success: function (data) {
                              var disability_data = data.split("\n").map(function(item) {
                                  return item.replace(/\r/g, '');
                              }).filter(Boolean);
                              setTimeout(function(){
                                $("#pension_result, #pension_income, #pension_info, #mdl, #mdl1, #mdl2, #vv").fadeIn(1000);
                                document.getElementById("pension_result, pension_income, pension_info, mdl, mdl1, mdl2, vv").style.display = "block"; // or "inline" depending on the element 
                                
                              },1000)
                              console.log(disability_data);
                              document.getElementById("money").style.display = "none";
                              document.getElementById("pension_date").style.display = "none";
                              document.getElementById("ddd").style.display = "none";
                              // Update HTML elements with values from disability_data array
                              $("#pension_result").text(disability_data[0]);
                              updatePensionInfo(disability_data[1]);
                              $("#pension_income").text(disability_data[2]);
                              // $("#pension_date").text(disability_data[3]); // This line remains unchanged
                          },
                          error: function (xhr, status, error) {
                              console.error("Error fetching disability_pen.txt:", error);
                          }
                      });
                  },
                  error: function (xhr, status, error) {
                      console.error("Error copying disability_pen.txt:", xhr.responseText);
                  }
              });
          }, 1000); // 1 second delay
      },
      error: function (xhr, status, error) {
          console.error(xhr.responseText);
      }
  });
});


$("#button6, #button5").click(function () {


  $("#disar").fadeIn(200);
  document.getElementById("disar").style.display = "block";
  $("#disa").fadeIn(200);
  document.getElementById("disa").style.display = "block";
  setTimeout(function(){
    $("#disar").fadeOut(500);
  document.getElementById("disar").style.display = "none";
  $("#disa").fadeOut(500);
  document.getElementById("disa").style.display = "none";
  }, 3000);
  

});


$("#b_scion_c").click(function () {


  $("#disar").fadeIn(200);
  document.getElementById("disar").style.display = "block";
  $("#disa").fadeIn(200);
  document.getElementById("disa").style.display = "block";
  setTimeout(function(){
    $("#disar").fadeOut(500);
  document.getElementById("disar").style.display = "none";
  $("#disa").fadeOut(500);
  document.getElementById("disa").style.display = "none";
  }, 5000);
  

});