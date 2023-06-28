import { LightningElement, api, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getListProject from "@salesforce/apex/ProjectManagementController.getListProject";
export default class projectManagementPage extends LightningElement {
    dataColumns;
    tableDataPromise;
    selectedRecordId;
    @track project = {};
    @wire(getListProject)
    wiredTableData(result) {
        this.dataColumns = result.data;
        this.tableDataPromise = result;
    }
    refreshData(){
        return refreshApex(this.tableDataPromise);
    }
    handleClose() {
        this.selectedRecordId = null;
    }
    handleRecordClick(event) {
        event.preventDefault();
        this.selectedRecordId = event.target.dataset.recordId;
    }
}