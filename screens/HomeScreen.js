import { View, StyleSheet, SafeAreaView, Text, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { initDatabase, insertMenuData, getMenuDataFromDatabase } from '../database';

export default function HomeScreen() {

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchAndInsertMenuData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Weaam87/App-capstone-data/main/menu.json');
      const data = await response.json();
      setMenuData(data.menu);
      await insertMenuData(data.menu); // Store data in the SQLite database
    } catch (error) {
      console.error('Error fetching or inserting menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize the database on component mount
        await initDatabase();

        // Fetch menu data from the remote server if the database is empty
        getMenuDataFromDatabase().then((data) => {
          if (data.length === 0) {
            return fetchAndInsertMenuData();
          } else {
            setMenuData(data);
            setLoading(false);
            console.log('Data from SQLite Database:', data);
          }
        })
          .catch((error) => {
            console.error('Error fetching data from the database:', error);
          });
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle category button press
  const handleCategoryPress = (category) => {
    const lowerCaseCategory = category.toLowerCase();
    // Check if the category is already selected
    if (selectedCategories.includes(lowerCaseCategory)) {
      // If selected, remove it from the list
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((prevCategory) => prevCategory !== lowerCaseCategory)
      );
    } else {
      // If not selected, add it to the list
      setSelectedCategories((prevCategories) => [...prevCategories, lowerCaseCategory]);
    }
  };

  // Function to render category filter button
  const renderCategoryButton = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        {
          backgroundColor: selectedCategories.includes(category.toLowerCase())
            ? '#495E57'
            : 'white',
        },
      ]}
      onPress={() => handleCategoryPress(category)}>
      <Text
        style={{
          color: selectedCategories.includes(category.toLowerCase())
            ? 'white'
            : '#495E57',
        }}>
        {category}
      </Text>
    </TouchableOpacity>
  );


  const Item = ({ title, price, description, image }) => (
    <View style={styles.rectangularFrame}>
      <View style={styles.menuItem}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.price}>$ {price}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      price={item.price}
      description={item.description}
      image={item.image}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.categoryButtonsContainer}>
        {renderCategoryButton('Starters')}
        {renderCategoryButton('Desserts')}
        {renderCategoryButton('Mains')}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#495E57" />
      ) : (
        <View>
          {/*
            - The 'data' prop is filtered based on selected categories. If no category is selected (length is 0),
            display all items.
          */}
          <FlatList
            data={menuData.filter((item) =>
              selectedCategories.length === 0
                ? true
                : selectedCategories.includes(item.category.toLowerCase())
            )}
            keyExtractor={({ id }) => id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    color: '#495E57',
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    color: '#495E57',
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center items vertically
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  rectangularFrame: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    margin: 8,
    padding: 8,
  },
  categoryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  categoryButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#495E57',
  },
});
