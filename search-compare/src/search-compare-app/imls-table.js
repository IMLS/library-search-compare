import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { CSV } from './csv.js'

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
      shareUrl: {
        type: String,
        value: ''
      },
      hideActions: {
        type: Boolean,
        value: false
      },
      showUserCompareListButtons: {
        type: Boolean,
        value: true
      },
      rowData: {
        type: Array,
        value: []
      },
      userCompareList: {
        type: Array,
        value: []
      },
      userCompareListOnly: {
        type: Boolean,
        value: false
      },
      compareOn: {
        type: String,
        value: 'demographic'
      },
      // Note currentPage is not tied to render because it would cause an infinite loop with dataTable.
      currentPage: {
        type: Number,
        value: 1
      },
      perPage: {
        type: Number,
        value: 50
      },
      showModal: {
        type: Boolean,
        value: false
      }
    };
  }
  
  connectedCallback() {
    super.connectedCallback()
    // Add event listener for user-compare-btn clicks here because we can't add the event listener directly. If we did,
    // because dataTable uses the same row DOM over and over, we would be making duplicate event bindings. This is a tricky
    // quirk of dataTable.
    this.addEventListener('click', event => {
      if (event.target.classList.contains('user-compare-btn')) {
        if (this.userCompareList.indexOf(event.target.getAttribute('data-fscs')) !== -1) {
          this.dispatchEvent(new CustomEvent('remove-library', {detail: event.target.getAttribute('data-fscs')}))
        } else {
          this.dispatchEvent(new CustomEvent('add-library', {detail: event.target.getAttribute('data-fscs')}))
        }
      }
    });

    this.render()
  }

  render() {
    this.innerHTML = `
      ${this.hideActions ? '' : `
        <div class="actions-box"> 
          <div class="row">
            <div class="col-sm-4">
              <span id="userCount"></span>
              ${this.shareUrl !== '' ? `<button id="user-share-btn" class="btn btn-default btn-sm" type="button">Share These Results</button>` : ``}
              <div id="shareDiv" class="closed">
                <p>This page has been copied to your clipboard. Paste somewhere to share!</p>
                <input type="text" value="${this.shareUrl}" id="userShareMe">
              </div>
              <button class="btn btn-default btn-sm" id="userExpBtn" data-cluster="">Definitions</button>
              <button id="download-user-csv" class="btn btn-default btn-sm"><i class="icon-file-excel"></i> Download</button>
            </div>
            <div class="col-sm-8 text-right">
              <div id="user-comparison-select-wrapper">
                <span id="user-comparison-select-text">See variables related to: </span>
                <select id="user-comparison-select">
                  ${this._comparisonTableConfig.map(option => `
                    <option value="${option.name}" ${option.name === this.compareOn ? 'selected' : ''}>
                      ${option.display_name}
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>              
        </div>
      `}
      <div id="user-comparison-results-wrapper">
        <div class="table-responsive">
          <table class="table table-striped" id="data_table"></table>
        </div>
      </div><!-- end user-comparison-results-wrapper -->
    `
    if (!this.hideActions) {
      if (this.shareUrl !== '') this.querySelector('#user-share-btn').addEventListener('click', this.showShareUrl.bind(this))
      this.querySelector('#download-user-csv').addEventListener('click', this.downloadCsv.bind(this))
      this.querySelector('#userExpBtn').addEventListener('click', this.onDefinitionsClick.bind(this))
      this.querySelector('#user-comparison-select').addEventListener('change', event => {
        this.compareOn = event.target.value
        this.render()
      })
    }

    var tableRows = []
    var tableData = {};

    var field_names = _.map( _.find( this._comparisonTableConfig, { 'name': this.compareOn } ).field_names );

    tableData[ 'headings' ] = _.map( _.find( this._comparisonTableConfig, { 'name': this.compareOn } ).headings );
    if (this.showUserCompareListButtons) {
      tableData[ 'headings' ].unshift('');
    } else {
      // Nothing.
    }
    let rowData = (this.userCompareListOnly) ? this.rowData.filter(data => this.userCompareList.indexOf(data.fscs_id) !== -1) : this.rowData
    for (var h in rowData) {
      let res = rowData[h];
      if (this.showUserCompareListButtons) {
        var tableRow = [ `<i class="user-compare-btn ${this.userCompareList.indexOf(rowData[h].fscs_id) !== -1 ? 'user-compare-remove' : 'user-compare-add'}" data-fscs="${res[ "fscs_id" ]}" data-action="remove"></i>`, '<a data-name="' + res[ 'library_name' ] + '" href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + ' (' + res[ "fscs_id" ] + ')' + '</a>' ];
      } else {
        var tableRow = [  '<a data-name="' + res[ 'library_name' ] + '" href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + ' (' + res[ "fscs_id" ] + ')' + '</a>' ];
      }
      _.forEach( field_names, function(f) {
        tableRow.push(res[f].toLocaleString("en-US"));
      });
      tableRows.push(tableRow);
    }
    tableData[ 'rows' ] = tableRows;
    
    var page_url = window.location.href;

    if (typeof this.comparisonGrid !== 'undefined') {
      this.comparisonGrid.destroy();
    }
    this.comparisonGrid = new DataTable(this.querySelector('#data_table'), {
      perPage: this.perPage,
      data: tableData,
      searchable: false,
      perPageSelect: false,
      columns: [
      {
        select: 1,
        sortable: true
      },
      {
        select: 2,
        render: function( data, cell, row) {
          return data;
        }
      }
      ]
    });

    this.comparisonGrid.on('datatable.init', _ => {

      this.comparisonGrid.page(this.currentPage)
      this.gridHasRendered()
      $('#loading-spinner').addClass('paused');
      $('#loading-spinner span').html('Content has loaded.');
      $('#modalOverlay').addClass('hidden');
      $('header, main, footer').attr('aria-hidden', 'false');
    })
    this.comparisonGrid.on('datatable.page', page => {
      if(this.currentPage !== page) {
        this.currentPage = page
      } else {
        this.gridHasRendered()
      }
    })

    this.comparisonGrid.on('datatable.sort', _ => {
      console.log('sort event called')
      this.gridHasRendered()
    });

  }

  gridHasRendered() {
    this.dispatchEvent(new CustomEvent('imls-table-grid-render'))
  }

  showShareUrl() {
    this.querySelector('#shareDiv').setAttribute('class', 'here')
  }

  renderCsv() {
    return CSV.serialize({
      fields: this.rowData
        .reduce((acc, row) => [ ...new Set([...acc, ...Object.keys(row)]) ], [])
        .map(key => { return {id: key} }),
      records: this.rowData
    })
  }

  downloadCsv() {
    const csvContent = this.renderCsv()
    var filename = "imls_data"; 
    var csvData = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    if( msieversion()) {
      navigator.msSaveBlob(csvData, 'pls_export.csv');
    } else {
      // window.open(encodedUri);
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(csvData);
      link.setAttribute('download', 'pls_export.csv');
      document.body.appendChild(link);    
      link.click();
      document.body.removeChild(link);
    }
  }

  onDefinitionsClick() {
    var content = this.compareOn;
    this.dispatchEvent(new CustomEvent('show-modal', {detail:content}));
  }


  get _comparisonTableConfig() {
    return [
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
          headings: [ 'Name', 'Public service hours/year', 'Library visits', 'Reference transactions', 'Number of registered users', 'Total circulation of materials', 'Circulation of kid\'s materials', 'Electronic Circulation', 'Physical item circulation', 'Electronic information retrievals', 'Electronic content use', 'Total collection use' ],
          field_names: [ 'hours', 'visits', 'references', 'users', 'total_circulation', 'kids_circulation', 'electronic_circulation', 'physical_item_circulation', 'electronic_info_retrievals', 'electronic_content_uses', 'total_circulation_retrievals' ],
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
      ]
  }

}

window.customElements.define('imls-table', ImlsTable);
