import React from 'react';
import {View, StyleSheet, Modal as RNM, SafeAreaView} from 'react-native';
import PluginTools from './plugins';

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.3,
  },
  content: {
    backgroundColor: 'white',

    marginTop: 80,
    marginLeft: 80,
    marginRight: 80,
    height: 200,
  },
});

type ModalProps = {
  isVisible?: boolean;
  onRequestClose?: () => any;
};
type BackdropPublicProps = {
  color?: string;
  opacity?: number;
};
type BackdropProps = BackdropPublicProps & {};

type ContentProps = {};
type PluginProps = {};

type ModalType = React.FC<ModalProps> & {
  Backdrop: React.FC<BackdropProps & {Element?: React.FC<BackdropProps>}>;
  Content: React.FC<ContentProps>;
  Plugins: React.FC<PluginProps>;
};

const Modal: ModalType = ({isVisible, onRequestClose, children}) => {
  let backdropData: BackdropProps | undefined;
  let content: React.ReactElement | undefined;
  let plugins: any = [];
  let BackdropElement = BackdropUI;

  // Map through children to correctly assign the elements of the modal
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) return;

    if ((child.type as any).displayName === ModalBackdrop.displayName) {
      // Assign Backdrop props
      backdropData = child.props;
      if (child.props.Element) {
        // Custom Backdrop provided
        BackdropElement = child.props.Element;
      }
    } else if ((child.type as any).displayName === ModalContent.displayName) {
      // Simply assign the content
      content = child;
    } else if (
      (child.type as any).displayName === ModalPlugins.displayName &&
      !!child.props.children
    ) {
      // Fill the array of plugins
      plugins = Array.isArray(child.props.children)
        ? child.props.children
        : [child.props.children];
    }
  });

  // Prepare Backdrop and Content nodes for dynamic composition with plugins
  let BackdropNode = <>{!!backdropData && <BackdropUI {...backdropData} />}</>;
  let ContentNode = <>{content}</>;

  // Loop through plugins to wrap the Backdrop/Content if they need to
  if (plugins.length > 0) {
    plugins.forEach((plugin: any) => {
      const Child = plugin.type;

      // Gets the React Node tree that contains the PluginTools Elements
      const data = Child({
        config: plugin.props,
        isVisible: isVisible,
      });

      // Each children should be a PluginTool Element
      let pluginElements = data.props.children;
      if (!Array.isArray(pluginElements)) {
        pluginElements = pluginElements !== undefined ? [pluginElements] : [];
      }

      // Compose according to the PluginTool Element provided
      pluginElements.forEach((pluginElement: any) => {
        if (
          pluginElement.type.displayName ===
          PluginTools.BackdropWrapper.displayName
        ) {
          const output = pluginElement.props.children({content: BackdropNode});
          BackdropNode = output;
        } else if (
          pluginElement.type.displayName ===
          PluginTools.ContentWrapper.displayName
        ) {
          const output = pluginElement.props.children({content: ContentNode});
          ContentNode = output;
        }
      });
    });
  }

  return (
    <RNM visible={isVisible || false} onRequestClose={onRequestClose}>
      {BackdropNode}
      {ContentNode}
    </RNM>
  );
};

export const BackdropUI: React.FC<BackdropProps> = ({color, opacity}) => {
  return (
    <View
      style={[
        styles.backdrop,
        {
          backgroundColor: color,
          opacity: opacity,
        },
      ]}
    />
  );
};

// Backdrop Renderer
const ModalBackdrop: React.FC<BackdropProps> = props => {
  return null;
};
ModalBackdrop.displayName = 'ModalBackdrop';

// Content Renderer
const ModalContent: React.FC<ContentProps> = props => {
  return <SafeAreaView style={styles.content}>{props.children}</SafeAreaView>;
};
ModalContent.displayName = 'ModalContent';

// Plugins Manager
const ModalPlugins: React.FC<PluginProps> = props => {
  return null;
};
ModalPlugins.displayName = 'ModalPlugins';

// Exports
(Modal as any).Backdrop = ModalBackdrop;
(Modal as any).Content = ModalContent;
(Modal as any).Plugins = ModalPlugins;

export default Modal;
