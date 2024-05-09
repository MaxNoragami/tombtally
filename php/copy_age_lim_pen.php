<?php
// Get the username from the AJAX request
$username = $_POST['username'];

// Define the paths
$source = '../age_lim_pen.txt'; // Source file
$destination = "../users/$username/age_lim_pen.txt"; // Destination file

// Debugging: Print out the paths
echo "Source: $source<br>";
echo "Destination: $destination<br>";

// Check if the source file exists
if (!file_exists($source)) {
    echo "Source file does not exist.";
    exit;
}

// Cut and paste the file
if (rename($source, $destination)) {
    echo "File moved successfully.";
} else {
    echo "Failed to move the file.";
}
?>
