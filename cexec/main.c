#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "structs.h"
#include "functions.h"

// Global var
float result;
float P_age_new = 0;
float P_age_old = 0;
float P_dis = 0;
float P_scion = 0;
int INFO = 1;
int INFO_d = 2;
int INFO_s = 3;

int main(int argc, char *argv[])
{
    // Struct arrays declarations
    registry user_data;
    admin constants;
    contributory *con_data;
    noncontributory *non_data;
    scion scion_data;
    funder funder_pen;
    funder_dis funder_pen_dis;

    // Getting the argument vectors ready
    if (argc != 3)
    {
        printf("Usage: %s <username> <additional_string>\n", argv[0]);
        return 1;
    }

    char *username = argv[1];
    char *additional_string = argv[2];

    int underage = 0;
    float V;

    // Setting up the locations of the files from the data base
    char *path_admin = "D:\\individual_work\\admin\\constants.txt";

    char *path_matrix = "D:\\individual_work\\admin\\k_vi.txt";

    char path_user_login[100];
    char path_con_data[100];
    char path_salary_data[100];
    char path_non_data[100];
    char path_age_lim_pen[100];
    char path_scion_data[100];
    char path_funder[100];
    char path_funder_dis[100];
    char path_scion_dis[100];
#define BASE_PATH "D:\\individual_work\\users\\%s\\"

    int non_data_exist = 1;
    sprintf(path_user_login, BASE_PATH "user_login.txt", username);
    sprintf(path_con_data, BASE_PATH "data_period.txt", username);
    sprintf(path_salary_data, BASE_PATH "data_salary.txt", username);
    sprintf(path_age_lim_pen, BASE_PATH "age_lim_pen.txt", username);
    sprintf(path_scion_data, BASE_PATH "data_scion.txt", username);

    float *K_vi = (float *)malloc(676 * sizeof(float));

    file_to_array_f(path_matrix, K_vi, 676);

    // Counting the number of lines in each text file aka amount of elements
    int lines_data_period = count_lines(path_con_data) + 1;
    int lines_data_salary = count_lines(path_salary_data) + 1;
    float *new_array = (float *)malloc(sizeof(float));
    int *array_months = (int *)malloc(sizeof(int));
    float *percentage = (float *)malloc(sizeof(float));
    float *salaries_taxes = (float *)malloc(sizeof(float));
    int *array_months_n = (int *)malloc(sizeof(int));

    // Preping the non-contributory data for computations
    int *non_data_array = NULL;
    read_user_login(&user_data, path_user_login);
    int consider_non_data = 0;
    if (user_data.profile.consider_non == 1)
    {
        sprintf(path_non_data, BASE_PATH "data_noncontributory.txt", username);
        int lines_non = count_lines(path_non_data);
        non_data_array = (int *)malloc(lines_non * sizeof(int));
        consider_non_data = 1;
        file_to_array(path_non_data, non_data_array, lines_non);
    }

    read_admin(&constants, path_admin);
    int empty_dis = 0;
    if (atoi(additional_string) == 3)
    {
        read_scion_data(&scion_data, path_scion_data);
        // For descendant pension
        sprintf(path_funder, BASE_PATH "age_lim_pen.txt", scion_data.username);
        if (!file_exists_and_not_empty(path_funder))
        {
            printf("Error: The funder's pension file age_lim_pen.txt does not exist or is empty.\n");

            return 1; // Exiting the program with an error code
        }
        sprintf(path_scion_dis, BASE_PATH "user_login.txt", scion_data.username);
        if (!file_exists_and_not_empty(path_scion_dis))
        {
            printf("Error: The funder's pension file age_lim_pen.txt does not exist or is empty.\n");

            return 1; // Exiting the program with an error code
        }
        sprintf(path_funder_dis, BASE_PATH "disability_pen.txt", scion_data.username);
        if (!file_exists_and_not_empty(path_funder))
        {
            printf("Error: The funder's pension file disability_pen.txt does not exist or is empty.\n");
            empty_dis = 1;
        }

        // Computing the descendant pension
        read_scion_dis(&scion_data, path_scion_dis);
        read_funder_pen(&funder_pen, path_funder);

        // Setting the right rate for the formula
        float scion_rate = 0;
        if (scion_data.type == 2)
        {
            scion_rate = 0.75;
        }
        else if ((scion_data.type == 3))
        {
            scion_rate = 0.5;
        }
        else if (scion_data.type == 4)
        {
            scion_rate = 0.5;
        }
        if (empty_dis == 0)
        {
            // The actual formula implementation
            read_funder_pen_dis(&funder_pen_dis, path_funder_dis);
            if (funder_pen.funder_pen > funder_pen_dis.funder_pen_dis)
            {
                P_scion = scion_rate * funder_pen.funder_pen;
            }
            else
            {
                P_scion = scion_rate * funder_pen_dis.funder_pen_dis;
            }
        }
        else
        {
            P_scion = scion_rate * funder_pen.funder_pen;
        }
        // Some data about the funder
        printf("\nThe funder's pension is: %f", funder_pen.funder_pen);
        printf("\nThe funder's Disability pension is: %f", funder_pen_dis.funder_pen_dis);
    }

    // Variables used in the V_av formula if we consider the non-contributory stages
    int index;
    int n_nc = 0;
    int n_m = 0;
    int n_b = 0;
    int e = 0;
    int d = 0;
    int f = 0;
    int S_min = 5000;
    int S_m = 11700;
    int T_potential_max = 0; //(years)
    int *array_months_non = NULL;
    int *holder_non = NULL;

    // Counting how many cases of specific criteria are met
    if (consider_non_data == 1)
    {
        int amount_non = non_data_array[0];
        non_data = (noncontributory *)malloc(amount_non * sizeof(noncontributory));
        read_non(non_data, non_data_array, amount_non);

        holder_non = malloc(amount_non * sizeof(int));

        array_months_non = (int *)malloc(sizeof(int));
        for (index = 0; index < amount_non; index++)
        {
            array_months_non[0] = -1;
            // Print the range of months into the array
            if ((non_data + index)->start_date.day >= (non_data + index)->end_date.day)
            {
                printDateRange(&array_months_non, (non_data + index)->start_date.day, (non_data + index)->start_date.month - 1, (non_data + index)->start_date.year, (non_data + index)->end_date.day, (non_data + index)->end_date.month - 2, (non_data + index)->end_date.year);
            }
            else
            {
                printDateRange(&array_months_non, (non_data + index)->start_date.day, (non_data + index)->start_date.month - 1, (non_data + index)->start_date.year, (non_data + index)->end_date.day, (non_data + index)->end_date.month - 1, (non_data + index)->end_date.year);
            }
            int size = 0;
            for (int j = 0; array_months_non[j] != -1; j++)
            {
                size += 1;
            }
            holder_non[index] = size;

            if ((non_data + index)->coef == 1 && ((e + d + f) < 96))
            {
                n_nc += size;
                e += size;
            }
            else if ((non_data + index)->coef == 5)
            {
                n_nc += size;
            }
            else if ((non_data + index)->coef == 2)
            {
                n_m += size;
            }
            else if ((non_data + index)->coef == 4 && ((e + d + f) < 96))
            {
                n_m += size;
                d += size;
            }
            else if ((non_data + index)->coef == 6 && ((e + d + f) < 96))
            {
                n_m += size;
                f += size;
            }
            else if ((non_data + index)->coef == 3)
            {
                n_b += size;
            }
        }
    }

    // Getting the contributory periods data ready
    int amount_con = user_data.profile.con_periods;
    con_data = (contributory *)malloc(amount_con * sizeof(contributory));

    int *periods = malloc(amount_con * sizeof(int)); // Array to store the number of months worked in each period
    float *V_av = malloc(amount_con * sizeof(float));
    double *salaries = malloc((lines_data_salary - 1 - amount_con) * sizeof(double));
    salary_data_split(path_salary_data, periods, salaries);

    int *con_data_array = (int *)malloc(lines_data_period * sizeof(int));
    file_to_array(path_con_data, con_data_array, lines_data_period - 1);
    read_con(con_data, con_data_array, amount_con, periods);

    // Get current date
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);
    int current_day = tm.tm_mday;
    int current_month = tm.tm_mon + 1;
    int current_year = tm.tm_year + 1900;

    // Calculating the age of the user
    int age = calculate_age(user_data.profile.birth_date.day, user_data.profile.birth_date.month, user_data.profile.birth_date.year,
                            current_day, current_month, current_year);

    if (age >= constants.min_age)
    {
        underage = 0;
    }
    else
    {
        underage = 1;
    }

    // In case the contributory stages are before 1999:
    int pension_year;
    pension_year = pension_date(&user_data, &constants, age);

    float *k_np_arr = malloc(amount_con * sizeof(float));
    for (int i = 0; i < amount_con; i++)
    {
        if ((con_data + i)->k_np <= 6)
        {
            k_np_arr[i] = 1.0;
        }
        else if ((con_data + i)->k_np <= 8 && (con_data + i)->k_np >= 7)
        {
            k_np_arr[i] = 1.2;
        }
        else if ((con_data + i)->k_np <= 10 && (con_data + i)->k_np >= 9)
        {
            k_np_arr[i] = 1.5;
        }
        else if ((con_data + i)->k_np == 11)
        {
            k_np_arr[i] = 1.8;
        }
        else if ((con_data + i)->k_np <= 13 && (con_data + i)->k_np >= 12)
        {
            k_np_arr[i] = 2.0;
        }
        else
        {
            k_np_arr[i] = 3.0;
        }
    }

    index = 0;

    // Checking how many years are before 1999 and how many are after
    float T_t = 0;
    for (int i = 0; i < amount_con; i++)
    {
    }
    for (int i = 0; i < amount_con; i++)
    {
        T_t += periods[i];
    }
    float T_temp = T_t;

    T_t /= 12;

    int a_99 = 0;
    int b_99 = 0;
    int T_min = 15; // years

    for (index = 0; index < amount_con; index++)
    {

        array_months_n[0] = -1;
        // Print the range of months into the array
        if ((con_data + index)->start_date.day >= (con_data + index)->end_date.day)
        {
            printDateRange(&array_months_n, (con_data + index)->start_date.day, (con_data + index)->start_date.month - 1, (con_data + index)->start_date.year, (con_data + index)->end_date.day, (con_data + index)->end_date.month - 2, (con_data + index)->end_date.year);
        }
        else
        {
            printDateRange(&array_months_n, (con_data + index)->start_date.day, (con_data + index)->start_date.month - 1, (con_data + index)->start_date.year, (con_data + index)->end_date.day, (con_data + index)->end_date.month - 1, (con_data + index)->end_date.year);
        }
        for (int i = 0; array_months_n[i] != -1; i++)
        {
            if (array_months_n[i] < 1999)
            {
                b_99 += 1;
                T_temp -= 1;
            }
            else
            {
                a_99 += 1;
            }
        }
    }
    float sum_per = 0;
    for (int b = 0; b < amount_con; b++)
    {
        sum_per += periods[b];
    }
    sum_per /= 12;

    // Criterias required for the disability pension, regarding how many contributory stages should be completed depending on the age
    int ages_of_disability[] = {0, 23, 29, 33, 37, 41, 999};
    int min_T_t[] = {2, 4, 7, 10, 13, 15};
    int zz = 0;
    int truee = 0;
    int approved = 0;
    for (int z = 1; z < 7; z++)
    {
        if (age >= ages_of_disability[z - 1] && age < ages_of_disability[z] && min_T_t[zz] <= sum_per)
        {
            truee = 1;
            if (truee == 1)
            {
                approved = 1;
                break;
            }
        }

        else
        {
        }
        zz += 1;
    }

    // Sorting out the disability grades and other stuff
    float disability_grade = 0;
    float disability_rate = 0;
    if (approved == 1)
    {
        // Getting the variables ready to be used in the formulas
        if (user_data.profile.dis_grade != 0)
        {
            if (user_data.profile.dis_grade == 1)
            {
                disability_grade = 0.2;
                disability_rate = 0.5;
            }
            else if (user_data.profile.dis_grade == 2)
            {
                disability_grade = 0.35;
                disability_rate = 0.7;
            }
            else if (user_data.profile.dis_grade == 3)
            {
                disability_grade = 0.42;
                disability_rate = 0.75;
            }
        }

        if (age >= 18)
        {
            T_potential_max = age - 18;
            if (T_potential_max > 40)
            {
                T_potential_max = 40;
            }
        }
        else
        {
            printf("\nYou cannot receive the disability pension as u are under age");
            INFO_d = 7;
        }
    }
    else
    {
        INFO_d = 4;
    }

    if ((b_99 > a_99) && (a_99 <= 60))
    {
        float P_age_old_temp = 0;
        for (int i = 0; i < amount_con; i++)
        {
            P_age_old_temp += constants.P_min * (T_t / (2 * T_min)) * k_np_arr[i];
            printf("\nP_age_old_temp: %f", P_age_old_temp);
        }
        P_age_old = P_age_old_temp / amount_con;

        if (sum_per < 2 && user_data.profile.dis_grade != 0)
        {
            P_dis = constants.P_min * disability_rate;
        }
    }
    else
    {
        // Some vars used to count
        int o = 0;
        int p = 0;
        int g = 0;
        int n_months = 0;

        printf("\nAge: %d", age);

        new_array = realloc(new_array, (lines_data_salary - 1 - amount_con) * sizeof(float));
        int first = 0;

        // The main for loop
        for (index = 0; index < amount_con; index++)
        {
            FILE *fp;

            int less_99 = 0;
            float C_i;

            array_months[0] = -1;

            if ((con_data + index)->start_date.day >= (con_data + index)->end_date.day)
            {
                printDateRange(&array_months, (con_data + index)->start_date.day, (con_data + index)->start_date.month - 1, (con_data + index)->start_date.year, (con_data + index)->end_date.day, (con_data + index)->end_date.month - 2, (con_data + index)->end_date.year);
            }
            else
            {
                printDateRange(&array_months, (con_data + index)->start_date.day, (con_data + index)->start_date.month - 1, (con_data + index)->start_date.year, (con_data + index)->end_date.day, (con_data + index)->end_date.month - 1, (con_data + index)->end_date.year);
            }
            int counter = 0;
            for (int i = 0; array_months[i] != -1; i++)
            {

                counter++;
            }

            percentage = realloc(percentage, ((con_data + index)->period_months) * sizeof(float));

            // Getting the percentage of taxes from salary depending on the year ready
            for (int i = 0; i < (con_data + index)->period_months; i++)
            {
                if (array_months[i] < 1999)
                {
                    percentage[i] = 0;
                    less_99 += 1;
                }
                else if (array_months[i] >= 1999 && array_months[i] <= 2003)
                {
                    percentage[i] = 0.01;
                }
                else if (array_months[i] >= 2004 && array_months[i] <= 2005)
                {
                    percentage[i] = 0.02;
                }
                else if (array_months[i] == 2006)
                {
                    percentage[i] = 0.03;
                }
                else if (array_months[i] == 2007)
                {
                    percentage[i] = 0.04;
                }
                else if (array_months[i] == 2008)
                {
                    percentage[i] = 0.05;
                }
                else if (array_months[i] >= 2009 && array_months[i] <= 2020)
                {
                    percentage[i] = 0.06;
                }
                else if (array_months[i] >= 2021 && array_months[i] <= 2024)
                {
                    percentage[i] = 0.24;
                }
            }

            salaries_taxes = realloc(salaries_taxes, (con_data + index)->period_months * sizeof(float));
            // Computing the paid taxes
            if (amount_con - 1 != index)
                for (int i = 0; i < (con_data + index)->period_months; i++)
                {
                    if (first == 0)
                    {
                        salaries_taxes[i] = salaries[i] * percentage[i];
                    }
                    else
                    {
                        salaries_taxes[i] = salaries[i + (con_data + index - 1)->period_months] * percentage[i];
                    }
                    o++;
                }
            else
            {

                int m = 0;
                for (int i = o + 1; i < (lines_data_salary - 1 - amount_con); i++)
                {
                    salaries_taxes[m] = salaries[i] * percentage[m];

                    m += 1;
                }
            }

            for (int i = 0; i < (con_data + index)->period_months; i++)
            {
                new_array[p] = salaries_taxes[i];
                p++;
            }

            if ((con_data + index)->end_date.year < 1999)
            {
                C_i = 0;
            }
            else if ((con_data + index)->end_date.year >= 1999 && (con_data + index)->end_date.year <= 2003)
            {
                C_i = 0.01;
            }
            else if ((con_data + index)->end_date.year >= 2004 && (con_data + index)->end_date.year <= 2005)
            {
                C_i = 0.02;
            }
            else if ((con_data + index)->end_date.year == 2006)
            {
                C_i = 0.03;
            }
            else if ((con_data + index)->end_date.year == 2007)
            {
                C_i = 0.04;
            }
            else if ((con_data + index)->end_date.year == 2008)
            {
                C_i = 0.05;
            }
            else if ((con_data + index)->end_date.year >= 2009 && (con_data + index)->end_date.year <= 2020)
            {
                C_i = 0.06;
            }
            else if ((con_data + index)->end_date.year >= 2021 && (con_data + index)->end_date.year <= 2024)
            {
                C_i = 0.24;
            }

            float CON_i = 0;
            for (int i = 0; i < (con_data + index)->period_months; i++)
            {
                CON_i += salaries_taxes[i];
            }

            // Computing the V_av variable
            if ((con_data + index)->start_date.year < 1999 || (con_data + index)->end_date.year < 1999)
            {
                V_av[index] = 0.0;
            }
            if (user_data.profile.consider_non == 1)
            {
                V_av[index] = ((CON_i / C_i) * K_vi[(abs(2024 - (con_data + index)->start_date.year - 25) * 26) + abs(2024 - (con_data + index)->end_date.year - 25)]);
            }
            else
            {
                V_av[index] = ((CON_i / C_i) * K_vi[(abs(2024 - (con_data + index)->start_date.year - 25) * 26) + abs(2024 - (con_data + index)->end_date.year - 25)]) / periods[index];
            }
            n_months += periods[index];
            first += 1;
        }
        int divider = amount_con;
        float V_av_avg = 0;
        for (int i = 0; i < amount_con; i++)
        {
            if (V_av[i] < 0.2)
            {
                divider -= 1;
            }
            V_av_avg += V_av[i];
        }
        V_av_avg /= divider;

        // Using the extended V_av formula in case non_contributory stages are considered
        if (user_data.profile.consider_non == 1)
        {
            float V_av_non = (V_av_avg + S_min * n_nc + S_m + n_m + 0 * n_b) / (n_months + n_nc + n_m + n_b);
            int sum_periods = n_months + n_nc + n_m + n_b;
            float T_t_non = sum_periods / 12;

            P_age_new = 0.0135 * T_t_non * V_av_non;

            if (P_age_new < constants.P_min && T_t_non >= 34)
            {
                P_age_new = constants.P_min;
            }
            else if (P_age_new < constants.P_min && T_t_non < 34 && T_t_non > T_min)
            {
                P_age_new = constants.P_min * (T_t_non / 34);
            }
            V = V_av_non;
        }
        else
        {
            P_age_new = 0.0135 * T_t * V_av_avg;
            if (P_age_new < constants.P_min && T_t >= 34)
            {
                P_age_new = constants.P_min;
            }
            else if (P_age_new < constants.P_min && T_t < 34 && T_t > T_min)
            {
                P_age_new = constants.P_min * (T_t / 34);
            }
            V = V_av_avg;
        }
    }

    if (sum_per < 2 && user_data.profile.dis_grade != 0)
    {
        P_dis = constants.P_min * disability_rate;
    }
    else if (user_data.profile.dis_grade == 1 || user_data.profile.dis_grade == 2 || user_data.profile.dis_grade == 3)
    {
        P_dis = disability_grade * V + (T_t / T_potential_max) * V * 0.1;
    }

    result = P_age_new + P_age_old;
    printf("\nP_new: %f", P_age_new);
    printf("\nP_old: %f", P_age_old);
    printf("\nAge Limit Pension: %f", result);
    printf("\nDis: %f", P_dis);

    free(k_np_arr);
    free(con_data_array);
    free(salaries);
    free(V_av);
    free(periods);
    free(con_data);
    free(array_months_non);
    free(holder_non);
    free(non_data);
    free(array_months_n);
    free(salaries_taxes);
    free(percentage);
    free(array_months);
    free(new_array);
    free(non_data_array);
    free(K_vi);

    // Saving the results of the computations into text files
    if (atoi(additional_string) == 1)
    {
        printToFile("../age_lim_pen.txt", result, INFO, V, user_data.profile.birth_date.day, user_data.profile.birth_date.day, pension_year);
    }
    else if (atoi(additional_string) == 2)
    {
        INFO_d = 2;
        printToFile("../disability_pen.txt", P_dis, INFO_d, V, user_data.profile.birth_date.day, user_data.profile.birth_date.day, pension_year);
    }
    else if (atoi(additional_string) == 3)
    {
        V = 0;
        printf("P_scion: %f", P_scion);
        printToFile("../scion_pen.txt", P_scion, INFO_s, V, user_data.profile.birth_date.day, user_data.profile.birth_date.day, pension_year);
    }
    else
    {
        printf("\nFatal Error! Failed to compute the pension");
    }
    return 0;
}
