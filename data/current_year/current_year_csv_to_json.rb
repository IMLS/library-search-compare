require 'csv'
require 'json'
require 'charlock_holmes'

@csv_file = 'pls_fy18_ae_pud18i.csv'
@csv_out = @csv_file.split(/\./).first + '_working.csv'
@json = 'current_year.json'
@json_pretty = 'current_year_pretty.json'

@outlet_file = 'pls_fy18_outlet_pud18i.csv'

@fields_to_f = ["total_revenue", "total_staff_expenditures", "total_collection_expenditures", "total_capital_revenue", "capital_expenditures", "service_area_population", "hours", "visits", "references", "users", "total_circulation", "loans_to", "total_programs", "computers", "print_materials", "ebooks", "audio_materials", "video_materials", "total_databases", "print_serials", "mls_librarian_staff", "librarian_staff", "other_staff", "total_staff", "local_capital_revenue", "state_capital_revenue", "federal_capital_revenue", "other_capital_revenue",    "unduplicated_population", "central_libraries", "branch_libraries", "bookmobiles", "loans_from", "audio_downloads", "video_downloads", "local_databases", "state_databases", "kids_programs", "ya_programs", "program_audience", "kids_program_audience", "ya_program_audience", "local_revenue", "state_revenue", "federal_revenue", "other_revenue", "salaries", "benefits", "print_expenditures", "electronic_expenditures", "other_collection_expenditures", "other_expenditures", "total_expenditures", "computer_uses", "wifi_sessions", "total_circulation", "kids_circulation","electronic_circulation", "electronic_content_uses", "physical_item_circulation", "electronic_info_retrievals", "electronic_content_uses", "total_circulation_retrievals", "county_population", "geocode_score", "longitude", "latitude", "web_visits", "total_branches" ]

@fields = {
  "STABR" => "state",
  "FSCSKEY" => "fscs_id",
  "LIBID" => "library_id",
  "LIBNAME" => "library_name",
  "ADDRESS" => "address",
  "CITY" => "city",
  "ADDRES_M" => "mailing_address",
  "CITY_M" => "mailing_city",
  "ZIP_M" => "mailing_zip",
  "CNTY" => "county",
  "PHONE" => "phone",
  "C_RELATN" => "interlibrary_relationship",
  "C_LEGBAS" => "legal_basis",
  "C_ADMIN" => "administrative_structure",
  "C_FSCS" => "fscs_definition",
  "GEOCODE" => "geographic_code",
  "LSABOUND" => "lsabound",
  "STARTDAT" => "start_date",
  "ENDDATE" => "end_date",
  "POPU_LSA" => "service_area_population",
  "POPU_UND" => "unduplicated_population",
  "CENTLIB" => "central_libraries",
  "BRANLIB" => "branch_libraries",
  "BKMOB" => "bookmobiles",
  "MASTER" => "mls_librarian_staff",
  "LIBRARIA" => "librarian_staff",
  "OTHPAID" => "other_staff",
  "TOTSTAFF" => "total_staff",
  "LOCGVT" => "local_revenue",
  "STGVT" => "state_revenue",
  "FEDGVT" => "federal_revenue",
  "OTHINCM" => "other_revenue",
  "TOTINCM" => "total_revenue",
  "SALARIES" => "salaries",
  "BENEFIT" => "benefits",
  "STAFFEXP" => "total_staff_expenditures",
  "PRMATEXP" => "print_expenditures",
  "ELMATEXP" => "electronic_expenditures",
  "OTHMATEX" => "other_collection_expenditures",
  "TOTEXPCO" => "total_collection_expenditures",
  "OTHOPEXP" => "other_expenditures",
  "TOTOPEXP" => "total_expenditures",
  "LCAP_REV" => "local_capital_revenue",
  "SCAP_REV" => "state_capital_revenue",
  "FCAP_REV" => "federal_capital_revenue",
  "OCAP_REV" => "other_capital_revenue",
  "CAP_REV" => "total_capital_revenue",
  "CAPITAL" => "capital_expenditures",
  "BKVOL" => "print_materials",
  "EBOOK" => "ebooks",
  "AUDIO_PH" => "audio_materials",
  "AUDIO_DL" => "audio_downloads",
  "VIDEO_PH" => "video_materials",
  "VIDEO_DL" => "video_downloads",
  "EC_LO_OT" => "local_databases",
  "EC_ST" => "state_databases",
  "ELECCOLL" => "total_databases",
  "SUBSCRIP" => "print_serials",
  "HRS_OPEN" => "hours",
  "VISITS" => "visits",
  "REFERENC" => "references",
  "REGBOR" => "users",
  "TOTCIR" => "total_circulation",
  "KIDCIRCL" => "kids_circulation",
  "ELMATCIR" => "electronic_circulation",
  "PHYSCIR" => "physical_item_circulation",
  "ELINFO" => "electronic_info_retrievals",
  "ELCONT" => "electronic_content_uses",
  "TOTCOLL" => "total_circulation_retrievals",
  "LOANTO" => "loans_to",
  "LOANFM" => "loans_from",
  "TOTPRO" => "total_programs",
  "KIDPRO" => "kids_programs",
  "YAPRO" => "ya_programs",
  "TOTATTEN" => "program_audience",
  "KIDATTEN" => "kids_program_audience",
  "YAATTEN" => "ya_program_audience",
  "GPTERMS" => "computers",
  "PITUSR" => "computer_uses",
  "WIFISESS" => "wifi_sessions",
  "WEBVISIT" => "web_visits",
  "YR_SUB" => "year",
  "OBEREG" => "bea_region",
  "RSTATUS" => "reporting_status",
  "STATSTRU" => "structure_change",
  "STATNAME" => "name_change",
  "STATADDR" => "address_change",
  "LONGITUD" => "longitude",
  "LATITUDE" => "latitude",
  "INCITSST" => "incits_state_code",
  "INCITSCO" => "incits_county_code",
  "GNISPLAC" => "gnis_id",
  "CNTYPOP" => "county_population",
  "LOCALE_ADD" => "locale",
  "REAPLOCALE" => "reap_locale",
  "CENTRACT" => "census_tract",
  "CENBLOCK" => "census_block",
  "CDCODE" => "congressional_district",
  "CBSA" => "cbsa",
  "MICROF" => "metro_micro_area",
  "ADDRTYPE" => "address_match_type",
  "MSTATUS" => "esri_match_status",
  "SCORE" => "geocode_score"
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

def remove_closed( csv)
  csv.delete_if do |row|
    row["structure_change"] == "03"
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

def convert_not_applicable( csv )
  csv.each { |row|
    row.each { |cell|
      if cell[1] == "-4"
        cell[1] = "N/A"
      end
    }
  }
end

def convert_locale_labels( csv )
  csv.each { |row|
    case row["locale"]
    when *["11","12","13"]
      row["locale_string"] = "City"
    when *["21","22","23"]
      row["locale_string"] = "Suburban"
    when *["31","32","33"]
      row["locale_string"] = "Town"
    when *["41","42","43"]
      row["locale_string"] = "Rural"
    else
      p row['locale_string']
      p "Locale code error"
    end
  }
  csv
end

def convert_to_float( csv )
  csv.each { |row|
    @fields_to_f.each { |field|
      unless ["S", "M", "N/A"].include?row[field]
        row[field] = row[field].to_f
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

def add_total_branches( csv )
  outlet_csv = CSV.read(@outlet_file, :encoding => 'windows-1251:utf-8')
  csv.each{ |row|
    if row["central_libraries"].to_i === 0
      total_branches = outlet_csv.select { |outlet_row| outlet_row[1] == row["fscs_id"] }
      row["total_branches"] = total_branches.count
    else
      row["total_branches"] = row["central_libraries"].to_i + row["branch_libraries"].to_i + row["bookmobiles"].to_i
    end
    row["total_branches"] = 0 if row["total_branches"] < 0 
    row["total_circulation"] = 0 if row["total_circulation"] === "-3" 
    row["total_revenue"] = 0 if row["total_revenue"] === "-3" 
    row["total_staff"] = 0 if row["total_staff"] === "-3"
    row["service_area_population"] = 0 if row["service_area_population"] === "-3"
    row["visits"] = 0 if row["visits"] === "-3"
    row["total_programs"] = 0 if row["total_programs"] === "-3"
  }
end

def add_category_fields( csv )
  csv.each{ |row|
    case 
    when row["service_area_population"].to_i < 1000
      row["population_category"] = "Less than 1,000"
    when row["service_area_population"].to_i >= 1000 && row["service_area_population"].to_i <= 2499
      row["population_category"] = "1,000 to 2,499"
    when row["service_area_population"].to_i >= 2500 && row["service_area_population"].to_i <= 4999
      row["population_category"] = "2,500 to 4,999"
    when row["service_area_population"].to_i >= 5000 && row["service_area_population"].to_i <= 9999
      row["population_category"] = "5,000 to 9,999"
    when row["service_area_population"].to_i >= 10000 && row["service_area_population"].to_i <= 24999
      row["population_category"] = "10,000 to 24,999"
    when row["service_area_population"].to_i >= 25000 && row["service_area_population"].to_i <= 49999
      row["population_category"] = "25,000 to 49,999"
    when row["service_area_population"].to_i >= 50000 && row["service_area_population"].to_i <= 99999
      row["population_category"] = "50,000 to 99,999"
    when row["service_area_population"].to_i >= 100000 && row["service_area_population"].to_i <= 249999
      row["population_category"] = "100,000 to 249,000"
    when row["service_area_population"].to_i >= 250000 && row["service_area_population"].to_i <= 499999
      row["population_category"] = "250,000 to 499,999"
    when row["service_area_population"].to_i >= 500000 && row["service_area_population"].to_i <= 999999
      row["population_category"] = "500,000 to 999,999"
    when row["service_area_population"].to_i >= 1000000
      row["population_category"] = "1,000,000 or more"
    else
      puts "No category found - " + row["population_category"].to_s + " | " + row["fscs_id"].to_s
    end
  }
end

def csv_to_json(file)
  rows = []
  CSV.foreach(file, headers: true) do |row|
    @fields_to_f.each { |field|
      unless ["S", "M", "N/A"].include?row[field]
        row[field] = row[field].to_f
      end
    }
    rows << row.to_hash
  end
  # rows.to_json
  File.write(@json, rows.to_json)
  File.write(@json_pretty, JSON.pretty_generate(rows))
end

# End Functions

libraries = encode_csv(@csv_file)
new_cols = swap_headers( libraries.headers, @fields )
change_headers( @csv_out, new_cols )

sleep 1

csv = remove_columns( @csv_out )
csv = remove_closed( csv )
csv = convert_suppressed (csv )
csv = convert_missing ( csv )
csv = convert_not_applicable ( csv )
csv = convert_locale_labels ( csv )
csv = fix_poe_tsawa( csv )
csv = add_total_branches( csv )
csv = add_category_fields( csv )
# csv = convert_to_float( csv )

File.write(@csv_out, csv)

sleep 1

csv_to_json(@csv_out)
