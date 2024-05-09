<?php
// Define the directory to search for temp.txt
$directory = '../users/';

// Function to recursively search for and delete temp.txt files
function deleteTempFiles($dir) {
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                deleteTempFiles($path);
            } else {
                if ($file == 'temp.txt') {
                    unlink($path); // Delete temp.txt file
                    echo "Deleted: $path <br>";
                }
            }
        }
    }
}

// Call the function to delete temp.txt files
deleteTempFiles($directory);
?>
