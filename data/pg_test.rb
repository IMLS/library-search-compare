require 'csv'
require 'pg'

class PostgresDirect
  def connect
    @conn = PG.connect(
      :host => 'localhost',
      :port => 5432,
      :user => 'postgres',
      :password => 'popc919!',
      :dbname => 'imls')
  end

  def createTable(table, sql)
    @conn.exec "DROP TABLE IF EXISTS #{table}"
    @conn.exec sql
  end

  def getID(table, name, value)
    res = @conn.exec "SELECT id FROM #{table} WHERE #{name} = '#{value}'"
    id = res.getvalue(0,0).to_i
  end

  def addRow(sql, values)
    begin
      @conn.prepare 'prepped_sql', sql
      @conn.exec_prepared 'prepped_sql', values
      @conn.exec("DEALLOCATE prepped_sql")
    rescue PG::Error => e
      puts e.message
    end
  end

  def dropTable(table)
    @conn.exec "DROP TABLE IF EXISTS #{table}"
  end

  def selectAll(table)
    res = @conn.exec "SELECT * FROM #{table}"
    res.each do |row|
      puts row
    end
  end

  def listTables
    tables = @conn.exec "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    tables.each do |table|
      puts table
    end
  end

  def disconnect
    @conn.close
  end
end

class CsvDirect
  def read(file, options)
    csv = CSV.read(file, options)
  end

  def getHeaders(csv)
    headers = csv.headers
  end

  def getUniqueCol(csv, col)
    col_arr = csv.by_col.values_at(col).uniq.flatten.compact
  end
end

csv = CsvDirect.new
pg = PostgresDirect.new()

# Conntect to db and read administrative entities csv file
pg.connect
imls = csv.read("input/raw_full.csv", {:headers => true, :write_headers => false, :encoding => "ISO-8859-1"})

# Get unique STATE values and create/write them to db table
pg.createTable("states", "CREATE TABLE states (id serial PRIMARY KEY, name character varying(255))")

states = csv.getUniqueCol(imls, "STATE").sort
states.each do |state|
  pg.addRow("INSERT INTO states (name) VALUES($1)", [state])
end

# Create main libraries table and write all records
pg.createTable("libraries", "CREATE TABLE libraries (id serial PRIMARY KEY, state_id integer, fscs_id varchar(30), name varchar(255), location varchar(255))")

imls.each do |row|
  state_id = pg.getID('states', 'name', row["STATE"])
  pg.addRow("INSERT INTO libraries (state_id, fscs_id, name, location) VALUES($1,$2,$3,$4)", [state_id, row["FSCS ID"], row["LIBRARY NAME"], row["LOCATION"]])
end

# List public database tables
pg.listTables

#disconntect from database
pg.disconnect
