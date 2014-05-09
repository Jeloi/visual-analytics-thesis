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
// Array that holds objects of the form {search_id: <id>, counts: <counts array>}
// search_counts = [];

// Key: Search id, Value: a hex color
search_colors = {};

// Object to hold keys of disabled searches
disabled_searches = {};

// Map brushed nodes
map_brush_data = []

// Weather object loaded on startup from csv
weather =[];

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

// Intervals for Ticks
interval6 = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168, 174, 180, 186, 192, 198, 204, 210, 216, 222, 228, 234, 240, 246, 252, 258, 264, 270, 276, 282, 288, 294, 300, 306, 312, 318, 324, 330, 336, 342, 348, 354, 360, 366, 372, 378, 384, 390, 396, 402, 408, 414, 420, 426, 432, 438, 444, 450, 456, 462, 468, 474, 480, 486, 492, 498, 504],
    interval12 = [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 336, 348, 360, 372, 384, 396, 408, 420, 432, 444, 456, 468, 480, 492, 504],
    interval24 = [0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336, 360, 384, 408, 432, 456, 480, 504];

full_interval = rangeArray(0,504);



