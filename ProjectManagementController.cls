public with sharing class ProjectManagementController{
    @AuraEnabled(cacheable = true)
    public static List<Project__c> getListProject(){
        List<Project__c> listProject = [SELECT Id, description__c, start_date__c, end_date__c, Name
                                        FROM Project__c];
        return listProject.size() > 0 ? listProject : new List<Project__c>();
    }

    @AuraEnabled(cacheable = true)
    public static Project__c getProjectEdit(Id projectId){
        try{
            Project__c project = [SELECT Id, description__c, start_date__c, end_date__c, Name
                                  FROM Project__c
                                  WHERE Id = :projectId
                                  LIMIT 1];
            return project;
        } catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void insertProject(Project__c projectNew){
        try{
            if(String.isBlank(projectNew.Name)){
                throw new AuraHandledException('Project name is blank');
            } else if(projectNew.start_date__c > projectNew.end_date__c){
                throw new AuraHandledException('End date less than start date');
            }else {
                insert projectNew;
            }
        } catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static void updateProject(Project__c projectUpdate){
        try{
            if(String.isBlank(projectUpdate.Name)){
                throw new AuraHandledException('Project name is blank');
            } else if(projectUpdate.start_date__c > projectUpdate.end_date__c){
                throw new AuraHandledException('End date less than start date');
            }else {
                update projectUpdate;
            }
        } catch (Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }

}