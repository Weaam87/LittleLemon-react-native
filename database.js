import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

// Function to initialize the database and table
const initDatabase = () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            // Transaction function to create the 'menu' table if it doesn't exist
            (tx) => {
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS menu (id integer primary key not null, title text, description text, price text, image text, category text);'
                );
            },
            // Transaction error handling
            reject,
            // Transaction success handling
            resolve
        );
    });
};

// Function to insert menu items into the database
const insertMenuData = (menuData) => {
    return new Promise((resolve, reject) => {
        db.transaction(
            // Transaction function to insert menu data
            (tx) => {
                menuData.forEach((item) => {
                    tx.executeSql(
                        'INSERT INTO menu (id, title, description, price, image, category) values (?, ?, ?, ?, ?, ?);',
                        [item.id, item.title, item.description, item.price, item.image, item.category],
                        // Success callback after inserting data
                        (_, result) => {
                            console.log('Data inserted into SQLite:', result.rowsAffected);
                        },
                        // Error callback if insertion fails
                        (_, error) => {
                            console.error('Error inserting data into SQLite:', error);
                            reject(error);
                        }
                    );
                });
            },
            // Transaction error handling
            reject,
            // Transaction success handling
            resolve
        );
    });
};

// Function to retrieve menu items from the database
const getMenuDataFromDatabase = () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            // Transaction function to retrieve menu data
            (tx) => {
                tx.executeSql('SELECT * FROM menu;', [], (_, { rows }) => {
                    const data = rows._array;
                    resolve(data);
                });
            },
            // Transaction error handling
            reject
        );
    });
};

// Function to delete all data from the 'menu' table
const deleteAllMenuData = () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            // Transaction function to delete all data from the 'menu' table
            (tx) => {
                tx.executeSql('DELETE FROM menu;', [], (_, result) => {
                    console.log('All data deleted successfully.');
                    resolve();
                },
                    // Error callback if deletion fails
                    (_, error) => {
                        console.error('Error deleting data:', error);
                        reject(error);
                    });
            },
            // Transaction error handling
            reject
        );
    });
};

export { initDatabase, insertMenuData, getMenuDataFromDatabase, deleteAllMenuData };
