import { LightningElement, api, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getListProject from "@salesforce/apex/ProjectManagementController.getListProject";
import insertProject from '@salesforce/apex/ProjectManagementController.insertProject';
import getProjectEdit from '@salesforce/apex/ProjectManagementController.getProjectEdit';
import updateProject from '@salesforce/apex/ProjectManagementController.updateProject';
export default class TaskTraining extends LightningElement {
    dataColumns;
    tableDataPromise;
    dataProjectEdit;
    a_Id_Project_Ref;
    a_Project_Name_Ref;
    a_Start_Date_Ref;
    a_End_Date_Ref;
    a_Description_Ref;
    a_Project_Name_Edit;
    a_Start_Date_Edit;
    a_End_Date_Edit;
    a_Description_Edit;
    @track isModalOpen = false;
    @track project = {};
    @wire(getListProject)
    wiredTableData(result) {
        this.dataColumns = result.data;
        this.tableDataPromise = result;
    }
    handle_Project_Name_Change(event) {
        this.a_Project_Name_Ref = event.detail.value;
        this.project.Name = this.a_Project_Name_Ref;
    }
    handle_Start_Date_Change(event) {
        this.a_Start_Date_Ref = event.detail.value;
        this.project.start_date__c = this.a_Start_Date_Ref;
    }
    handle_End_Date_Change(event) {
        this.a_End_Date_Ref = event.detail.value;
        this.project.end_date__c = this.a_End_Date_Ref;
    }
    handle_Description_Change(event) {
        this.a_Description_Ref = event.detail.value;
        this.project.description__c = this.a_Description_Ref;
    }
    handle_Reset() {
        this.a_Project_Name_Ref = "";
        this.a_Start_Date_Ref = "";
        this.a_End_Date_Ref = "";
        this.a_Description_Ref = "";
    }
    openModal(event) {
        this.isModalOpen = true;
        let id = [];
        id = event.currentTarget.id.split("-");
        this.a_Id_Project_Ref = id[0];
        getProjectEdit({ idProject: this.a_Id_Project_Ref })
            .then(result => {
                this.a_Project_Name_Edit = result.Name,
                    this.a_Start_Date_Edit = result.start_date__c,
                    this.a_End_Date_Edit = result.end_date__c,
                    this.a_Description_Edit = result.description__c
            })
    }
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        const a_Project_Name = this.template.querySelector('lightning-input[data-id="a_Project_Name_Edit"]');
        const a_Start_Date = this.template.querySelector('lightning-input[data-id="a_Start_Date_Edit"]');
        const a_End_Date = this.template.querySelector('lightning-input[data-id="a_End_Date_Edit"]');
        const a_Description = this.template.querySelector('lightning-input[data-id="a_Description_Edit"]');
        this.project.Id = this.a_Id_Project_Ref;
        this.project.Name = a_Project_Name.value;
        this.project.start_date__c = a_Start_Date.value;
        this.project.end_date__c = a_End_Date.value;
        this.project.description__c = a_Description.value;
        if (this.a_Start_Date > this.a_End_Date) {
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Error creating project. End date less than start date',
                variant: 'error'
            });
            this.dispatchEvent(event);
        } else {
            updateProject({ updateProject: this.project })
            .then(result => {
                const event = new ShowToastEvent({
                    title: 'project created',
                    message: 'Update project ',
                    variant: 'success'
                });
                this.dispatchEvent(event);
                return refreshApex(this.tableDataPromise);
            })
            .catch(error => {
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'Error update project. Please Contact System Admin',
                    variant: 'error'
                });
                this.dispatchEvent(event);
            });
            this.isModalOpen = false;
        }
    }
    async handle_Submit(event) {
        if (this.a_Start_Date_Ref > this.a_End_Date_Ref) {
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Error creating project. End date less than start date',
                variant: 'error'
            });
            this.dispatchEvent(event);
        } else {
            insertProject({ newProject: this.project })
                .then(result => {
                    const event = new ShowToastEvent({
                        title: 'project created',
                        message: 'New project ' + this.a_Project_Name_Ref + ' ' + this.a_Start_Date_Ref + ' created.',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);
                    this.handle_Reset();
                    return refreshApex(this.tableDataPromise);
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Error creating project. Please Contact System Admin',
                        variant: 'error'
                    });
                    this.dispatchEvent(event);
                });
        }
    }

}