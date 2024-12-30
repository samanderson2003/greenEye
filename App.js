import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "./firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

// Import your screens
import Welcome from "./screens/Welcome";
import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Detection from "./screens/Detection";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Scan from "./screens/Scan";
import ChatBot from './screens/ChatBot'
import Question from "./screens/Question";
import Map from "./screens/Map";
import AddCattle from "./screens/AddCattle";
import VetRegister from "./screens/VetRegister";
import ReportDetail from "./screens/ReportDetail";
import Reports from "./screens/Reports";
import PDFViewer from "./screens/PDFViewer";
import PDFList from "./screens/PDFList";
import MedicalReportScreen from "./screens/MedicalReportScreen";

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import DataVisual from "./screens/DataVisual";
import MyReports from "./screens/MyReports";

// Navigation Containers
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: "#f8f8f8" },
      tabBarActiveTintColor: "#347928",
      tabBarInactiveTintColor: "#666",
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? "home" : "home-outline"}
            size={size}
            color={color}
          />
        ),
      }}
    />

    {/* <Tab.Screen
      name="ChatBot"
      component={ChatBot}
      options={{
        tabBarLabel: "Report",
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? "star" : "star-outline"}
            size={size}
            color={color}
          />
        ),
      }}
    /> */}


    <Tab.Screen
      name="Map"
      component={Map}
      options={{
        tabBarLabel: "Map",
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? "map" : "map-outline"}
            size={size}
            color={color}
          />
        ),
      }}
    />

    {/* <Tab.Screen
      name="Detection"
      component={Detection}
      options={{
        tabBarLabel: "Detection",
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? "search" : "search-outline"}
            size={size}
            color={color}
          />
        ),
      }}
    /> */}


    <Tab.Screen
      name="Chat"
      component={Chat}
      options={{
        tabBarLabel: "Chat",
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? "chatbubbles" : "chatbubbles-outline"}
            size={size}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? "person" : "person-outline"}
            size={size}
            color={color}
          />
        ),
      }}
    />
  </Tab.Navigator>
);


const languageMap = {
  english: 'en',
  tamil: 'ta',
  hindi: 'hi',
};

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("hasLaunched", "true");
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking first launch:", error);
      }
    };
  
    const fetchUserLanguage = async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
              const userLanguage = userDoc.data()?.language || "english"; // Default to "english"
              const languageCode = languageMap[userLanguage.toLowerCase()] || "en"; // Map to language code
              i18n.changeLanguage(languageCode);
            } else {
              console.log("User document does not exist.");
            }
          });
          return () => unsubscribe();
        } else {
          console.log("No authenticated user to fetch language.");
        }
      } catch (error) {
        console.error("Error fetching user language:", error);
      }
    };
  
    // Set up auth state listener
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      setIsLoggedIn(!!user);
  
      // Fetch user language when auth state changes
      if (user) {
        await fetchUserLanguage(user);
      }
    });
  
    // Run first-launch check
    checkFirstLaunch();
  
    return () => {
      // Cleanup auth listener
      unsubscribeAuth();
    };
  }, []);

  if (isFirstLaunch === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00712D" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isFirstLaunch) {
    return <Welcome onComplete={() => setIsFirstLaunch(false)} />;
  }

  return (
    <I18nextProvider i18n={i18n}>
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="VetRegister" component={VetRegister}
            options={{
              headerTitle: "Veternaian",
              headerStyle: { backgroundColor: "#f8f8f8" },
              headerTintColor: "#347928",
            }}
            />
          </>
        ) : (
          <>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
          name="Scan"
          component={Scan}
          options={{
            headerTitle: "Scan",
            headerStyle: { backgroundColor: "#f8f8f8" },
            headerTintColor: "#347928",
          }}
        />
        <Stack.Screen
        name="Question"
        component={Question}
        options={{
          headerTitle: "Report",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
        />
        <Stack.Screen 
        name="ChatBot" 
        component={ChatBot}
          options={{
            headerTitle: "Report",
            headerStyle: { backgroundColor: "#f8f8f8" },
            headerTintColor: "#347928",
          }}
        />
        <Stack.Screen 
        name="AddCattle" 
        component={AddCattle} 
        options={{
          headerTitle: "Add Cattle",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
        />
        <Stack.Screen 
        name="Reports" 
        component={Reports} 
        options={{
          headerTitle: "Reports",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
        />
        <Stack.Screen 
        name="ReportDetail" 
        component={ReportDetail}
        options={{
          headerTitle: "Report Detail",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
        />
        {/* <Stack.Screen 
        name="PDFList" 
        component={PDFList}
        options={{
          headerTitle: "Tips",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
         /> */}
        {/* <Stack.Screen 
        name="PDFViewer" 
        component={PDFViewer} 
        options={{
          headerTitle: "Tips Detail",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
        /> */}
        <Stack.Screen 
        name="MedicalReport" 
        component={MedicalReportScreen}
        options={{
          headerTitle: "Cattle Report",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
          headerLeft: () => null,
        }}
        />
        <Stack.Screen 
        name="DataVisual" 
        component={DataVisual}
        options={{
          headerTitle: "Data Visualiaztion",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
        />
         <Stack.Screen 
        name="Detection" 
        component={Detection}
        options={{
          headerTitle: "Crop Detection",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
        />

      <Stack.Screen 
        name="MyReports" 
        component={MyReports}
        options={{
          headerTitle: "My Reports",
          headerStyle: { backgroundColor: "#f8f8f8" },
          headerTintColor: "#347928",
        }}
        />
   
        </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </I18nextProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default App;