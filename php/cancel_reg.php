<?php
// Function to recursively delete a directory and its contents
function deleteDirectory($dir) {
    if (!is_dir($dir)) return;
    $files = array_diff(scandir($dir), array('.', '..'));
    foreach ($files as $file) {
        $path = "$dir/$file";
        if (is_dir($path)) {
            deleteDirectory($path);
        } else {
            unlink($path);
        }
    }
    rmdir($dir);
}

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
                    $parentDirectory = dirname($path);
                    deleteDirectory($parentDirectory);
                    echo "Deleted: $parentDirectory<br>";
                }
            }
        }
    }
}

// Define the directory to search for temp.txt
$directory = '../users/';

// Call the function to delete temp.txt files and their parent directories
deleteTempFiles($directory);


?>
