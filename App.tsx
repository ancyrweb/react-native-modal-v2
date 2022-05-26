import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import AnimationPlugin from './src/AnimationPlugin';
import Modal, {BackdropUI} from './src/Modal';

const App = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(!visible), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Modal isVisible={visible} onRequestClose={() => setVisible(false)}>
        <Modal.Backdrop color={'#000'} opacity={0.7} Element={BackdropUI} />
        <Modal.Content>
          <Text>Hello this is some text</Text>
        </Modal.Content>
        <Modal.Plugins>
          <AnimationPlugin />
        </Modal.Plugins>
      </Modal>
    </SafeAreaView>
  );
};

export default App;
