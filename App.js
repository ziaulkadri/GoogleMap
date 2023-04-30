import React, { useEffect, useState } from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
const mockPlaces = [
	{
		place_id: '1',
		name: 'Mock Restaurant 1',
		vicinity: '123 Mock St, Mockville',
		geometry: {
			location: {
				lat: 28.56229,
				lng: 77.27977,
			},
		},
	},
	{
		place_id: '2',
		name: 'Mock Restaurant 2',
		vicinity: '456 Mock Ave, Mocktown',
		geometry: {
			location: {
				lat: 28.5596626,
				lng: 77.2736326,
			},
		},
	},
	{
		place_id: '3',
		name: 'Mock Restaurant 3',
		vicinity: '789 Mock Blvd, Mockborough',
		geometry: {
			location: {
				lat: 28.557,
				lng: 77.281,
			},
		},
	},
	{
		place_id: '4',
		name: 'Mock Restaurant 4',
		vicinity: '456 Mock Ave, Mocktown',
		geometry: {
			location: {
				lat: 28.557,
				lng: 77.281,
			},
		},
	},
];

export default function App() {
	const [pin, setPin] = useState({
		latitude: 28.5569131,
		longitude: 77.2832108,
	});
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setPin({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			});
			setLocation(location);
		})();
	}, []);

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				initialRegion={{
					latitude: 28.5569131,
					longitude: 77.2832108,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				showsUserLocation={true}
				onUserLocationChange={(e) => {
					setPin({
						latitude: e.nativeEvent.coordinate.latitude,
						longitude: e.nativeEvent.coordinate.longitude,
					});
				}}
			>
				<Marker
					coordinate={pin}
					pinColor="red"
					draggable={true}
					onDragEnd={(e) => {
						setPin({
							latitude: e.nativeEvent.coordinate.latitude,
							longitude: e.nativeEvent.coordinate.longitude,
						});
					}}
				>
					<Callout>
						<Text>This is my current Location</Text>
					</Callout>
				</Marker>
				{mockPlaces.map((place) => (
					<Marker
						key={place.place_id}
						coordinate={{
							latitude: place.geometry.location.lat,
							longitude: place.geometry.location.lng,
						}}
						title={place.name}
						description={place.vicinity}
					/>
				))}
				<Circle center={pin} radius={100} />
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		width: '100%',
		height: '100%',
	},
});
