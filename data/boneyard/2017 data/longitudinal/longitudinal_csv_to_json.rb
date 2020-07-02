require 'csv'
require 'json'
require 'charlock_holmes'
require 'fileutils'

@current_year = 2017
@current_csv = "PLS_FY17_AE_pud17i.csv"
@one_year_csv = "PLS_FY2016_AE_pupld16a_updated.csv"
@five_year_csv = "Pupld12a.csv"
@ten_year_csv = "pupld07.csv"
@combined_csv = "combined.csv"
@json = 'trends.json'
@json_pretty = 'trends_pretty.json'

@fields = {
  "FSCSKEY" => "fscs_id",
  "OTHPAID" => "other_staff",
  "TOTSTAFF" => "total_staff",
  "LIBRARIA" => "librarian_staff",
  "TOTINCM" => "total_revenue",
  "TOTOPEXP" => "total_expenditures",
  "BKVOL" => "print_materials",
  "EBOOK" => "ebooks",
  "AUDIO_PH" => "audio_materials",
  "AUDIO" => "audio_materials",
  "AUDIO_DL" => "audio_downloads",
  "VIDEO_PH" => "video_materials",
  "VIDEO" => "video_materials",
  "VIDEO_DL" => "video_downloads",
  "HRS_OPEN" => "hours",
  "VISITS" => "visits",
  "REFERENC" => "references",
  "TOTCIR" => "total_circulation",
  "KIDCIRCL" => "kids_circulation",
  "TOTPRO" => "total_programs",
  "TOTATTEN" => "program_audience",
  "GPTERMS" => "computers",
  "PITUSR" => "computer_uses"
}

# Functions
def encode_csv(file, csv_out)
  CSV.open(csv_out, "w", :write_headers => true) do |output|
    File.foreach(file) do |line|
      begin 
        detection = CharlockHolmes::EncodingDetector.detect(line)
        line = CharlockHolmes::Converter.convert line, detection[:encoding], 'UTF-8'
          CSV.parse(line) do |row|
            output << row
          end
      rescue => e
        p e.message
      end
    end
  end
  
  csv = CSV.read( csv_out, { headers: true, :encoding => 'UTF-8' } )
end

def swap_headers(headers, columns, suffix)
  headers.map { |h| columns.keys.include?(h) ? columns[h] + suffix : h }
end

def change_headers(file, column_names)
  csv = CSV.read(file)
  csv[0] = column_names
  csv[0][1] = "fscs_id"
  File.write(file, csv.map(&:to_csv).join)
end

def remove_columns( csv, suffix )
  new_cols = []
  @fields.values.each{ |col|
    #col != "fscs_id" ? new_cols.push( col + suffix ) : new_cols.push( col )
    new_cols.push( col != "fscs_id" ? col + suffix : col)
  }

  csv.headers.each { |col|
    unless new_cols.include?( col )
      csv.delete( col )
    end
  }
  csv
end

def remove_closed( file, suffix )
  csv = CSV.read(file, headers: true )
  csv.delete_if do |row|
    row["hours" + suffix] == "-3"
  end
  csv
end

def convert_suppressed( csv )
  csv.each { |row|
    row.each { |cell|
      if cell[1] == "-9"
        cell[1] = "S"
      end
    }
  }
end

def convert_missing( csv )
  csv.each { |row|
    row.each { |cell|
      if cell[1] == "-1"
        cell[1] = "M"
      end
    }
  }
end

def csv_to_json(file, json, json_pretty)
  rows = []
  CSV.foreach(file, headers: true) do |row|
    rows << row.to_hash
  end
  # rows.to_json
  File.write(json, rows.to_json)
  File.write(json_pretty, JSON.pretty_generate(rows))
end

# End functions

#csv_files = [ @current_csv, @one_year_csv ]
csv_files = [ @current_csv, @one_year_csv, @five_year_csv, @ten_year_csv ]

csv_files.each { |file|

  csv_out = file.split(/\./).first + '_working.csv'

  case csv_files.index(file)
  when 0
    suffix = "_0"
  when 1
    suffix = "_1"
  when 2
    suffix = "_5"
  when 3
    suffix = "_10"
  else
    p "longitudinal file error"
  end

  p suffix

  libraries = encode_csv(file, csv_out)
  new_cols = swap_headers( libraries.headers, @fields, suffix )
  change_headers( csv_out, new_cols )


  csv = remove_closed( csv_out, suffix )
  csv = remove_columns( csv, suffix )
  csv = convert_suppressed( csv )
  csv = convert_missing( csv )

  p csv.length

  File.write(csv_out, csv)

  if csv_files.index(file) == 0
    File.write(@combined_csv, csv) 
  else
    new_file = CSV.read(csv_out)

    all_headers = CSV.parse(File.open(@combined_csv, &:gets)).flatten
    p all_headers
    headers_in = File.open(csv_out, &:gets)
    headers_in = CSV.parse(headers_in.sub("fscs_id,", "")).flatten
    all_headers = all_headers | headers_in
    p all_headers
    p "------"

    match_arr = []
    CSV.open("temp.csv", "w") do |out|
      out << all_headers
      CSV.foreach(@combined_csv, headers: false) do |row|
        next if $. == 1
        match = new_file.assoc(row[0])
        if match.nil? 
          placeholder = Array.new(headers_in.length, "M")
          out << row + placeholder
        else
          match = match.drop(1)
          out << row + match
        end
      end
    end

    FileUtils.mv 'temp.csv', @combined_csv
  end

=begin
  if csv_files.index(file) == 0
    File.write(@combined_csv, csv)
  else
    combined_file = CSV.read(@combined_csv)
    file = CSV.read(csv_out)
    match_arr = []
    file.each do |line|
      match = combined_file.assoc(line[0])
      match_arr.push(match)
    end
    p match_arr[0]
    p match_arr.length

  end
=end

  
}

csv_to_json( @combined_csv, @json, @json_pretty )
