<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ensure that the 'users' directory exists
    $usersFolderPath = '../users/';
    if (!is_dir($usersFolderPath)) {
        mkdir($usersFolderPath);
    }

    // Search for the user folder containing the 'temp.txt' file
    $userFolder = null;
    $userFolders = glob($usersFolderPath . '/*/temp.txt');
    if (!empty($userFolders)) {
        $userFolder = dirname(reset($userFolders));
        $username_login = basename($userFolder);
    }

    // Check if the user folder was found
    if ($userFolder && is_dir($userFolder)) {
        // Construct the file path
        $filePath = $userFolder . '/data_salary.txt';

        // Check if the file exists
        if (file_exists($filePath)) {
            // Read the file contents into an array
            $fileContents = file($filePath);

            // Initialize an array to hold the lines
            $lines = array();

            // Iterate through each line and add it to the array
            foreach ($fileContents as $line) {
                $lines[] = trim($line); // Trim to remove leading/trailing whitespace
            }

            // Encode the array as JSON
            $jsonResponse = json_encode($lines);

            // Echo the JSON response to be captured by JavaScript
            echo $jsonResponse;
        } else {
            // Echo an error message if the file doesn't exist
            echo "Error: The file does not exist.";
        }

        // Delete the temp.txt file
        // unlink($userFolder . '/temp.txt');
    } else {
        // Echo an error message if the user folder wasn't found
        echo "Error: User folder not found or 'temp.txt' file not found within.";
    }
}
?>
