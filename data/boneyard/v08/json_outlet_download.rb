require 'soda/client'
require 'json'

client = SODA::Client.new({:domain => "data.imls.gov", :app_token => "Q0kGme0P8YOPOAqZNNTPcTuAY"})

results = client.get("3qh2-qqv7", :$limit => 20000)

File.open("json/2016_library_outlets.json", "w") do |f|
  f.write(results.to_json)
end

# p results
=begin
puts "Got #{results.count} results. Dumping first results:"
results.first.each do |k, v|
  puts "#{k}: #{v}"
end
=end
