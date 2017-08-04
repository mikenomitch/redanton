import React from 'react'

import {
  Button,
  View,
  TextInput,
  Text
} from 'react-native'

class Auth extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      username: 'wat',
      password: 'super sekret'
    }
  }

  render() {
    const {username, password} = this.state

    return (
      <View style={{padding: 50}}>
        <Text> Login! </Text>

        <TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="username"
          value={username}
          onChangeText={(username) => this.setState({username})}
        />

        <TextInput
          style={{height: 60, fontSize: 18}}
          placeholder="password"
          value={password}
          onChangeText={(password) => this.setState({password})}
        />

        <Button title="Remove Post" onPress={() => {alert(this.state.password)}} />
      </View>
    )
  }
}

export default Auth
