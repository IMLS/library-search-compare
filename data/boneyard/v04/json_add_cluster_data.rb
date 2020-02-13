require 'csv'
require 'json'

infile = CSV.read("clusters/fscs_cluster_data.csv", "r")
json_file = File.read("json/2016_library_systems_formatted.json")
outfile = File.open("json/2016_library_systems_clusters.json", "w")

json = JSON.parse(json_file)

json.each do |el|
  cluster_data = infile.select{ |arr| arr[0] == el['fscs_id'] }.flatten
  el[:cluster_service] = cluster_data[1].to_i
  el[:cluster_staff] = cluster_data[2].to_i
  el[:cluster_finance] = cluster_data[3].to_i
  el[:cluster_collection] = cluster_data[4].to_i
  el[:total_staff_expenditures_mean] = cluster_data[5].to_i
  el[:total_staff_expenditures_percentile] = cluster_data[6].to_i
end

formatted_json = JSON.generate(json)

File.open(outfile, "w") do |f|
  f.write(formatted_json)
end
