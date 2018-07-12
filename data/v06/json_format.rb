require 'json'
require 'pp'

infile = File.read("json/2016_library_systems.json")
fields_to_f = ["total_revenue", "total_staff_expenditures", "total_collection_expenditures", "total_capital_revenue", "capital_expenditures", "service_area_population", "hours", "visits", "references", "users", "total_circulation", "loans_to", "total_programs", "computers", "print_materials", "ebooks", "audio_materials", "video_materials", "total_databases", "print_serials", "mls_librarian_staff", "librarian_staff", "other_staff", "total_staff", "locale",  "local_capital_revenue", "state_capital_revenue", "federal_capital_revenue", "other_capital_revenue",    "unduplicated_population", "central_libraries", "branch_libraries", "bookmobiles", "loans_from", "audio_downloads", "video_downloads", "local_databases", "state_databases", "kids_programs", "ya_programs", "program_audience", "kids_program_audience", "ya_program_audience", "local_revenue", "state_revenue", "federal_revenue", "other_revenue", "salaries", "benefits", "print_expenditures", "electronic_expenditures", "other_collection_expenditures", "other_expenditures", "total_expenditures", "computer_uses", "wifi_sessions", "total_circulation", "kids_circulation", "electronic_content_uses", "physical_item_circulation", "electronic_info_retrievals", "electronic_content_uses", "total_circulation_retrievals", "county_population", "geocode_score" ]

json = JSON.parse(infile)

json.each do |el| 
  el.each do |k, v| 
    if fields_to_f.include?(k)
      el[k] = v.to_f
    end
  end
end


# Remove all records that have hours as -3
json.delete_if { |h| h["hours"] == -3 }

# Convert -1 to 'M'
json.each do |el|
  el.each do |k, v|
    if v == -1
      # p el["fscs_id"] + " " + k + " " + v.to_s
      el[k] = "M"
    end
  end
end


# Convert -9 to 'S'
json.each do |el|
  el.each do |k, v|
    if v == -9
      p el["fscs_id"] + " " + k + " - " + v.to_s
      el[k] = "S"
    end
  end
end

# Check if any entries are missing an fscs_id  
json.each do |el|
  if el["fscs_id"].length != 6
    p el["fscs_id"]
  end
end

# Convert locale code to strings 
locale_to_s = [ {[11,12,13] => "City"}, {[21,22,23] => "Suburban"}, {[31,32,33] => "Town"}, {[41,42,43] => "Rural"} ]

json.each do |el|
  locale = el["locale"]
  locale_to_s.each do |h|
    if(h.keys.flatten.include?(locale))
      $locale_string = h.values[0]
    end
  end
  el["locale_string"] = $locale_string
end

formatted_json = JSON.generate(json)

File.open("json/2016_library_systems_formatted.json", "w") do |f|
  f.write(formatted_json)
end

