#ifndef STRUCTS_H
#define STRUCTS_H

// User_login struct
typedef struct
{
    struct
    {
        char *username;
        char *password;
    } login;

    struct
    {
        char *name;
        char *surname;
        struct
        {
            int day;
            int month;
            int year; // max 2090
        } birth_date;
        char *phone;
        int dis_grade;
        struct
        {
            int day;
            int month;
            int year; // max 2090
        } dis_date;
        int con_periods;
        int consider_non;
    } profile;
} registry;

// data_scion struct
typedef struct
{
    char *username;
    int type;
    int dis_grade;
} scion;

typedef struct
{
    float funder_pen;
} funder;

typedef struct
{
    float funder_pen_dis;
} funder_dis;

// Admin constants struct
typedef struct
{
    int min_age;
    float P_min;
} admin;

// Contributory data struct
typedef struct
{
    struct
    {
        int day;
        int month;
        int year;
    } start_date;

    struct
    {
        int day;
        int month;
        int year;
    } end_date;

    int k_np;
    int period_months;
} contributory;

typedef struct
{
    struct
    {
        int day;
        int month;
        int year;
    } start_date;

    struct
    {
        int day;
        int month;
        int year;
    } end_date;
    int coef;
} noncontributory;

#endif