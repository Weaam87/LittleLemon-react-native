import * as SQLite from 'expo-sqlite';

// Create the SQLite database
const db = SQLite.openDatabase('little_lemon');

// Function to initialize the database and table
const initDatabase = () => {
    db.transaction((tx) => {
        // Create the 'menu' table if it doesn't exist
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS menu (id integer primary key not null, title text, description text, price text, image text, category text);'
        );
    });
};

// Function to insert menu items into the database
const insertMenuData = (menuData) => {
    db.transaction((tx) => {
        menuData.forEach((item) => {
            tx.executeSql(
                'INSERT INTO menu (id ,title, description, price, image, category) values (?, ?, ?, ?, ?, ?);',
                [item.id, item.title, item.description, item.price, item.image, item.category],
                (_, result) => {
                    console.log('Data inserted into SQLite:', result.rowsAffected);
                },
                (_, error) => {
                    console.error('Error inserting data into SQLite:', error);
                }
            );
        });
    });
};

// Function to retrieve menu items from the database
const getMenuDataFromDatabase = (callback) => {
    db.transaction((tx) => {
        tx.executeSql(`SELECT * FROM menu;`, [], (_, { rows }) => {
            const data = rows._array;
            console.log('Data from SQLite Database db file:', data);
            callback(data);
        });
    });
};

// Function to delete all data from the 'menu' table
const deleteAllMenuData = () => {
    db.transaction((tx) => {
        tx.executeSql('DELETE FROM menu;', [], (_, result) => {
            // Handle success if needed
            console.log('All data deleted successfully.');
        },
            (_, error) => {
                // Handle error if needed
                console.error('Error deleting data:', error);
            });
    });
};

export { initDatabase, insertMenuData, getMenuDataFromDatabase, deleteAllMenuData };
