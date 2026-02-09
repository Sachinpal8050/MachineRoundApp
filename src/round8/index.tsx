import {View, StyleSheet, Text, Image} from 'react-native';
import React, {useEffect} from 'react';
import {NativeModules} from 'react-native';

const IMAGE_SIZE = 50;

const Round8 = () => {
  const {OTAModule} = NativeModules;

  useEffect(() => {
    console.log('Round8 useEffect');
    async function checkAndDownloadBundle() {
      const appId = 'com.machineroundapp';
      const version = '1.0.3';

      try {
        console.log('Bundle ready, restart app starting');
        const extractedPath = await OTAModule.downloadZip(appId, version);
        console.log('Bundle ready, restart app', extractedPath);
      } catch (err) {
        console.warn('OTA failed, fallback to embedded bundle');
      }
    }
    setTimeout(() => {
      checkAndDownloadBundle();
    }, 10000);
  }, []);

  return (
    <View style={styles.container}>
      {/* <View>
        <Text style={{fontSize: IMAGE_SIZE, fontWeight: '100'}}>
          This is some text and here is an image sdf sdf sf sd fsd fsd f sdf sdf
          <View>
            <Image
              source={require('./myimg.png')}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                resizeMode: 'contain',
                borderWidth: 1,
                // marginBottom: -IMAGE_SIZE / 2,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: IMAGE_SIZE,
              fontWeight: 'bold',
              textAlignVertical: 'center',
            }}>
            FREE
          </Text>
          <View>
            <Image
              source={require('./myimg.png')}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                resizeMode: 'contain',
                borderWidth: 1,
                // marginBottom: -IMAGE_SIZE / 2,
                // textAlignVertical: 'center',
              }}
            />
            <Image
              source={require('./images.jpeg')}
              style={{
                width: IMAGE_SIZE,
                height: IMAGE_SIZE,
                resizeMode: 'contain',
                borderWidth: 1,
                // marginBottom: -IMAGE_SIZE / 2,
                // textAlignVertical: 'center',
              }}
            />
          </View>
        </Text>
      </View> */}
      {/* <View> */}
      <Image
        source={require('./myimg.png')}
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          resizeMode: 'contain',
          borderWidth: 1,
          // marginBottom: -IMAGE_SIZE / 2,
        }}
      />
      {/* </View> */}
      <Text>after</Text>
      <Image
        source={require('./myimg.png')}
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          resizeMode: 'contain',
          borderWidth: 1,
          // marginBottom: -IMAGE_SIZE / 2,
        }}
      />
    </View>
  );
};

export default Round8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light gray background for the whole app
    paddingTop: 20,
    paddingHorizontal: 15,
  },
});
