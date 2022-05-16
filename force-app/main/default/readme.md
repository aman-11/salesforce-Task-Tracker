## TIMELINE - A Todo App


1.  Admin Part
    -i.) App Manager -> New -> "APP_NAME"
    -ii.) Deploy 2 LWC *Bookmark, Todo-Input* with **targets="lightning__UtilityBar"**
    -iii.) SAVE and go to Object Manager
    >*"You can think of some work around here to make it in one object"*
    -iv.) Create two Object which hold Task and *Announcements__c (Details, Read?)* && *Todo__c (Description, Due_Date, Created_Date__c, Completed, Type__c)* 
    -v.) Navigate to Tabs *Lightning Page Tabs*, add the New **TAB_NAME**  
    -v.) GO back the App Manage of APP_NAME and in Navigation Items add Newly created Tab **TAB_NAME**, **Announcements__c** & **Todo__c&** Objects

2.  Apex Clases 
    -i.) TodoHandler.cls -> Class to handle *CRUD Operation* over **Todo__c&** & **Announcements__c** 

3.  LWC
    -i.) Announcement -> *Bookmark UI interaction for Uitlity Bar*
    -ii.) DisplayTodo -> *Displays Taks in proper format*
    -iii.) totoInput -> *Create Task UI interaction for Uitlity Bar*