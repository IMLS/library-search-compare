require 'csv'
require 'json'
require 'charlock_holmes'

@csv_file = 'pls_ae_pud18i.csv'
@csv_out = @csv_file.split(/\./).first + '_working.csv'
@json = 'current_year.json'
@json_pretty = 'current_year_pretty.json'

@fields_to_f = ["total_revenue", "total_staff_expenditures", "total_collection_expenditures", "total_capital_revenue", "capital_expenditures", "service_area_population", "hours", "visits", "references", "users", "total_circulation", "loans_to", "total_programs", "computers", "print_materials", "ebooks", "audio_materials", "video_materials", "total_databases", "print_serials", "mls_librarian_staff", "librarian_staff", "other_staff", "total_staff", "local_capital_revenue", "state_capital_revenue", "federal_capital_revenue", "other_capital_revenue",    "unduplicated_population", "central_libraries", "branch_libraries", "bookmobiles", "loans_from", "audio_downloads", "video_downloads", "local_databases", "state_databases", "kids_programs", "ya_programs", "program_audience", "kids_program_audience", "ya_program_audience", "local_revenue", "state_revenue", "federal_revenue", "other_revenue", "salaries", "benefits", "print_expenditures", "electronic_expenditures", "other_collection_expenditures", "other_expenditures", "total_expenditures", "computer_uses", "wifi_sessions", "total_circulation", "kids_circulation","electronic_circulation", "electronic_content_uses", "physical_item_circulation", "electronic_info_retrievals", "electronic_content_uses", "total_circulation_retrievals", "county_population", "geocode_score", "longitude", "latitude", "web_visits" ]

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
    row["hours"] == "-3"
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
# csv = convert_to_float( csv )

File.write(@csv_out, csv)

sleep 1

csv_to_json(@csv_out)
