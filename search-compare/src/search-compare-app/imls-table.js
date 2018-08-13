import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
/**
 * @customElement
 * @polymer
 */
class ImlsTable extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }
  static get properties() {
    return {
      librariesList: {
        type: Array,
        value: [],
        observer: 'render'
      },
      columnMode: {
          type: String,
          value: 'demographic'
      }
    };
  }
  
  connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  render() {
      debugger
    console.log(this.tableMode);
   comparisonData = [
    { name: 'demographic',
        display_name: 'Demographic', 
        headings: [ 'Name', 'Population of Legal Service Area (LSA)', 'Total unduplicated population of LSA', 'Number of central libraries', 'Number of branch libraries', 'Number of bookmobiles', 'Interlibrary relationship code', 'Legal basis code', 'Administrative structure code', 'FSCS public library definition', 'Geographic code' ],
        field_names: [ 'service_area_population', 'unduplicated_population', 'central_libraries', 'branch_libraries', 'bookmobiles', 'interlibrary_relationship', 'legal_basis', 'administrative_structure', 'fscs_definition', 'geographic_code' ],
        field_types: [ 'number', 'number', 'number', 'number', 'number', 'string', 'string', 'string', 'string', 'string' ] },
    { name: 'staff',
        display_name: 'Paid Staff (FTE)', 
        headings: [ 'Name', 'ALA-MLS librarians', 'Total librarians', 'All other paid staff', 'Total paid staff' ],
        field_names: [ 'mls_librarian_staff', 'librarian_staff', 'other_staff', 'total_staff' ],
        field_types: [ 'number', 'number', 'number', 'number' ] },
    { name: 'revenue',
        display_name: 'Operating Revenue', 
        headings: [ 'Name', 'Local Revenue ($)', 'State Revenue ($)', 'Federal Revenue ($)', 'Other Revenue ($)', 'Total Revenue ($)' ],
        field_names: [ 'local_revenue', 'state_revenue', 'federal_revenue', 'other_revenue', 'total_revenue' ],
        field_types: [ 'dollars', 'dollars', 'dollars', 'dollars', 'dollars' ] },
    { name: 'expenditures',
        display_name: 'Operating Expenditures', 
        headings: [ 'Name', 'Salaries & wages ($)', 'Employee benefits ($)', 'Total staff expenditures ($)', 'Print materials expenditures ($)', 'Electronic materials expenditures ($)', 'Other material expenditures ($)', 'Total collection expenditures ($)', 'Other operating expenditures ($)', 'Total operating expenditures ($)' ],
        field_names: [ 'salaries', 'benefits', 'total_staff_expenditures', 'print_expenditures', 'electronic_expenditures', 'other_collection_expenditures', 'total_collection_expenditures', 'other_expenditures', 'total_expenditures' ],
        field_types: [ 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars' ] },
    { name: 'capital',
        display_name: 'Capital Revenue and Expenditures', 
        headings: [ 'Name', 'Local capital revenue ($)', 'State capital revenue ($)', 'Federal capital revenue ($)', 'Other capital revenue ($)', 'Total capital revenue ($)', 'Total capital expenditures ($)' ],
        field_names: [ 'local_capital_revenue', 'state_capital_revenue', 'federal_capital_revenue', 'other_capital_revenue', 'total_capital_revenue', 'capital_expenditures' ],
        field_types: [ 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars' ] },
    { name: 'collection',
        display_name: 'Library Collection', 
        headings: [ 'Name', 'Print materials', 'Electronic books', 'Audio-physical units', 'Audio-downloadable units', 'Video-physical units', 'Video-downloadable units', 'Local databases', 'State databases', 'Total databases', 'Print serial subscriptions' ],
        field_names: [ 'print_materials', 'ebooks', 'audio_materials', 'audio_downloads', 'video_materials', 'video_downloads', 'local_databases', 'state_databases', 'total_databases', 'print_serials' ],
        field_types: [ 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number' ] },
    { name: 'services',
        display_name: 'Services', 
        headings: [ 'Name', 'Public service hours/year', 'Library visits', 'Reference transactions', 'Number of registered users', 'Total circulation of materials', 'Circulation of kid\'s materials', 'Use of electronic material', 'Physical item circulation', 'Electronic information retrievals', 'Electronic content use', 'Total collection use' ],
        field_names: [ 'hours', 'visits', 'references', 'users', 'total_circulation', 'kids_circulation', 'electronic_content_uses', 'physical_item_circulation', 'electronic_info_retrievals', 'electronic_content_uses', 'total_circulation_retrievals' ],
        field_types: [ 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number' ] },
    { name: 'inter-library',
        display_name: 'Inter-Library Loans', 
        headings: [ 'Name', 'Provided to', 'Received from' ],
        field_names: [ 'loans_to', 'loans_from' ],
        field_types: [ 'number', 'number' ] },
    { name: 'programs',
        display_name: 'Library Programs', 
        headings: [ 'Name', 'Total library programs', 'Children\'s programs', 'Young adult programs', 'Total attendance at library programs', 'Children\'s program attendance', 'Young adult program attendance' ],
        field_names: [ 'total_programs', 'kids_programs', 'ya_programs', 'program_audience', 'kids_program_audience', 'ya_program_audience' ],
        field_types: [ 'number', 'number', 'number', 'number', 'number', 'number' ] },
    { name: 'other_electronic',
        display_name: 'Other Electronic Information', 
        headings: [ 'Name', 'Computers used by general public', 'Computer uses', 'Wireless sessions' ],
        field_names: [ 'computers', 'computer_uses', 'wifi_sessions' ],
        field_types: [ 'number', 'number', 'number' ] }
    ];


      let foo = 'bar'
      this.innerHTML = `
        <button id="go-foo"></button>
        <div class="actions-box"> ${foo}
            <div class="row"> 
                <div class="col-sm-6 col-sm-offset-2">
                <div id="user-comparison-select-wrapper">
                    <span id="user-comparison-select-text">See variables related to: </span>
                    <select id="user-comparison-select"></select>
                </div>
                </div>
                <div class="col-sm-4 text-right">
                <span id="userCount"></span>
                <button id="user-share-btn" class="btn btn-default btn-sm" type="button">Share These Results</button>
                <div id="userShareDiv" class="closed">
                    <p>This page has been copied to your clipboard. Paste somewhere to share!</p>
                    <input type="text" id="userShareMe">
                    </div><!--end #shareDiv-->
                    <button id="download-user-csv" onclick="downloadCsv();" class="btn btn-default btn-sm"><i class="icon-file-excel"></i> Download</button>
                </div>
            </div>              
            </div><!--end .actions-box-->
            <div id="user-comparison-results-wrapper">
            <div class="table-responsive">
                <table class="table table-striped" id="user-comparison-results"></table>
            </div>
        </div><!-- end user-comparison-results-wrapper -->
      `
      this.querySelector('#go-foo').addEventListener('click', this.sayFoo)
  }

  sayFoo() {
      alert('foo')
  }
}

window.customElements.define('imls-table', ImlsTable);
