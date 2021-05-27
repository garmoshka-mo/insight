import AsyncStorage from '@react-native-async-storage/async-storage'

export default new class {

  constructor() {
    this.load()
  }

  async load() {
    var data = await AsyncStorage.get(`settings`)
    Object.assign(this, data)
  }

  update(data) {
    Object.assign(this, data)
    AsyncStorage.set(`settings`, this)
  }

}