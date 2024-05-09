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
    }

    // Check if the user folder was found
    if ($userFolder && is_dir($userFolder)) {
        // Construct the file path
        $filePath = $userFolder . '/user_login.txt';

        // Check if the file exists
        if (file_exists($filePath)) {
            // Read the file contents into an array
            $fileContents = file($filePath);

            // Check if the file has at least 13 lines
            if (count($fileContents) >= 13) {
                // Get the value from line 13 (index 12)
                $amountOfPeriods = trim($fileContents[13]); // Trim to remove leading/trailing whitespace

                // Echo the value to be captured by JavaScript
                echo "<script>var amount_of_periods = '$amountOfPeriods';</script>";
            } else {
                // Echo an error message if the file doesn't have enough lines
                echo "Error: The file does not have enough lines.";
            }
        } else {
            // Echo an error message if the file doesn't exist
            echo "Error: The file does not exist.";
        }
    } else {
        // Echo an error message if the user folder wasn't found
        echo "Error: User folder not found or 'temp.txt' file not found within.";
    }
}
?>
