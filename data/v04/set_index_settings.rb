require 'rubygems'
require 'algoliasearch'

Algolia.init(application_id: 'CDUMM9WVUG',
             api_key:        'f6931b6ef37e7a2c1bda42c1a5402e64')

index = Algolia::Index.new('imls_v04')
#puts index.methods - Object.methods

client = index.client

index.set_settings({
  paginationLimitedTo: 3000
})

settings = index.get_settings
puts settings.to_json

