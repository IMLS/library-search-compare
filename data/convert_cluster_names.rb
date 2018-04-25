require 'csv'

infile = File.open("clusters/clusters_2_full_name.csv", "r")
outfile = File.open("clusters/fscs_cluster_data.csv", "w")

prefixes_arr = [
  { name: "Small", value: 100 },
  { name: "Medium", value: 200 },
  { name: "Large", value: 300 },
  { name: "VeryLarge", value: 400 }
]

prefixes = { "Small" => 100, "Medium" => 200, "Large" => 300, "VeryLarge" => 400 }

CSV.open(outfile, "w") do |out|
  CSV.foreach(infile, { :headers => true, :return_headers => false }) do |row|
    service_arr = row[1].split("_")
    staff_arr = row[2].split("_")
    finance_arr = row[3].split("_")
    collection_arr = row[4].split("_")

    service = prefixes[service_arr[0]] + service_arr[1].to_i
    staff = prefixes[staff_arr[0]] + staff_arr[1].to_i
    finance = prefixes[finance_arr[0]] + finance_arr[1].to_i
    collection = prefixes[collection_arr[0]] + collection_arr[1].to_i

    out << [row[0], service, staff, finance, collection]
  end
end
