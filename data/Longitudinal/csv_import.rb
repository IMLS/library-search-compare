require 'csv'
require 'json'

infile = CSV.read("data/trends_data.csv", "r")
outfile = File.open("json/imported_trends_data.json", "w")


