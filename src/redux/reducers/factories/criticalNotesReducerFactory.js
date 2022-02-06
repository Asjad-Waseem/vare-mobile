import { combineReducers } from 'redux';
import { EDIT_CRITICAL_NOTE } from '../../actions/criticalNoteActions';

const initialCriticalNotesState = [
    {
        "noteId": 3,
        "note": "This is a test note",
        "noteType": "critical_note",
        "createdAt": "01-01-2018 01:01:00",
        "updatedAt": "01-02-2018 01:01:00",
        "createdBy": {
            "id": 1,
            "firstName": "John",
            "lastName": "Doe",
            "middleName": ""
        }
    }
]


//This is a factory method to create a reducer for Critical Information entity based on Entity Type (Tort, Case, Collector etc.).
//This method was created because each entity has their own place to store Critical Information items which should be independent.
const criticalNotesReducerFor = (entityType) => {
    const criticalNotesReducer = (state = initialCriticalNotesState, action) => {
        switch(action.type) {

            case entityType + EDIT_CRITICAL_NOTE:
                const {oldCriticalNote, newCriticalNoteText} = action.payload;
                var newCriticalNoteItem = JSON.parse(JSON.stringify(oldCriticalNote)); //create a copy of the original object
                
                //TODO: KD this part of code is only for test purposes.
                newCriticalNoteItem.noteId = 0; //Set id = 0 to create id as new element
                newCriticalNoteItem.createdAt = new Date().toLocaleString();
                newCriticalNoteItem.updatedAt = newCriticalNoteItem.createdAt;
                newCriticalNoteItem.note = newCriticalNoteText;
                newCriticalNoteItem.createdBy = {
                    id: 2,
                    firstName: "Another",
                    lastName: "User",
                    middleName: ""
                }
    
                var newState = [
                    ...state,
                    newCriticalNoteItem
                ];
                return newState;
    
            default:
                return state
        }
    };

    return criticalNotesReducer;
}

export { criticalNotesReducerFor };