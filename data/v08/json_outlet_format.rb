require 'json'
require 'pp'

infile = File.read("json/2016_library_outlets.json")
fields_to_f = ["sq_feet", "bookmobiles", "hours", "weeks_open", "county_population", "geocode_score" ]

json = JSON.parse(infile)

json.each do |el| 
  el.each do |k, v| 
    if fields_to_f.include?(k)
      el[k] = v.to_f
    end
  end
end

# Remove all records that have hours as -3
# json.delete_if { |h| h["hours"] == -3 }

# Check if any entries are missing an fscs_id  
json.each do |el|
  if el["fscs_id"].length != 6
    p el["fscs_id"]
  end
end

formatted_json = JSON.generate(json)

File.open("json/2016_library_outlets_formatted.json", "w") do |f|
  f.write(formatted_json)
end

