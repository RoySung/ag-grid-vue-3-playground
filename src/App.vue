<template>
  <button @click="getGridData">getGridData</button>
  <div style="height: 1500px; margin: 20px;">
    <div style="height: 100%">
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :columnDefs="columnDefs"
        @grid-ready="onGridReady"
        :onRowClicked="onRowClicked"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :isFullWidthRow="isFullWidthRow"
        :fullWidthCellRenderer="fullWidthCellRenderer"
        :getRowHeight="getRowHeight"
      ></ag-grid-vue>
    </div>
    <DetailContent />
  </div>
  <Hello />
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { onBeforeMount, ref } from "vue";
import DetailContent from "./DetailContent.vue";
import CustomHeader from "./CustomHeader.vue";
import Cell from "./Cell.vue";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

export default {
  name: "App",
  components: {
    AgGridVue,
    DetailContent,
    // agColumnHeader: CustomHeader,
  },
  setup(props) {
    const columnDefs = ref(getColumnDefs());
    const gridApi = ref();
    const gridColumnApi = ref();

    const rowData = ref(null);
    const pinnedTopRowData = ref(null);
    const pinnedBottomRowData = ref(null);
    const isFullWidthRow = ref(null);
    const fullWidthCellRenderer = ref(null);
    const getRowHeight = ref(null);

    onBeforeMount(() => {
      rowData.value = createData(100, "body");
      pinnedTopRowData.value = createData(3, "pinned");
      pinnedBottomRowData.value = createData(3, "pinned");
      isFullWidthRow.value = (params) => {
        // in this example, we check the fullWidth attribute that we set
        // while creating the data. what check you do to decide if you
        // want a row full width is up to you, as long as you return a boolean
        // for this method.
        return params.rowNode.data.isDetail;
      };
      fullWidthCellRenderer.value = "DetailContent";
      getRowHeight.value = (params) => {
        // you can have normal rows and full width rows any height that you want
        const isFullWidth = params.node.data.isDetail;
        if (isFullWidth) {
          return 100;
        }
      };
    });

    const onGridReady = (params) => {
      gridApi.value = params.api;
      gridColumnApi.value = params.columnApi;

      params.api.addEventListener('custom-sort', (params) => {
        console.log('custom-sort', params)
      })
    };

    const defaultColDef = {
      width: 150,
      sortable: true,
      resizable: true,
      filter: true,
    };

    const onRowClicked = (params) => {
      const currentRow = params.data
      if (currentRow.isDetail) return
      const detailItem = {
        currentRow,
        isDetail: true
      }

      const targetIndex = params.rowIndex + 1
      if (!currentRow.isCollapse) {
        // collapse
        const detailFilter = (row) => !row.isDetail
        const newRowData = [
          ...rowData.value.slice(0, targetIndex).filter(detailFilter),
          detailItem,
          ...rowData.value.slice(targetIndex).filter(detailFilter)
        ]
        newRowData.forEach(row => { row.isCollapse = false })

        currentRow.isCollapse = true
        rowData.value = newRowData
      } else {
        // close collapse
        currentRow.isCollapse = false
        rowData.value.splice(targetIndex, 1)
      }
      
    }

    const getGridData = () => {
      console.log(rowData.value)
    }

    return {
      columnDefs,
      gridApi,
      gridColumnApi,
      rowData,
      pinnedTopRowData,
      pinnedBottomRowData,
      isFullWidthRow,
      fullWidthCellRenderer,
      getRowHeight,
      onGridReady,
      defaultColDef,
      onRowClicked,
      getGridData
    };
  },
};

window.getColumnDefs = function getColumnDefs() {
  const columnDefs = [
    {
      headerName: "",
      field: "isCollapse",
      width: 50,
      resizable: false,
      enableSorting: true
    },
  ];
  alphabet().forEach(function (letter) {
    const colDef = {
      headerName: letter,
      field: letter,
      width: 150,
      cellRenderer: Cell,
      headerComponentParams: {
        customSortEvent: (params) => {
          console.log('headerComponentParams: ', params)
        }
      }
    };
    if (letter === "Z") {
      colDef.pinned = "right";
    }
    columnDefs.push(colDef);
  });
  return columnDefs;
};

window.alphabet = function alphabet() {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
};

window.createData = function createData(count, prefix) {
  const rowData = [];
  for (let i = 0; i < count; i++) {
    const item = {};
    item.isCollapse = false;
    alphabet().forEach(function (letter) {
      item[letter] = prefix + " (" + letter + "," + i + ")";
    });
    rowData.push(item);
  }
  return rowData;
};
</script>

<style lang="scss">
.ag-full-width-row {
  /* --ag-row-border-color: transparent; */
}

.ag-root-wrapper, .ag-root {
  overflow: visible !important;
}

.ag-header {
  position: sticky;
  top: 0;
  z-index: 99999;
}
</style>