// チャット画面の設定ファイル
export const chatConfig = {
  // メッセージ設定
  messages: {
    maxMessages: parseInt(process.env.REACT_APP_CHAT_MAX_MESSAGES) || 100,
    messageHeight: parseInt(process.env.REACT_APP_CHAT_MESSAGE_HEIGHT) || 60,
    fontSize: parseInt(process.env.REACT_APP_CHAT_FONT_SIZE) || 14,
    fontFamily: process.env.REACT_APP_CHAT_FONT_FAMILY || 'Arial, sans-serif',
  },
  
  // 色設定
  colors: {
    backgroundColor: process.env.REACT_APP_CHAT_BACKGROUND_COLOR || '#ffffff',
    textColor: process.env.REACT_APP_CHAT_TEXT_COLOR || '#000000',
    userBubbleColor: process.env.REACT_APP_CHAT_BUBBLE_COLOR_USER || '#007bff',
    assistantBubbleColor: process.env.REACT_APP_CHAT_BUBBLE_COLOR_ASSISTANT || '#f8f9fa',
    userTextColor: process.env.REACT_APP_CHAT_USER_TEXT_COLOR || '#ffffff',
    assistantTextColor: process.env.REACT_APP_CHAT_ASSISTANT_TEXT_COLOR || '#000000',
  },
  
  // 入力エリア設定
  input: {
    height: parseInt(process.env.REACT_APP_CHAT_INPUT_HEIGHT) || 50,
    placeholder: process.env.REACT_APP_CHAT_INPUT_PLACEHOLDER || 'メッセージを入力してください...',
    maxLength: parseInt(process.env.REACT_APP_CHAT_INPUT_MAX_LENGTH) || 1000,
    enableEnterSend: process.env.REACT_APP_CHAT_ENABLE_ENTER_SEND === 'true',
  },
  
  // レイアウト設定
  layout: {
    headerHeight: parseInt(process.env.REACT_APP_CHAT_HEADER_HEIGHT) || 60,
    messageAreaHeight: process.env.REACT_APP_CHAT_MESSAGE_AREA_HEIGHT || 'calc(100vh - 120px)',
    showTimestamp: process.env.REACT_APP_CHAT_SHOW_TIMESTAMP === 'true',
    showAvatar: process.env.REACT_APP_CHAT_SHOW_AVATAR === 'true',
  },
  
  // アニメーション設定
  animation: {
    enableFadeIn: process.env.REACT_APP_CHAT_ENABLE_FADE_IN === 'true',
    enableSlideIn: process.env.REACT_APP_CHAT_ENABLE_SLIDE_IN === 'true',
    animationDuration: parseInt(process.env.REACT_APP_CHAT_ANIMATION_DURATION) || 300,
  }
};
