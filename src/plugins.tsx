type ContentWrapperProps = {
  children: ({content: any}) => any;
};

type BackdropWrapperProps = {
  children: ({content: any}) => any;
};

const ContentWrapper = (props: ContentWrapperProps) => {
  return null;
};
ContentWrapper.displayName = 'ContentWrapper';

const BackdropWrapper = (props: BackdropWrapperProps) => {
  return null;
};
BackdropWrapper.displayName = 'BackdropWrapper';

const PluginTools = {
  ContentWrapper,
  BackdropWrapper,
};

export default PluginTools;
