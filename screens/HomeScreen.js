import { View, StyleSheet, SafeAreaView, Text, ActivityIndicator, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { initDatabase, insertMenuData, getMenuDataFromDatabase, searchMenuData } from '../database';

export default function HomeScreen() {

  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [noResultsMessage, setNoResultsMessage] = useState('');

  const heroSection = () => {
    return (
      <View style={styles.heroSectionContainer}>
        <View style={styles.heroTextsAndImageContainer}>
          <View style={styles.heroTextsContainer}>
            <Text style={styles.heroSectionTitle}>Little Lemon</Text>
            <Text style={styles.heroSectionSubtitle}>Chicago</Text>
            <Text style={styles.heroSectionDescription}>
              We are a family-owned Mediterranean restaurant, focused on traditional
              recipes served with a modern twist.
            </Text>
          </View>
          <View style={styles.heroImageContainer}>
            <Image source={require('../assets/hero.png')} style={styles.heroImage} />
          </View>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={handleSearch}
          value={searchQuery}
        />
      </View>
    );
  };

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
          fontFamily: 'Karla',
          fontSize: 16,
          color: selectedCategories.includes(category.toLowerCase())
            ? 'white'
            : '#495E57',
        }}>
        {category}
      </Text>
    </TouchableOpacity>
  );


  const Item = ({ title, price, description, image }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const truncatedDescription = description.substring(0, 80);

    const handleReadMoreToggle = () => {
      setShowFullDescription(!showFullDescription);
    };

    return (
      <View style={styles.rectangularFrame}>
        <View style={styles.menuItem}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>
              {showFullDescription ? description : truncatedDescription}
              {description.length > 80 && (
                <Text style={styles.readMoreLink} onPress={handleReadMoreToggle}>
                  {showFullDescription ? ' Read less' : ' ... Read more'}
                </Text>
              )}
            </Text>
            <Text style={styles.price}>$ {price}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
        </View>
      </View>
    );
  };


  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      price={item.price}
      description={item.description}
      image={item.image}
    />
  );

  // Function to handle search bar input and update menu data based on the search query
  const handleSearch = async (query) => {
    // Update searchQuery state with the user's input
    setSearchQuery(query);

    try {
      if (query === '') {
        // If the search query is empty, fetch and display the full menu
        const fullMenuData = await getMenuDataFromDatabase();
        setMenuData(fullMenuData);
        setNoResults(false);
        setNoResultsMessage('');
      } else {
        // If the search query is not empty, perform a search in the database based on the query
        const searchData = await searchMenuData(query);
        const filteredSearchData = searchData.filter((item) =>
          selectedCategories.length === 0
            ? true // If no categories selected, include all items in the search results
            : selectedCategories.includes(item.category.toLowerCase()) // If categories are selected, 
          // include items whose category matches any selected category
        );

        // Update menuData state with the filtered search results
        setMenuData(filteredSearchData);

        if (filteredSearchData.length === 0) {
          // No results found
          if (selectedCategories.length === 0) {
            // No category selected
            setNoResultsMessage(`No results found for "${query}"`);
          } else {
            // Category selected
            const categoryNames = selectedCategories.join(', ');
            setNoResultsMessage(`No results found for "${query}" in ${categoryNames} category`);
          }
          setNoResults(true);
        } else {
          // Results found
          setNoResults(false);
          setNoResultsMessage('');
        }
      }
    } catch (error) {
      // Log an error message if there's an issue with the search
      console.error('Error searching data:', error);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      {heroSection()}
      <View style={styles.categoryButtonsContainer}>
        {renderCategoryButton('Starters')}
        {renderCategoryButton('Desserts')}
        {renderCategoryButton('Mains')}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#495E57" />
      ) : (
        <View>
          {/* Conditional rendering based on search results */}
          {noResults ? (
            <Text style={styles.noResultsText}>{noResultsMessage}</Text>
          ) : (
            // The 'data' prop is filtered based on selected categories. If no category is selected (length is 0),
            // display all items.
            <FlatList
              data={menuData
                .filter((item) =>
                  selectedCategories.length === 0
                    ? true
                    : selectedCategories.includes(item.category.toLowerCase())
                )}
              keyExtractor={({ id }) => id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContentContainer}
            />
          )}
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
    fontSize: 18,
    fontFamily: 'KarlaBold',
    marginBottom: 8,
  },
  price: {
    color: '#495E57',
    fontSize: 24,
    fontFamily: 'markaziBold',
  },
  description: {
    color: '#495E57',
    fontSize: 16,
    fontFamily: 'Karla',
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
    marginVertical: 4,
  },
  categoryButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#495E57',
  },
  flatListContentContainer: {
    paddingBottom: 640,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#495E57',
    fontFamily: 'KarlaBold',
  },
  heroSectionContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 4,
    backgroundColor: '#495E57',
    borderRadius: 8,
    padding: 8,
  },
  heroTextsAndImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextsContainer: {
    flex: 1,
  },
  heroSectionTitle: {
    fontSize: 36,
    fontFamily: 'markaziBold',
    color: '#F4CE14',
  },
  heroSectionSubtitle: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'markazi',
  },
  heroSectionDescription: {
    fontSize: 16,
    color: 'white',
    margin: 4,
    fontFamily: 'Karla',
  },
  heroImageContainer: {
    margin: 4,
  },
  heroImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#F4CE14',
    fontFamily: 'KarlaBold',
  },
  readMoreLink: {
    color: '#495E57',
    textDecorationLine: 'underline',
    fontFamily: 'KarlaBold',
  },
});
