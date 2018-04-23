require 'rubygems'
require 'algoliasearch'

Algolia.init(application_id: 'CDUMM9WVUG',
             api_key:        'f6931b6ef37e7a2c1bda42c1a5402e64')

index = Algolia::Index.new('imls')
#puts index.methods - Object.methods

client = index.client
p client.copy_index('imls', 'imls_v02')
p client.list_indexes
