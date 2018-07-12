require 'csv'

i = 1
CSV.foreach("input/raw_full.csv", "r") do |row|
  exit if i == 7
  p row
  i += 1
end
