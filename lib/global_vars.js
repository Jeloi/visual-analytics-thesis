/*
	Global Variables
*/

// Start date_time. Used for converting hour <-> Date
start_date_time = new Date(2011, 3, 30); // start_date, index 0

// number of hours (21 days * 24)
num_hours = 504;

// Holds all the data, binned by hour [{hour_index: 1, array: [microblogs, microblog..]}]
hours_data = {};

// Holds the count for each hour_index [{hour_index: 1, count: 2036}]
hour_counts = [];

// Key: Search id, Value: hours_data for a search
search_data = {};

// Key: Search id, Value: hour_counts for a search
search_counts = {};

// Key: Search id, Value: a hex color
search_colors = {};


// Map Dimensions (global variables)
map_width = 1200;
map_height = 610.375;
timeline_height = 100;

// Top left corner
latitude_1 = 42.3017,
longitude_1 = 93.5673;

// Bottom right corner
latitude_2 = 42.1609,
longitude_2 = 93.1923;

hospital_coords = [[42.1656,93.3432],[42.1718,93.3911],[42.2023,93.4448],[42.2011,93.4954],[42.2020,93.5570],[42.2539,93.4789],[42.2969,93.5317],[42.2503,93.4192],[42.2832,93.3645],[42.2916,93.2342],[42.2170,93.2479],[42.2378,93.3307],[42.2131,93.3611]];

colors = ["orange", "blue", "green", "red", "purple", "yellow", "aqua", "pink", "brown", "peach"];



