require 'csv'
require 'json'
require 'charlock_holmes'

@csv_file = 'PLS_FY17_Outlet_pud17i.csv'
@csv_out = @csv_file.split(/\./).first + '_working.csv'
@json = 'outlets.json'
@json_pretty = 'outlets_pretty.json'

@fields_to_i = ["sq_feet", "bookmobiles", "hours", "weeks_open", "county_population" ]
@convert_fields = [ "hours", "weeks_open", "bookmobiles", "sq_feet" ]

@fields = {
  "STABR" => "state",
  "FSCSKEY" => "fscs_id",
  "FSCS_SEQ" => "fscs_id_seq",
  "C_FSCS" => "c_fscs",
  "LIBID" => "library_id",
  "LIBNAME" => "library_name",
  "ADDRESS" => "address",
  "CITY" => "city",
  "ZIP" => "mailing_zip",
  "ZIP4" => "zip_4",
  "CNTY" => "county",
  "PHONE" => "phone",
  "C_OUT_TY" => "outlet_type",
  "SQ_FEET" => "sq_feet",
  "L_NUM_BM" => "bookmobiles",
  "HOURS" => "hours",
  "WKS_OPEN" => "weeks_open",
  "YR_SUB" => "year",
  "STATSTRU" => "structure_change",
  "STATNAME" => "name_change",
  "STATADDR" => "address_change",
  "LONGITUD" => "longitude",
  "LATITUDE" => "latitude",
  "INCITSST" => "incits_state_code",
  "INCITSCO" => "incits_county_code",
  "GNISPLAC" => "gnis_id",
  "CNTYPOP" => "county_population",
  "LOCALE" => "locale",
  "REAPLOCALE" => "reap_locale",
  "CENTRACT" => "census_tract",
  "CENBLOCK" => "census_block",
  "CDCODE" => "congressional_district",
  "CBSA" => "cbsa",
  "MICROF" => "metro_micro_area",
  "GEOMATCH" => "geocoding_accuracy"
}

# Functions
def encode_csv(file)
  CSV.open(@csv_out, "w", :write_headers => true) do |output|
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
  
  csv = CSV.read( @csv_out, { headers: true, :encoding => 'UTF-8' } )
end

def swap_headers(headers, columns)
  headers.map { |h| columns.keys.include?(h) ? columns[h] : h }
end

def change_headers(file, column_names)
  csv = CSV.read(file)
  csv[0] = column_names
  File.write(@csv_out, csv.map(&:to_csv).join)
end

def remove_columns( file )
  csv = CSV.read(file, headers: true )
  csv.headers.each { |col|
    unless @fields.values.include?( col )
      csv.delete( col )
    end
  }
  csv
end

def convert_closed( csv)
  csv.each { |row|
    row.each { |cell|
      if ( @convert_fields.include?( cell[0] ) && cell[1] == "-3" )
        cell[1] = "0"
      end
    }
    if row["hours"] == "-3"
      row["hours"] = "0"
    end
    if row["weeks_open"] == "-3"
      row["weeks_open"] = "0"
    end
  }
  csv
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

def convert_not_applicable( csv )
  csv.each { |row|
    row.each { |cell|
      if cell[1] == "-4"
        cell[1] = "N/A"
      end
    }
  }
end

def convert_to_integer( csv )
  csv.each { |row|
    @fields_to_i.each { |field|
      if row[field] != "N/A"
        row[field] = row[field].to_i
      end
    }
  }
  csv
end

def fix_poe_tsawa( csv )
  csv.each{ |row|
    row["library_name"] = "PÒE TSÁWÄ COMMUNITY LIBRARY" if row["fscs_id"] === "NM0133"
  }
end

def csv_to_json(file)
  rows = []
  CSV.foreach(file, headers: true) do |row|
    @fields_to_i.each { |field|
      if row[field] != "N/A" && row[field] != "M"
        row[field] = row[field].to_i
      end
    }

    rows << row.to_hash
  end
  # rows.to_json
  File.write(@json, rows.to_json)
  File.write(@json_pretty, JSON.pretty_generate(rows))
end

# End functions

outlets = encode_csv(@csv_file)
new_cols = swap_headers( outlets.headers, @fields )
change_headers( @csv_out, new_cols )

sleep 1

csv = remove_columns( @csv_out )
csv = convert_closed(csv)
csv = convert_missing ( csv )
csv = convert_not_applicable(csv)
csv = fix_poe_tsawa( csv )
# csv = convert_to_integer( csv )

# p csv.to_csv
File.write(@csv_out, csv)

sleep 1

csv_to_json(@csv_out)
