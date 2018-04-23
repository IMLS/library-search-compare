require 'json'
require 'pp'

infile = File.read("json/2016_library_systems.json")
fields_to_f = ["total_revenue", "total_staff_expenditures", "total_collection_expenditures", "total_capital_revenue", "capital_expenditures", "service_area_population", "hours", "visits", "references", "users", "total_circulation", "loans_to", "total_programs", "computers", "print_materials", "ebooks", "audio_materials", "video_materials", "total_databases", "print_serials", "mls_librarian_staff", "libraran_staff", "other_staff", "total_staff", "locale"]

json = JSON.parse(infile)

json.each do |el| 
  el.each do |k, v| 
    if fields_to_f.include?(k)
      el[k] = v.to_f
    end
  end
end

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

