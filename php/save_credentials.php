<?php
if(isset($_POST['submit'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Specify the folder path where user folders will be stored
    $usersFolderPath = '../users/';
    
    // Check if folder already exists with the same name as username
    $folderPath = $usersFolderPath . $username;
    if (is_dir($folderPath)) {
        // If folder exists, redirect to index.html
        header("Location: ../index.html");
        exit();
    }
    
    // Create the users folder if it doesn't exist
    if (!is_dir($usersFolderPath)) {
        mkdir($usersFolderPath);
    }
    
    // Create a folder with the username as the title inside the users folder
    mkdir($folderPath);
    
    // Append '.txt' to the username to create the filename
    $filename = $folderPath . '/' . 'user_login.txt';
    $temp = $folderPath . '/' . 'temp.txt';
    $tempf = fopen($temp, "a");
    fclose($tempf);
    // Open the text file for writing
    $file = fopen($filename, "a");
    
    // Write the username and password to the file
    fwrite($file, $username . "\n");
    fwrite($file, $password . "\n");
    
    // Close the file
    fclose($file);

    // Copy files from ../cexec/ folder to user's folder
    //$cexecFolder = '../cexec/';
    //$cexecFiles = scandir($cexecFolder);
    //foreach ($cexecFiles as $file) {
      //  if ($file != '.' && $file != '..') {
        //    copy($cexecFolder . $file, $folderPath . '/' . $file);
        //}
    //}
    
    header("Location: ../questions.html");
    exit();
}
?>
