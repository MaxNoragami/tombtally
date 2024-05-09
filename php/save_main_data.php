<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve the data_salary array
    $dataSalaryArray = $_POST['formDataArray'];

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
        // Construct the file path for data_salary.txt
        $filePath = $userFolder . '/user_login.txt';

        // Open the file for writing (append mode)
        $file = fopen($filePath, "a");

        // Write each element of the data_salary array to the file, separated by new lines
        foreach ($dataSalaryArray as $element) {
            fwrite($file, $element . "\n");
        }

        // Close the file
        fclose($file);

        // Echo a success message
        echo "Data has been successfully saved to user_login.txt.";
    } else {
        // Echo an error message if the user folder wasn't found
        echo "Error: User folder not found or 'temp.txt' file not found within.";
    }
}
?>
