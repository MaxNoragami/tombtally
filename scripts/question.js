// Code to handle form transitions
document.getElementById("2").style.display = "none";
document.getElementById("3").style.display = "none";
document.getElementById("4").style.display = "none";
document.getElementById("5").style.display = "none";
document.getElementById("6").style.display = "none";

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
  
  
    
    /*
    if (11 > formDataArray.length) {
      formDataArray.push('0');
    }
    */

    // Clear form inputs
    $("#" + formId)[0].reset();

    // Log form data array to console (for testing purposes)
    console.log(formDataArray);

    // Return false to prevent form submission
    return false;
}


// Function to show the 5th card
function showFifthCard() {
    $("#4").fadeOut();
    $("#5").fadeIn(1000);
    document.getElementById("5").style.display = "block"; // or "inline" depending on the element
}

// Function to show the 6th card
function showSixthCard() {
    $("#4").fadeOut();
    $("#6").fadeIn(1000);
    document.getElementById("6").style.display = "block"; // or "inline" depending on the element
}

// Code to handle form transitions...
$("#1").click(function () {
    $("#1").fadeOut();
    $(this).parent().closest('.container_t').hide();
    $("#2").fadeIn(1000);
    document.getElementById("2").style.display = "block"; // or "inline" depending on the element 
});
$("#2b").click(function () {
    $("#2").fadeOut();
    $(this).parent().closest('.container').hide();
    $("#3").fadeIn(1000);
    document.getElementById("3").style.display = "block"; // or "inline" depending on the element 
});
$("#3b").click(function () {
  $("#3").fadeOut();
  $(this).parent().closest('.container_d').hide();
  $("#4").fadeIn(1000);
  document.getElementById("4").style.display = "block"; // or "inline" depending on the element 
});

$("#5b").click(function () {
  $("#5").fadeOut();
  $(this).parent().closest('.container_f').hide();
  $("#6").fadeIn(1000);
  document.getElementById("6").style.display = "block"; // or "inline" depending on the element 
});


// Function to handle form submission of the 6th card
$("#6b").click(function (e) {
  e.preventDefault(); // Prevent default form submission
  saveFormData('form6'); // Save form data before sending it to PHP
  // Send form data array to PHP file using AJAX
  $.ajax({
      url: "../php/save_main_data.php", // Path to your PHP file
      type: "POST",
      data: { formDataArray: formDataArray }, // Send formDataArray to PHP file
      success: function (response) {
          // Display the response from the PHP file (if any)
          console.log(response);
      },
      error: function (xhr, status, error) {
          // Handle errors here
          console.error(xhr);
      }
  });
  
  if(formDataArray[10] == "0"){
    window.location.href = "../dashboard.html";
  }
  else{
    window.location.href = "../periods_contributory.html";
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
