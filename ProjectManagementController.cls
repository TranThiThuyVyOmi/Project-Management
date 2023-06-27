public with sharing class ProjectManagementController{
    @AuraEnabled(cacheable = true)
    public static List<Project__c> getListProject(){
        List<Project__c> listProject = [SELECT Id, description__c, start_date__c, end_date__c, Name
                                        FROM Project__c];
        return listProject.size() > 0 ? listProject : new List<Project__c>();
    }

    @AuraEnabled(cacheable = true)
    public static Project__c getProjectEdit(Id idProject){
        Project__c project = [SELECT Id, description__c, start_date__c, end_date__c, Name
                              FROM Project__c
                              WHERE Id = :idProject
                              LIMIT 1];
        return project;
    }

    @AuraEnabled
    public static void insertProject(Project__c newProject){
        try{
            insert newProject;
        } catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void updateProject(Project__c updateProject){
        try{
            update updateProject;
        } catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

}