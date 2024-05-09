#ifndef FUNCTIONS_H
#define FUNCTIONS_H

// Function to print the contents of a file
void print_file_content(char *path)
{
    FILE *file = fopen(path, "rb+");
    if (file == NULL)
    {
        printf("Error opening file %s\n", path);
        exit(1);
    }

    int c;
    while ((c = fgetc(file)) != EOF)
    {
        putchar(c);
    }

    fclose(file);
}

// Function to count the number of lines in a file
int count_lines(char *filename)
{
    FILE *file = fopen(filename, "r");
    if (file == NULL)
    {
        printf("Error opening file %s\n", filename);
        return -1; // Return -1 to indicate failure
    }

    int count = 0;
    int ch;

    // Loop until end of file
    while ((ch = fgetc(file)) != EOF)
    {
        if (ch == '\n')
        {
            count++; // Increment count for each newline character
        }
    }

    // Close the file
    fclose(file);

    return count;
}

// Function to read user_login.txt and insert data into the struct
void read_user_login(registry *user_data, const char *filename)
{
    FILE *file = fopen(filename, "r");
    if (file == NULL)
    {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    char line[100];
    int line_count = 0;

    // Read each line and parse the data into struct elements
    while (fgets(line, sizeof(line), file) != NULL && line_count < 15)
    {
        // Remove trailing newline character
        if (line[strlen(line) - 1] == '\n')
        {
            line[strlen(line) - 1] = '\0';
        }

        // Skip empty lines
        if (strcmp(line, "") == 0)
        {
            continue;
        }

        // Insert data into struct based on the line count
        switch (line_count)
        {
        case 0:
            user_data->login.username = strdup(line);
            break;
        case 1:
            user_data->login.password = strdup(line);
            break;
        case 2:
            user_data->profile.name = strdup(line);
            break;
        case 3:
            user_data->profile.surname = strdup(line);
            break;
        case 4:
            user_data->profile.birth_date.day = atoi(line);
            break;
        case 5:
            user_data->profile.birth_date.month = atoi(line);
            break;
        case 6:
            user_data->profile.birth_date.year = atoi(line);
            break;
        case 7:
            user_data->profile.phone = strdup(line);
            break;
        case 8:
            user_data->profile.dis_grade = atoi(line);
            break;
        case 9:
            user_data->profile.dis_date.day = atoi(line);
            break;
        case 10:
            user_data->profile.dis_date.month = atoi(line);
            break;
        case 11:
            user_data->profile.dis_date.year = atoi(line);
            break;
        case 12:
            user_data->profile.con_periods = atoi(line);
            break;
        case 13:
            user_data->profile.consider_non = atoi(line);
            break;
        }

        line_count++;
    }

    fclose(file);
}

void salary_data_split(char *filename, int periods[], double salaries[])
{

    FILE *file = fopen(filename, "r");
    int num_periods = 0;
    int num_months = 0;
    double salary;
    int salary_index = 0;

    // Skip the numbers representing the periods
    while (fscanf(file, "%d", &num_months) != EOF)
    {
        for (int i = 0; i < num_months; i++)
        {
            if (fscanf(file, "%lf", &salary) == EOF)
            {
                break;
            }
            periods[num_periods] = num_months; // Store the number of months for this period
            salary_index++;                    // Count the number of salaries
        }
        // printf("%d\n", periods[num_periods]);
        num_periods++; // Move to the next period
    }

    // Reset the file pointer to read salaries again
    fseek(file, 0, SEEK_SET);

    int k = 0;
    // Skip the numbers representing the periods
    while (fscanf(file, "%d", &num_months) != EOF)
    {
        for (int i = 0; i < num_months; i++)
        {
            if (fscanf(file, "%lf", &salary) == EOF)
            {
                break;
            }

            // Print or store the salary here as needed
            salaries[k] = salary;
            k++;
        }
        num_months++;
    }

    fclose(file);
}

// Function to read user_login.txt and insert data into the struct
void read_con(contributory *con_data, int *array, int n, int *periods)
{
    int index = 0;
    for (int i = 0; i < n; i++)
    {
        (con_data + i)->start_date.day = *(array + index);
        (con_data + i)->start_date.month = *(array + index + 1);
        (con_data + i)->start_date.year = *(array + index + 2);
        (con_data + i)->end_date.day = *(array + index + 3);
        (con_data + i)->end_date.month = *(array + index + 4);
        (con_data + i)->end_date.year = *(array + index + 5);
        (con_data + i)->k_np = *(array + index + 6);
        (con_data + i)->period_months = *(periods + i);
        index += 7;
    }
}

void read_non(noncontributory *non_data, int *array, int n)
{
    int index = 0;
    for (int i = 0; i < n; i++)
    {
        (non_data + i)->start_date.day = *(array + index + 1);
        (non_data + i)->start_date.month = *(array + index + 2);
        (non_data + i)->start_date.year = *(array + index + 3);
        (non_data + i)->end_date.day = *(array + index + 4);
        (non_data + i)->end_date.month = *(array + index + 5);
        (non_data + i)->end_date.year = *(array + index + 6);
        (non_data + i)->coef = *(array + index + 7);
        index += 7;
    }
}

void file_to_array(char *filename, int *array, int n)
{
    FILE *file = fopen(filename, "r");

    char line[100]; // assuming each line contains at most 100 characters
    int index = 0;

    while (fgets(line, sizeof(line), file) != NULL && index < n)
    {
        // Convert the line to an integer using atoi() and insert into the array
        array[index] = atoi(line);
        index++;
    }

    fclose(file);
}

void file_to_array_f(char *filename, float *array, int n)
{
    FILE *file = fopen(filename, "r");

    char line[100]; // assuming each line contains at most 100 characters
    int index = 0;

    while (fgets(line, sizeof(line), file) != NULL && index < n)
    {
        // Convert the line to an integer using atoi() and insert into the array
        array[index] = atof(line);
        index++;
    }

    fclose(file);
}

// Function to read user_login.txt and insert data into the struct
void read_admin(admin *constants, const char *filename)
{
    FILE *file = fopen(filename, "r");
    if (file == NULL)
    {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    char line[100];
    int line_count = 0;

    // Read each line and parse the data into struct elements
    while (fgets(line, sizeof(line), file) != NULL && line_count < 2)
    {
        // Remove trailing newline character
        if (line[strlen(line) - 1] == '\n')
        {
            line[strlen(line) - 1] = '\0';
        }

        // Skip empty lines
        if (strcmp(line, "") == 0)
        {
            continue;
        }

        // Insert data into struct based on the line count
        switch (line_count)
        {
        case 0:
            constants->min_age = atoi(line);
            break;
        case 1:
            constants->P_min = atof(line);
            break;
        }

        line_count++;
    }

    fclose(file);
}

// Function to read user_login.txt and insert data into the struct
void read_scion_data(scion *scion_data, const char *filename)
{
    FILE *file = fopen(filename, "r");
    if (file == NULL)
    {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    char line[100];
    int line_count = 0;

    // Read each line and parse the data into struct elements
    while (fgets(line, sizeof(line), file) != NULL && line_count < 2)
    {
        // Remove trailing newline character
        if (line[strlen(line) - 1] == '\n')
        {
            line[strlen(line) - 1] = '\0';
        }

        // Skip empty lines
        if (strcmp(line, "") == 0)
        {
            continue;
        }

        // Insert data into struct based on the line count
        switch (line_count)
        {
        case 0:
            scion_data->username = strdup(line);
            break;
        case 1:
            scion_data->type = atoi(line);
            break;
        }

        line_count++;
    }

    fclose(file);
}

void read_scion_dis(scion *scion_data, const char *filename)
{
    FILE *file = fopen(filename, "r");
    if (file == NULL)
    {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    char line[100];
    int line_count = 0;

    // Read each line and parse the data into struct elements
    while (fgets(line, sizeof(line), file) != NULL && line_count < 1)
    {
        // Remove trailing newline character
        if (line[strlen(line) - 1] == '\n')
        {
            line[strlen(line) - 1] = '\0';
        }

        // Skip empty lines
        if (strcmp(line, "") == 0)
        {
            continue;
        }

        // Insert data into struct based on the line count
        switch (line_count)
        {
        case 0:
            scion_data->dis_grade = atoi(line);
            break;
        }

        line_count++;
    }

    fclose(file);
}

// Function to read user_login.txt and insert data into the struct
void read_funder_pen(funder *funder_pen, const char *filename)
{
    FILE *file = fopen(filename, "r");
    if (file == NULL)
    {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    char line[100];
    int line_count = 0;

    // Read each line and parse the data into struct elements
    while (fgets(line, sizeof(line), file) != NULL && line_count < 1)
    {
        // Remove trailing newline character
        if (line[strlen(line) - 1] == '\n')
        {
            line[strlen(line) - 1] = '\0';
        }

        // Skip empty lines
        if (strcmp(line, "") == 0)
        {
            continue;
        }

        // Insert data into struct based on the line count
        switch (line_count)
        {
        case 0:
            funder_pen->funder_pen = atof(line);
            break;
        }

        line_count++;
    }

    fclose(file);
}

// Function to read user_login.txt and insert data into the struct
void read_funder_pen_dis(funder_dis *funder_pen_dis, const char *filename)
{
    FILE *file = fopen(filename, "r");
    if (file == NULL)
    {
        printf("Error opening file %s\n", filename);
        exit(1);
    }

    char line[100];
    int line_count = 0;

    // Read each line and parse the data into struct elements
    while (fgets(line, sizeof(line), file) != NULL && line_count < 1)
    {
        // Remove trailing newline character
        if (line[strlen(line) - 1] == '\n')
        {
            line[strlen(line) - 1] = '\0';
        }

        // Skip empty lines
        if (strcmp(line, "") == 0)
        {
            continue;
        }

        // Insert data into struct based on the line count
        switch (line_count)
        {
        case 0:
            funder_pen_dis->funder_pen_dis = atof(line);
            break;
        }

        line_count++;
    }

    fclose(file);
}

void print_struct_admin(admin *constants)
{
    // Print the user data to verify
    printf("Min age: %d\n", constants->min_age);
    printf("Min pension 2024: %f\n", constants->P_min);
}

void print_struct_scion_data(scion *scion_data)
{
    // Print the user data to verify
    printf("Funder's username: %s\n", scion_data->username);
    printf("Type: %d\n", scion_data->type);
}

void print_struct_user_login(registry *user_data)
{
    // Print the user data to verify
    printf("Username: %s\n", user_data->login.username);
    printf("Password: %s\n", user_data->login.password);
    printf("Name: %s\n", user_data->profile.name);
    printf("Surname: %s\n", user_data->profile.surname);
    printf("Birth Date: %d/%d/%d\n", user_data->profile.birth_date.day, user_data->profile.birth_date.month, user_data->profile.birth_date.year);
    printf("Phone: %s\n", user_data->profile.phone);
    printf("Disability Grade: %d\n", user_data->profile.dis_grade);
    printf("Disability Date: %d/%d/%d\n", user_data->profile.dis_date.day, user_data->profile.dis_date.month, user_data->profile.dis_date.year);
    printf("Consecutive Periods: %d\n", user_data->profile.con_periods);
    printf("Consider Non: %d\n", user_data->profile.consider_non);
}

void print_struct_con(contributory *con_data, int n)
{
    for (int i = 0; i < n; i++)
    {
        // Print the user data to verify
        printf("Start Day: %d\n", (con_data + i)->start_date.day);
        printf("Start Month: %d\n", (con_data + i)->start_date.month);
        printf("Start Year: %d\n", (con_data + i)->start_date.year);
        printf("End Day: %d\n", (con_data + i)->end_date.day);
        printf("End Month: %d\n", (con_data + i)->end_date.month);
        printf("End Year: %d\n", (con_data + i)->end_date.year);
        printf("K_np: %d\n", (con_data + i)->k_np);
        printf("Period Months: %d\n", (con_data + i)->period_months);
    }
}

void print_struct_non(noncontributory *non_data, int n)
{
    for (int i = 0; i < n; i++)
    {
        // Print the user data to verify
        printf("Non Start Day: %d\n", (non_data + i)->start_date.day);
        printf("Non Start Month: %d\n", (non_data + i)->start_date.month);
        printf("Non Start Year: %d\n", (non_data + i)->start_date.year);
        printf("Non End Day: %d\n", (non_data + i)->end_date.day);
        printf("Non End Month: %d\n", (non_data + i)->end_date.month);
        printf("Non End Year: %d\n", (non_data + i)->end_date.year);
        printf("Non Coef: %d\n", (non_data + i)->coef);
    }
}

int file_exists_and_not_empty(const char *path)
{
    FILE *file = fopen(path, "r");
    if (file)
    {
        fseek(file, 0, SEEK_END);
        if (ftell(file) > 0)
        {
            fclose(file);
            return 1; // File exists and is not empty
        }
        fclose(file);
    }
    return 0; // File does not exist or is empty
}

// Function to calculate age in years
int calculate_age(int birth_day, int birth_month, int birth_year, int current_day, int current_month, int current_year)
{
    int age = current_year - birth_year;
    if (current_month < birth_month || (current_month == birth_month && current_day < birth_day))
    {
        age--;
    }
    return age;
}

int pension_date(registry *user_data, admin *constants, int age)
{
    return user_data->profile.birth_date.year + age + constants->min_age - age;
}

// Function to print the array of salary periods
void print_salary_periods(int *salary_periods, int num_periods)
{
    printf("Number of periods: %d\n", num_periods);
    for (int i = 0; i < num_periods; i++)
    {
        printf("Period %d: %d months/salaries\n", i + 1, salary_periods[i]);
    }
}

// Function to print the range of months between two dates into an array
void printDateRange(int **array_months, int start_day, int start_month, int start_year, int end_day, int end_month, int end_year)
{
    // Initialize variables to keep track of the current year and month
    int current_year = start_year;
    int current_month = start_month;

    // Initialize array size and month counter
    int array_size = 0;
    int month_counter = 0;

    // Loop through each month between the start and end dates
    while ((current_year < end_year) || (current_year == end_year && current_month <= end_month))
    {
        // If the month changes, print the new month
        // If the year changes, print the new year
        if (current_month == 11)
        {
            current_year++;
        }
        (*array_months)[array_size++] = current_year; // Adding 1 to month to match standard month numbering (1-12)

        // Update the current month
        current_month = (current_month + 1) % 12; // Wrap around to January if December is reached
        month_counter++;

        // Resize the array to accommodate more months
        *array_months = (int *)realloc(*array_months, (array_size + 1) * sizeof(int));
    }

    // Add a sentinel value at the end of the array to mark its end
    (*array_months)[array_size] = -1; // Assuming -1 is not a valid month
}

void printToFile(char *filename, float P, int INFO, float V, int day, int month, int year)
{
    FILE *file = fopen(filename, "w");
    if (file == NULL)
    {
        printf("Error opening file %s\n", filename);
    }

    fprintf(file, "%.2f\n", P);                          // First line: P
    fprintf(file, "%d\n", INFO);                         // Second line: INFO
    fprintf(file, "%.2f\n", V);                          // Third line: V
    fprintf(file, "%02d-%02d-%04d\n", day, month, year); // Fourth line: Date of Birth
    fclose(file);
}

#endif