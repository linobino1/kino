const withVideo = (incomingEditor: any) => {
  const editor = incomingEditor;
  const { isVoid } = editor;

  editor.isVoid = (element: any) => (element.type === 'video' ? true : isVoid(element));

  return editor;
};

export default withVideo;
