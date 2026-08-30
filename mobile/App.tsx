import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeb3 } from './hooks/useWeb3';
import { useNFTData } from './hooks/useNFTData';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ARScreen from './screens/ARScreen';
import VitalSignsScreen from './screens/VitalSignsScreen';
import DNALabScreen from './screens/DNALabScreen';
import CareCenterScreen from './screens/CareCenterScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const { account, connect, disconnect } = useWeb3();
  const { nftData, loading, refresh } = useNFTData();

  useEffect(() => {
    if (account) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [account]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      Alert.alert('Error', 'Failed to connect wallet');
    }
  };

  const MainTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'AR':
              iconName = focused ? 'camera' : 'camera-outline';
              break;
            case 'Vitals':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'DNA':
              iconName = focused ? 'dna' : 'dna-outline';
              break;
            case 'Care':
              iconName = focused ? 'medkit' : 'medkit-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#1F1F1F',
          borderTopColor: '#374151',
        },
        headerStyle: {
          backgroundColor: '#1F1F1F',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Living NFT' }}
      />
      <Tab.Screen 
        name="AR" 
        component={ARScreen}
        options={{ title: 'AR View' }}
      />
      <Tab.Screen 
        name="Vitals" 
        component={VitalSignsScreen}
        options={{ title: 'Vital Signs' }}
      />
      <Tab.Screen 
        name="DNA" 
        component={DNALabScreen}
        options={{ title: 'DNA Lab' }}
      />
      <Tab.Screen 
        name="Care" 
        component={CareCenterScreen}
        options={{ title: 'Care Center' }}
      />
    </Tab.Navigator>
  );

  const ConnectionScreen = () => (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <Text style={styles.title}>Living NFT</Text>
        <Text style={styles.subtitle}>Bio-morphic Digital Entities</Text>
        
        <View style={styles.iconContainer}>
          <Ionicons name="dna" size={120} color="#8B5CF6" />
        </View>
        
        <Text style={styles.description}>
          Connect your wallet to manage your Living NFTs in augmented reality. 
          Watch them evolve, feed them, and explore their DNA.
        </Text>
        
        <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
          <Text style={styles.connectButtonText}>Connect Wallet</Text>
        </TouchableOpacity>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="camera" size={24} color="#8B5CF6" />
            <Text style={styles.featureText}>AR Visualization</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="heart" size={24} color="#8B5CF6" />
            <Text style={styles.featureText}>Real-time Vitals</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="flask" size={24} color="#8B5CF6" />
            <Text style={styles.featureText}>DNA Analysis</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isConnected ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Connection" component={ConnectionScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#9CA3AF',
    marginBottom: 40,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    maxWidth: 300,
  },
  connectButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  features: {
    width: '100%',
    maxWidth: 300,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    color: '#D1D5DB',
    fontSize: 16,
    marginLeft: 12,
  },
});
