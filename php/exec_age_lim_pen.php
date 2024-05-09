<?php
// Get the username from POST data
$username = $_POST['username'];

// Define the path to the executable
$exe_path = "../users/$username/age_lim_pen.exe";

// Check if the file exists
if (file_exists($exe_path)) {
    // Execute the executable
    exec($exe_path, $output, $return_var);
    
    // Check if the execution was successful
    if ($return_var === 0) {
        echo "Execution successful!";
    } else {
        echo "Execution failed!";
    }
} else {
    echo "Executable file not found!";
}
?>
