define(["../../node_modules/@polymer/polymer/polymer-element.js", "./csv.js"], function (_polymerElement, _csv) {
  "use strict";

  function _templateObject_ee3ed3a0f72b11e9a64c27114e04f2f8() {
    var data = babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n        }\n      </style>\n      <slot></slot>\n    "]);

    _templateObject_ee3ed3a0f72b11e9a64c27114e04f2f8 = function _templateObject_ee3ed3a0f72b11e9a64c27114e04f2f8() {
      return data;
    };

    return data;
  }

  /**
   * @customElement
   * @polymer
   */
  var ImlsTable =
  /*#__PURE__*/
  function (_PolymerElement) {
    babelHelpers.inherits(ImlsTable, _PolymerElement);

    function ImlsTable() {
      babelHelpers.classCallCheck(this, ImlsTable);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(ImlsTable).apply(this, arguments));
    }

    babelHelpers.createClass(ImlsTable, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _this = this;

        babelHelpers.get(babelHelpers.getPrototypeOf(ImlsTable.prototype), "connectedCallback", this).call(this); // Add event listener for user-compare-btn clicks here because we can't add the event listener directly. If we did,
        // because dataTable uses the same row DOM over and over, we would be making duplicate event bindings. This is a tricky
        // quirk of dataTable.

        this.addEventListener('click', function (event) {
          if (event.target.classList.contains('user-compare-btn')) {
            if (_this.userCompareList.indexOf(event.target.getAttribute('data-fscs')) !== -1) {
              _this.dispatchEvent(new CustomEvent('remove-library', {
                detail: event.target.getAttribute('data-fscs')
              }));
            } else {
              _this.dispatchEvent(new CustomEvent('add-library', {
                detail: event.target.getAttribute('data-fscs')
              }));
            }
          }
        });
        this.render();
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        this.innerHTML = "\n      ".concat(this.hideActions ? '' : "\n        <div class=\"actions-box\"> \n          <div class=\"row\">\n            <div class=\"col-sm-4\">\n              <span id=\"userCount\"></span>\n              ".concat(this.shareUrl !== '' ? "<button id=\"user-share-btn\" class=\"btn btn-default btn-sm\" type=\"button\">Share These Results</button>" : "", "\n              <div id=\"shareDiv\" class=\"closed\">\n                <p>This page has been copied to your clipboard. Paste somewhere to share!</p>\n                <input type=\"text\" value=\"").concat(this.shareUrl, "\" id=\"userShareMe\">\n              </div>\n              <button class=\"btn btn-default btn-sm\" id=\"userExpBtn\" data-cluster=\"\">Definitions</button>\n              <button id=\"download-user-csv\" class=\"btn btn-default btn-sm\"><i class=\"icon-file-excel\"></i> Download</button>\n            </div>\n            <div class=\"col-sm-8 text-right\">\n              <div id=\"user-comparison-select-wrapper\">\n                <span id=\"user-comparison-select-text\">See variables related to: </span>\n                <select id=\"user-comparison-select\">\n                  ").concat(this._comparisonTableConfig.map(function (option) {
          return "\n                    <option value=\"".concat(option.name, "\" ").concat(option.name === _this2.compareOn ? 'selected' : '', ">\n                      ").concat(option.display_name, "\n                    </option>\n                  ");
        }).join(''), "\n                </select>\n              </div>\n            </div>\n          </div>              \n        </div>\n      "), "\n      <div id=\"user-comparison-results-wrapper\">\n        <div class=\"table-responsive\">\n          <table class=\"table table-striped\" id=\"data_table\"></table>\n        </div>\n      </div><!-- end user-comparison-results-wrapper -->\n    ");

        if (!this.hideActions) {
          if (this.shareUrl !== '') this.querySelector('#user-share-btn').addEventListener('click', this.showShareUrl.bind(this));
          this.querySelector('#download-user-csv').addEventListener('click', this.downloadCsv.bind(this));
          this.querySelector('#userExpBtn').addEventListener('click', this.onDefinitionsClick.bind(this));
          this.querySelector('#user-comparison-select').addEventListener('change', function (event) {
            _this2.compareOn = event.target.value;

            _this2.render();
          });
        }

        var tableRows = [];
        var tableData = {};

        var field_names = _.map(_.find(this._comparisonTableConfig, {
          'name': this.compareOn
        }).field_names);

        tableData['headings'] = _.map(_.find(this._comparisonTableConfig, {
          'name': this.compareOn
        }).headings);

        if (this.showUserCompareListButtons) {
          tableData['headings'].unshift('');
        } else {// Nothing.
        }

        var rowData = this.userCompareListOnly ? this.rowData.filter(function (data) {
          return _this2.userCompareList.indexOf(data.fscs_id) !== -1;
        }) : this.rowData;

        var _loop = function _loop() {
          var res = rowData[h];

          if (_this2.showUserCompareListButtons) {
            tableRow = ["<i class=\"user-compare-btn ".concat(_this2.userCompareList.indexOf(rowData[h].fscs_id) !== -1 ? 'user-compare-remove' : 'user-compare-add', "\" data-fscs=\"").concat(res["fscs_id"], "\" data-action=\"remove\"></i>"), '<a data-name="' + res['library_name'] + '" href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + ' (' + res["fscs_id"] + ')' + '</a>'];
          } else {
            tableRow = ['<a data-name="' + res['library_name'] + '" href="details.html?fscs_id=' + res["fscs_id"] + '">' + res["library_name"] + ' (' + res["fscs_id"] + ')' + '</a>'];
          }

          _.forEach(field_names, function (f) {
            tableRow.push(res[f].toLocaleString("en-US"));
          });

          tableRows.push(tableRow);
        };

        for (var h in rowData) {
          var tableRow;
          var tableRow;

          _loop();
        }

        tableData['rows'] = tableRows;
        var page_url = window.location.href;

        if (typeof this.comparisonGrid !== 'undefined') {
          this.comparisonGrid.destroy();
        }

        this.comparisonGrid = new DataTable(this.querySelector('#data_table'), {
          perPage: this.perPage,
          data: tableData,
          searchable: false,
          perPageSelect: false,
          columns: [{
            select: 1,
            sortable: true
          }, {
            select: 2,
            render: function render(data, cell, row) {
              return data;
            }
          }]
        });
        this.comparisonGrid.on('datatable.init', function (_) {
          _this2.comparisonGrid.page(_this2.currentPage);

          _this2.gridHasRendered();

          $('#loading-spinner').addClass('paused');
          $('#loading-spinner span').html('Content has loaded.');
          $('#modalOverlay').addClass('hidden');
          $('header, main, footer').attr('aria-hidden', 'false');
        });
        this.comparisonGrid.on('datatable.page', function (page) {
          if (_this2.currentPage !== page) {
            _this2.currentPage = page;
          } else {
            _this2.gridHasRendered();
          }
        });
        this.comparisonGrid.on('datatable.sort', function (_) {
          _this2.gridHasRendered();
        });
      }
    }, {
      key: "gridHasRendered",
      value: function gridHasRendered() {
        this.dispatchEvent(new CustomEvent('imls-table-grid-render'));
      }
    }, {
      key: "showShareUrl",
      value: function showShareUrl() {
        this.querySelector('#shareDiv').setAttribute('class', 'here');
      }
    }, {
      key: "prepareUserCsvData",
      value: function prepareUserCsvData() {
        var csvRows = [];

        for (var h in this.rowData) {
          var res = this.rowData[h];
          var csvHeadings = ['Name', 'fscs_id', 'City', 'State', 'Locale code'];

          var library_name = _.replace(res['library_name'], /,/g, '');

          var csvRow = [library_name, res['fscs_id'], res['mailing_city'], res['state'], res['locale']];

          _.forEach(comparisonData, function (value, key) {
            _.forEach(value.field_names, function (value) {
              csvHeadings.push(value);
              csvRow.push(res[value]);
            });
          });

          csvRows.push(csvRow);
        }

        csvRows.unshift(csvHeadings);
        csvContent = "";
        csvRows.forEach(function (rowArray) {
          var row = rowArray.join(",");
          csvContent += row + "\r\n";
        });
        encodedUri = encodeURI(csvContent);
      }
      /*
      renderCsv() {
        return CSV.serialize({
          fields: csvContent
            .reduce((acc, row) => [ ...new Set([...acc, ...Object.keys(row)]) ], [])
            .map(key => { return {id: key} }),
          records: this.rowData
        })
      }
      */

    }, {
      key: "downloadCsv",
      value: function downloadCsv() {
        this.prepareUserCsvData(); //const csvContent = this.renderCsv()

        var filename = "imls_data";
        var csvData = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;'
        });

        if (msieversion()) {
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
    }, {
      key: "onDefinitionsClick",
      value: function onDefinitionsClick() {
        var content = this.compareOn;
        this.dispatchEvent(new CustomEvent('show-modal', {
          detail: content
        }));
      }
    }, {
      key: "_comparisonTableConfig",
      get: function get() {
        return [{
          name: 'demographic',
          display_name: 'Demographic',
          headings: ['Name', 'Service Area Population', 'Central Libraries', 'Branch Libraries', 'Bookmobiles', 'Legal Basis', 'FSCS Public Library?'],
          field_names: ['service_area_population', 'central_libraries', 'branch_libraries', 'bookmobiles', 'legal_basis', 'fscs_definition'],
          field_types: ['number', 'number', 'number', 'number', 'number', 'string', 'string', 'string', 'string', 'string']
        }, {
          name: 'staff',
          display_name: 'Paid Staff (FTE)',
          headings: ['Name', 'ALA-MLS Librarians', 'Total Librarians', 'Other Paid Staff', 'Total Staff'],
          field_names: ['mls_librarian_staff', 'librarian_staff', 'other_staff', 'total_staff'],
          field_types: ['number', 'number', 'number', 'number']
        }, {
          name: 'revenue',
          display_name: 'Operating Revenue',
          headings: ['Name', 'Local Revenue ($)', 'State Revenue ($)', 'Federal Revenue ($)', 'Other Revenue ($)', 'Total Revenue ($)'],
          field_names: ['local_revenue', 'state_revenue', 'federal_revenue', 'other_revenue', 'total_revenue'],
          field_types: ['dollars', 'dollars', 'dollars', 'dollars', 'dollars']
        }, {
          name: 'expenditures',
          display_name: 'Operating Expenditures',
          headings: ['Name', 'Salaries ($)', 'Benefits ($)', 'Total Staff Expenses ($)', 'Print Materials Expenses ($)', 'Electronic Materials Expenses ($)', 'Other Material Expenses ($)', 'Total Collection Expenses ($)', 'Other Operating Expenses ($)', 'Total Operating Expenses ($)'],
          field_names: ['salaries', 'benefits', 'total_staff_expenditures', 'print_expenditures', 'electronic_expenditures', 'other_collection_expenditures', 'total_collection_expenditures', 'other_expenditures', 'total_expenditures'],
          field_types: ['dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars']
        }, {
          name: 'capital',
          display_name: 'Capital Revenue and Expenditures',
          headings: ['Name', 'Local Capital Revenue ($)', 'State Capital Revenue ($)', 'Federal Capital Revenue ($)', 'Other Capital Revenue ($)', 'Total Capital Revenue ($)', 'Capital Expenses ($)'],
          field_names: ['local_capital_revenue', 'state_capital_revenue', 'federal_capital_revenue', 'other_capital_revenue', 'total_capital_revenue', 'capital_expenditures'],
          field_types: ['dollars', 'dollars', 'dollars', 'dollars', 'dollars', 'dollars']
        }, {
          name: 'collection',
          display_name: 'Library Collection',
          headings: ['Name', 'Print Materials', 'E-Books', 'Audio-Physical', 'Audio-Downloadable', 'Video-Physical', 'Video-Downloadable', 'Local Databases', 'State Databases', 'Total Databases', 'Print Subscriptions'],
          field_names: ['print_materials', 'ebooks', 'audio_materials', 'audio_downloads', 'video_materials', 'video_downloads', 'local_databases', 'state_databases', 'total_databases', 'print_serials'],
          field_types: ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']
        }, {
          name: 'services',
          display_name: 'Services',
          headings: ['Name', 'Hours/Year', 'Visits', 'Reference Transactions', 'Registered Users', 'Total Circulation', 'Circulation of Children\'s Materials', 'Electronic Circulation', 'Physical Circulation', 'Electronic Info Retrieval', 'Electronic Content Use', 'Total Collection Use'],
          field_names: ['hours', 'visits', 'references', 'users', 'total_circulation', 'kids_circulation', 'electronic_circulation', 'physical_item_circulation', 'electronic_info_retrievals', 'electronic_content_uses', 'total_circulation_retrievals'],
          field_types: ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']
        }, {
          name: 'inter-library',
          display_name: 'Inter-Library Loans',
          headings: ['Name', 'ILL To', 'ILL From'],
          field_names: ['loans_to', 'loans_from'],
          field_types: ['number', 'number']
        }, {
          name: 'programs',
          display_name: 'Library Programs',
          headings: ['Name', 'Library Programs', 'Children\'s Programs', 'Young Adult Programs', 'Program Attendance', 'Children\'s Program Attendance', 'Young Adult Program Attendance'],
          field_names: ['total_programs', 'kids_programs', 'ya_programs', 'program_audience', 'kids_program_audience', 'ya_program_audience'],
          field_types: ['number', 'number', 'number', 'number', 'number', 'number']
        }, {
          name: 'other_electronic',
          display_name: 'Other Electronic Information',
          headings: ['Name', 'Internet Computers', 'Computer Uses', 'Wi-Fi Sessions'],
          field_names: ['computers', 'computer_uses', 'wifi_sessions'],
          field_types: ['number', 'number', 'number']
        }];
      }
    }], [{
      key: "template",
      get: function get() {
        return (0, _polymerElement.html)(_templateObject_ee3ed3a0f72b11e9a64c27114e04f2f8());
      }
    }, {
      key: "properties",
      get: function get() {
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
    }]);
    return ImlsTable;
  }(_polymerElement.PolymerElement);

  window.customElements.define('imls-table', ImlsTable);
});