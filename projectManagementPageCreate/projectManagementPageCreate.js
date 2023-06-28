import { LightningElement } from 'lwc';
import insertProject from '@salesforce/apex/ProjectManagementController.insertProject';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ProjectManagementPageCreate extends LightningElement {
    isShowErrorField = false;
    isShowErrorFieldStartDate = false;
    handleOnChange() {
        const valueName = this.template.querySelector('lightning-input[data-id="Name"]').value;
        if (valueName.trim() == '' || valueName == undefined) {
            this.isShowErrorField = true;
        } else {
            this.isShowErrorField = false;
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
    handleReset() {
        this.template.querySelectorAll('lightning-input').forEach(field => {
            field.value = '';
        })
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
    handleSubmit() {
        const valueFields = this.template.querySelectorAll('lightning-input');
        if (valueFields[0].value.trim() == '' || valueFields[0] == undefined) {
            this.isShowErrorField = true;
        } else if (valueFields[2].value && valueFields[1].value.trim() == '') {
            this.isShowErrorFieldStartDate = true;
            this.handleShowMessage('Error', 'Error required. Enter value start date', 'error');
        } else if (valueFields[1].value > valueFields[2].value) {
            this.handleShowMessage('Error', 'Error. End date less than start date.', 'error');
        } else {
            const dataProjectNew = {};
            valueFields.forEach(field => {
                const id = field.dataset.id;
                const value = field.value;
                dataProjectNew[id] = value;
            });
            insertProject({ projectNew: dataProjectNew })
                .then(result => {
                    this.handleShowMessage('Project created', 'New project created.', 'success');
                    this.handleCustomEvent('success');
                    this.handleReset();
                })
                .catch(error => {
                    this.handleShowMessage('Error', error.message, 'error')
                });
        }
    }
}