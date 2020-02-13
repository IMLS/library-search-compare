open("https://data.imls.gov/resource/tcjt-v8y8.json") {|f|
  f.each_line {|line| p line}
}
