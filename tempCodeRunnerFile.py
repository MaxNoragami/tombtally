from flask import Flask, request
from flask_cors import CORS, cross_origin
import subprocess
import os
import ctypes


app = Flask(__name__)
CORS(app, origins="*")  # Allow requests from all origins

@app.route('/execute_exe', methods=['POST'])
def execute_exe():
    username = request.form['username']
    print(username)

    # Change the working directory to "D:\individual_work\users\user_test\"
    user_dir = os.path.join('D:\\individual_work\\users', username)

    # Check if the directory exists, if not, create it
    if not os.path.exists(user_dir):
        os.makedirs(user_dir)

    # Execute the compiled program with the username as an argument
    subprocess.run(['D:\\individual_work\\users\\user_test\\age_lim_pen.exe', username])

    # Load the computed value from the text file
    file_path = os.path.join(user_dir, 'age_lim_pen.txt')  # Path to the text file
    with open(file_path, 'r') as f:
        computed_value = f.read()

    # Print the computed value
    print("Computed value:", computed_value)

    

    return 'Execution started'
