import { openDB } from 'idb';

const initdb = async () =>
  openDB('tbd', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('tbd')) {
        console.log('tbd database already exists');
        return;
      }
      db.createObjectStore('tbd', { keyPath: 'id', autoIncrement: true });
      console.log('tbd database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  console.log("Put to the database");

  // Creates a connection to the tbd database and version.
  const tbdDb = await openDB("tbd", 1);

  // Creates a new transaction and specifies the database and data privileges.
  const tx = tbdDb.transaction("tbd", "readwrite");

  // Opens up the desired object store.
  const store = tx.objectStore("tbd");

  // Uses the .put() method on the store and passes in the content.
  const request = store.put({ id: 1, value: content });

  // Gets confirmation of the request.
  const result = await request;

  if (result !== undefined) {
    console.log("Data saved to the database, ID:", result);

    // Fetch the newly inserted data to confirm it was saved correctly.
    const savedData = await store.get(result);
    console.log("Saved data:", savedData.value);
    return savedData.value;
  } else {
    console.log(
      "Oops! Your text was eaten and NOT saved to the database."
    );
    return null;
  }
};

// Exports a function to get the database.
export const getDb = async () => {
  console.log("Get all notes from the database");

  // Creates a connection to the tbd database and version.
  const tbdDb = await openDB("tbd", 1);

  // Creates a new transaction and specifies the database and data privileges.
  const tx = tbdDb.transaction("tbd", "readonly");

  // Opens up the desired object store.
  const store = tx.objectStore("tbd");

  // Uses the .get(1) method to retrieve the value of the first record matching the query.

  const request = store.get(1);

  // Gets confirmation of the request.
  const result = await request;
  result
    ? console.log("Notes retrieved from database:", result.value)
    : console.log("No notes found in database! Are you SURE you even wrote any?!");
  return result?.value;
};

initdb();
