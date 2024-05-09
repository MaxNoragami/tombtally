<?php
if(isset($_POST['submit'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Specify the folder path where user folders will be stored
    $usersFolderPath = '../users/';
    
    
    // Create a folder with the username as the title inside the users folder
    $folderPath = $usersFolderPath . $username;
    
    // Check if user_login.txt exists and contains the correct credentials
    $filename = $folderPath . '/' . 'user_login.txt';
    if (file_exists($filename)) {
        $fileContents = file($filename, FILE_IGNORE_NEW_LINES);
        if ($fileContents[0] === $username && $fileContents[1] === $password) {
            // Credentials match, create temp.txt without recreating user_login.txt
            $tempFilePath = $folderPath . '/temp.txt';
            touch($tempFilePath); // Create temp.txt if it doesn't exist
            header("Location: ../dashboard.html");
            exit();
        }
    
    }
    header("Location: ../signup.html");
    exit();
}
?>
