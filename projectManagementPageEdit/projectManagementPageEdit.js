import { LightningElement, api, wire } from 'lwc';
import getProjectEdit from '@salesforce/apex/ProjectManagementController.getProjectEdit';
import updateProject from '@salesforce/apex/ProjectManagementController.updateProject';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ProjectManagementPageEdit extends LightningElement {
    @api recordId;
    isShowModal = false;
    isShowErrorFieldName = false;
    isShowErrorFieldStartDate = false;
    record;
    @wire(getProjectEdit, { projectId: '$recordId' })
    wiredRecord({ data, error }) {
        if (data) {
            this.record = data;
            this.isShowModal = true;
        } else if (error) {
            this.isShowModal = false;
        }
    }
    handleOnChange() {
        const valueName = this.template.querySelector('lightning-input[data-id="Name"]').value;
        if (valueName.trim() == '' || valueName == undefined) {
            this.isShowErrorFieldName = true;
        } else {
            this.isShowErrorFieldName = false;
        }
    }
    handleOnChangeStartDate() {
        const valueName = this.template.querySelector('lightning-input[data-id="start_date__c"]').value;
        if (valueName.trim() == '' || valueName == undefined) {
            this.isShowErrorFieldStartDate = true;
        } else {
            this.isShowErrorFieldStartDate = false;
        }
    }
    handleClose() {
        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent);
    }
    handleShowMessage(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
    handleCustomEvent(nameEvent) {
        const customEvent = new CustomEvent(nameEvent);
        this.dispatchEvent(customEvent);
    }
    handleReset() {
        this.template.querySelectorAll('lightning-input').forEach(field => {
            field.value = '';
        })
    }
    handleSave() {
        const valueFields = this.template.querySelectorAll('lightning-input');
        if (valueFields[0].value.trim() == '' || valueFields[0] == undefined) {
            this.isShowErrorFieldName = true;
        } else if (valueFields[2].value && valueFields[1].value.trim() == '') {
            this.isShowErrorFieldStartDate = true;
            this.handleShowMessage('Error', 'Error required. Enter value start date', 'error');
        } else if (valueFields[1].value > valueFields[2].value) {
            this.handleShowMessage('Error', 'Error. End date less than start date.', 'error');
        } else {
            const dataProjectNew = {};
            dataProjectNew.Id = this.recordId;
            valueFields.forEach(field => {
                const id = field.dataset.id;
                const value = field.value;
                dataProjectNew[id] = value;
            });
            updateProject({ projectUpdate: dataProjectNew })
                .then(result => {
                    this.handleReset();
                    this.handleShowMessage('Project Update', 'Project updated.', 'success');
                    this.handleCustomEvent('updated');
                    this.handleClose();
                })
                .catch(error => {
                    this.handleShowMessage('Error', error.message, 'error')
                });
        }
    }
}