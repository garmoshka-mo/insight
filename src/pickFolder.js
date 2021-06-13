import s from "./services";
import actionsSheetController from "./actionsSheetController";
import {Text, TouchableOpacity, View} from 'react-native'
import styles, {colors} from "./styles";
import React from "../utils/react-tuned";
import {defer} from "../utils/sugar";

export default function pickFolder(path = '') {
  var promise = defer()
  renderFolder(path)
  return promise

  async function renderFolder(path) {
    let response = await s.dropbox.filesListFolder({path})

    actionsSheetController.open(<View>
      {
        response?.result?.entries
          .filter(_ => _[".tag"] == "folder")
          .map(folder)
      }
      {button('Select folder', _=> {
        promise.resolve(path)
        actionsSheetController.close()
      }, {textAlign: 'center'})}
    </View>)
  }

  function folder(folder) {
    return button(folder.name, _=> renderFolder(folder.path_lower))
  }

  function button(title, callback, style) {
    return <TouchableOpacity
      key={title}
      style={{paddingHorizontal: 10,
        padding: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.shadow
      }}
      onPress={callback}
    >
      <Text style={[styles.text, style]}>
        {title}
      </Text>
    </TouchableOpacity>
  }

}