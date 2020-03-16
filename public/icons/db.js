let db;
// create request for a budget db
const request = indexedDB.open("budget", 1);

request.onupgradeneeded =function(event){
    //
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
};

request.onsuccess = function (event){
    db = event.target.result;

    //checking if app is online before getting db
    if (navigator.onLine){
        checkDB();
    }
};

request.onerror = function(event){
    console.log("error"+ event.target.errorCode);
};

function saveRecord(record){
    const transaction = db.transaction(["pending"], "readwrite");

    //accessing store
    const store = transaction.createObjectStore("pending");

    //adding record
    store.add(record);

}

function checkDB(){
    //open transaction on the pending db
    const transaction = db.transaction(["pending"], "readwrite");
    //access object store
    const store = transaction.objectStore("pending");
    //retrieve all records and set to var
    const getAll = store.getAll();

    getAll.onsuccess = function (){
        if (getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify.(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
                })
            .then(response => response.json())
            .then(() => {
                const transaction =db.transaction(["pending"],"readWrite");

                const store = transaction.objectStore("pending");

                //clearing items in store
                store.clear();
            });
        }
    };
}

//listen to come back online

window.addEventListener("online",checkDB);
