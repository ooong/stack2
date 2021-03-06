import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableHighlight, Image, Alert, Modal, Picker } from 'react-native';
import { SearchBar, Button } from 'react-native-elements'
import { WebBrowser } from 'expo';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Explore',
  };

  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      modalVisible: false,
      text: '',
      picture: {
        title: 'testing title',
        pk: 3,
        image: {
          full: "//www.loc.gov/pictures/cdn/service/pnp/highsm/35800/35859r.jpg"
        }
      },
      selectedItem: {},
      collection: ''
    }
    this._handleSearchPress = this._handleSearchPress.bind(this)
    this._getRandomPicFromCollections = this._getRandomPicFromCollections.bind(this)
    this._openModal = this._openModal.bind(this)
    this._closeModal = this._closeModal.bind(this)
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={styles.getStartedContainer}>
            <TextInput
              style={{ height: 80 }}
              placeholder="Put in a search term!"
              onChangeText={(text) => this.setState({ text })}
            />
            <Button
              raised
              backgroundColor="green"
              borderRadius={7}
              containerViewStyle={{ borderRadius: 7 }}
              color="white"
              onPress={() => { this._handleSearchPress() }}
              title="SEARCH"
            />
            <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this._closeModal()}
            >
              <View style={styles.modalContainer}>
                <View style={styles.innerContainer}>
                  <View style={{ padding: 20 }}>
                    <Text>Title: {this.state.selectedItem.title}</Text>
                  </View>
                  <View style={{ padding: 20 }}>
                    <Text>Creator: {this.state.selectedItem.creator}</Text>
                  </View>
                  <View>
                    <Text>Subjects: {this.state.selectedItem.subjects}</Text>
                  </View>
                  <Button
                    onPress={() => this._closeModal()}
                    title="Close"
                  >
                  </Button>
                </View>
              </View>
            </Modal>


            {this.state.pictures &&
              this.state.pictures.map(picture => {
                return (
                  <View
                    style={{ marginVertical: 20 }}
                    key={picture.pk}>

                    <Image
                      borderColor="grey"
                      borderWidth={0.5}
                      borderRadius={2}
                      style={{ width: 300, height: 400 }}
                      source={{ uri: 'http:' + `${picture.image.full}` }}
                    />

                    <Text style={styles.dateFormatting}>{picture.created_published_date}</Text>
                    <Text>{picture.title}</Text>

                    <Button
                      onPress={() => this._openModal(picture.pk)}
                      title="Learn more"
                    />
                  </View>
                )
              })
            }

          </View>
        </ScrollView>
      </View>
    );
  }
  _handleSearchPress = () => {
    fetch('https://loc.gov/pictures/search/?q=' + `${this.state.text}` + '&fo=json')
      .then((response) => {
        return response.json()
      })
      .then(resResults => {
        const results = resResults.results
        const tenResults = results.slice(10)
        const randomizedArray = [];
        while (randomizedArray.length < 10) {
          let random = Math.floor(Math.random() * (200 - 0)) + 0
          if (results[random] !== undefined &&
            !randomizedArray.includes(results[random]) &&
            results[random].image.alt !== "item not digitized thumbnail" &&
            results[random].image.alt !== 'group item thumbnail' &&
            results[random].image.alt !== 'Look magazine thumbnail') {
            randomizedArray.push(results[random]);
          }
        }
        return randomizedArray
      })
      .then(randomizedArray => {
        this.setState({ pictures: randomizedArray })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _getRandomPicFromCollections = (gameResult) => {
    const collectionsArr = [
      'bbc', 'wpapos', 'pga', 'pos', 'var', 'civwar', 'yan', 'stereo', 'app'
    ]
    let collectionIndex = Math.floor(Math.random() * (9 - 0)) + 0
    fetch('https://loc.gov/pictures/search/?co=' + `${collectionsArr[collectionIndex]}` + '&fo=json')
      .then((response) => {
        return response.json()
      })
      .then(responseJson => {
        let results = responseJson.results
        let random = Math.floor(Math.random() * (9 - 0)) + 0
        let finalPic = results[random]
        this.setState({ picture: finalPic })
      })
      .catch((error) => {
        console.error(error);
      })
  }

  _openModal(pictureId) {
    const filteredArr = this.state.pictures.filter(picture => picture.pk === pictureId)
    const item = filteredArr[0]
    this.setState({
      modalVisible: true,
      selectedItem: item
    });
  }

  _closeModal() {
    this.setState({ modalVisible: false });
  }
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  dateFormatting: {
    alignItems: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ddff99',
  },
  innerContainer: {
    alignItems: 'center',
  }
});
