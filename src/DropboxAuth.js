/** @providesModule DropboxAuth
 **/

import React, {Component} from "../utils/react-tuned"
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import {Dropbox, DropboxAuth} from 'dropbox'


export default class extends Component {

  state = {}

  componentDidMount() {
    this.init()
  }

  render() {
    return (
      <View>
        {this.authUrl()}
      </View>
    )
  }

  authUrl() {
    if (!this.state.authUrl) return

    return (
      <TouchableOpacity
        style={{margin: 20}}
        activeOpacity={1}
        onPress={() => Linking.openURL(this.state.authUrl)}
      >
        <Text style={{fontSize: 20}}>Auth url</Text>
      </TouchableOpacity>
    )
  }





  // LOGIC

  // todo move logic to service
  init() {
    if (this.isAuthenticated()) {
      this.showPageSection('authed-section');

      // Create an instance of Dropbox with the access token and use it to
      // fetch and render the files in the users root directory.
      var dbx = new Dropbox({ accessToken: this.getAccessTokenFromUrl() });
      dbx.filesListFolder({path: ''})
        .then(function(response) {
          this.renderItems(response.result.entries);
        })
        .catch(function(error) {
          console.error(error);
        });
    } else {
      this.showPageSection('pre-auth-section');

      // Set the login anchors href using dbx.getAuthenticationUrl()
      var dbx = new Dropbox({ clientId: this.CLIENT_ID });
      var authUrl = dbx.auth.getAuthenticationUrl('http://localhost:8080/auth')
        .then((authUrl) => {
          this.setState( { authUrl })
          console.log('then auth url', authUrl)
          //document.getElementById('authlink').href = authUrl;
        })
    }
  }

  CLIENT_ID = '42zjexze6mfpf7x';
  // Parses the url and gets the access token if it is in the urls hash
  getAccessTokenFromUrl() {
    console.log('getAccessTokenFromUrl')
    //return utils.parseQueryString(window.location.hash).access_token; // this utils : https://github.com/dropbox/dropbox-sdk-js/blob/main/examples/javascript/utils.js
  }

  // If the user was just redirected from authenticating, the urls hash will
  // contain the access token.
  isAuthenticated() {
    return !!this.getAccessTokenFromUrl();
  }

  // Render a list of items to #files
  renderItems(items) {
    console.log('renderItems', items)
    /*
    var filesContainer = document.getElementById('files');
    items.forEach(function(item) {
      var li = document.createElement('li');
      li.innerHTML = item.name;
      filesContainer.appendChild(li);
    });

     */
  }

  // This example keeps both the authenticate and non-authenticated setions
  // in the DOM and uses this function to show/hide the correct section.
  showPageSection(elementId) {
    console.log('showPageSection', elementId)
    //document.getElementById(elementId).style.display = 'block';
  }

}