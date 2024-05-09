from flask import Flask, request
from flask_cors import CORS, cross_origin
import subprocess
import os

app = Flask(__name__)
CORS(app, origins="*")  # Allow requests from all origins

@app.route('/execute_exe', methods=['POST'])
def execute_exe():
    username = request.form['username']
    additional_string = '1'  # New line to retrieve additional string
    print(username)
    print(additional_string)  # New line to print additional string
    
    exe_path = os.path.join('cexec', 'main.exe')  # Relative path to executable
    
    # Get the current directory of the Flask app
    current_directory = os.path.dirname(__file__)
    
    # Construct the absolute path
    absolute_path = os.path.join(current_directory, exe_path)
 
    # Execute the .exe file with the username and additional string as arguments
    subprocess.Popen([absolute_path, username, additional_string], shell=True)
    
    return 'Execution started'
 
@app.route('/execute_2_exe', methods=['POST'])
def execute_2_exe():
    username = request.form['username']
    additional_string = '2'  # New line to retrieve additional string
    print(username)
    print(additional_string)  # New line to print additional string
    
    exe_path = os.path.join('cexec', 'main.exe')  # Relative path to executable
    
    # Get the current directory of the Flask app
    current_directory = os.path.dirname(__file__)
    
    # Construct the absolute path
    absolute_path = os.path.join(current_directory, exe_path)
 
    # Execute the .exe file with the username and additional string as arguments
    subprocess.Popen([absolute_path, username, additional_string], shell=True)
    
    return 'Execution started'

@app.route('/execute_3_exe', methods=['POST'])
def execute_3_exe():
    username = request.form['username']
    additional_string = '3'  # New line to retrieve additional string
    print(username)
    print(additional_string)  # New line to print additional string
    
    exe_path = os.path.join('cexec', 'main.exe')  # Relative path to executable
    
    # Get the current directory of the Flask app
    current_directory = os.path.dirname(__file__)
    
    # Construct the absolute path
    absolute_path = os.path.join(current_directory, exe_path)
 
    # Execute the .exe file with the username and additional string as arguments
    subprocess.Popen([absolute_path, username, additional_string], shell=True)
    
    return 'Execution started'


if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Adjust port as needed
