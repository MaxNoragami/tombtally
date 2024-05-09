<?php
// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if username is sent in the POST data
    if (isset($_POST["username"])) {
        // Get the username from the POST data
        $username = $_POST["username"];
        
        // Directory where user files are stored
        $userDir = "../users/" . $username . "/";
        
        // File path to the text file to be deleted
        $filePath = $userDir . "temp.txt";
        
        // Check if the file exists
        if (file_exists($filePath)) {
            // Attempt to delete the file
            if (unlink($filePath)) {
                // File deleted successfully
                echo "File deleted successfully.";
            } else {
                // Error occurred while deleting the file
                http_response_code(500);
                echo "Error: Unable to delete file.";
            }
        } else {
            // File does not exist
            http_response_code(404);
            echo "Error: File does not exist.";
        }
    } else {
        // Username is not provided
        http_response_code(400);
        echo "Error: Username not provided.";
    }
} else {
    // Invalid request method
    http_response_code(405);
    echo "Error: Method Not Allowed.";
}
?>
