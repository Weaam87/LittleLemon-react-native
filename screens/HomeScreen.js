import { View, StyleSheet, SafeAreaView, Text, ActivityIndicator, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { initDatabase, insertMenuData, getMenuDataFromDatabase } from './database';

export default function HomeScreen() {

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchMenuData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Weaam87/App-capstone-data/main/menu.json');
      const data = await response.json();
      setMenuData(data.menu);
      insertMenuData(data.menu); // Store data in the SQLite database
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize the database on component mount
    initDatabase();

    // Fetch menu data from the remote server if the database is empty
    getMenuDataFromDatabase((data) => {
      if (data.length === 0) {
        fetchMenuData();
      } else {
        setMenuData(data);
        setLoading(false);
        console.log('Data from SQLite Database:', data);
      }
    });
  }, []);

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
      {loading ? (
        <ActivityIndicator size="large" color="#495E57" />
      ) : (
        <View>
          <FlatList data={menuData}
            keyExtractor={({ id }) => id.toString()}
            renderItem={renderItem} />
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
});
