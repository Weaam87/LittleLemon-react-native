import * as SQLite from 'expo-sqlite';

// Create the SQLite database
const db = SQLite.openDatabase('little_lemon');

// Function to initialize the database and table
const initDatabase = () => {
    db.transaction((tx) => {
        // Create the 'menu' table if it doesn't exist
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS menu (id integer primary key not null, title text, price text, description text, image text);'
        );
    });
};

// Function to insert menu items into the database
const insertMenuData = (menuData) => {
    db.transaction((tx) => {
        menuData.forEach((item) => {
            tx.executeSql(
                'INSERT INTO menu (title, price, description, image) values (?, ?, ?, ?);',
                [item.title, item.price, item.description, item.image]
            );
        });
    });
};

// Function to retrieve menu items from the database
const getMenuDataFromDatabase = (callback) => {
    db.transaction((tx) => {
        tx.executeSql(`SELECT * FROM menu;`, [], (_, { rows }) => {
            // Convert the rows object to an array
            const data = rows._array;
            callback(data);
        });
    });
};

export { initDatabase, insertMenuData, getMenuDataFromDatabase };
