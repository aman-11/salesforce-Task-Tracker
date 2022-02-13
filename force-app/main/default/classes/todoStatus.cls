public with sharing class todoStatus {
    public todoStatus() {

    }
}


/*
public List<String> getPickListValuesIntoList(){
       List<String> pickListValuesList= new List<String>();
		Schema.DescribeFieldResult fieldResult = ObjectApiName.FieldApiName.getDescribe();
		List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
		for( Schema.PicklistEntry pickListVal : ple){
			pickListValuesList.add(pickListVal.getLabel());
		}     
		return pickListValuesList;
    }
*/

//https://developer.salesforce.com/blogs/developer-relations/2008/12/using-the-metadata-api-to-retrieve-picklist-values

/*----------------------------------------------------------------

If you are building a Lightning Web Component that relies on picklist values, 
you could call a custom Apex controller to retrieve those values with the methods that we just described.
But the good news is that there’s a simpler solution. 
You can avoid Apex altogether by calling directly the UI API with the getPicklistValues wire adapter from the lightning/uiObjectInfoApi module.

The getPicklistValues adapter retrieves all picklist values for a given record type and field name. 
Using the adapter is interesting for performance reasons because it benefits from the Lightning Data Service cache. 
Additionally, this also reduces the amount of Apex code you have to maintain and test (no need for a custom Apex controller).

*/