// this is for the indexedDB so that we can locally store object offline

// establish a connected to indexedDB and open the event listener
let db;
const request = indexedDB.open('budget_tracker', 1);

// run if the database version changes
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });
};

// upon success of object store creation (either onupgradeneeded event OR simply establishing a connection), save reference to db gobally
request.onsuccess = function(event) {
    db = event.target.result;

    // check if app is online
    if (navigator.onLine) {
        // uploadBudget();
    }
};

request.onerror = function(event) {
    console.log('>> error uploading to database >>', event.target.errorCode);
};

// execute if there is a new entry and no internet connection
function saveRecord(record) {

    // open a new transaction with the db with read/write permissions
    const transaction = db.transaction(['new_budget'], 'readWrite');

    // access the object store for new_budget
    const budgetObjectStore = transaction.objectStore('new_budget');

    // add record to store with add method
    budgetObjectStore.add(record);
}