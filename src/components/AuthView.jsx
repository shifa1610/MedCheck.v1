import React from 'react';
import AuthScreen from './AuthScreen';

export default function AuthView({
  initialMode = 'login',
  onAuthSuccess,
  onCancel,
  currentLang = 'en',
  setCurrentLang = () => {}
}) {
  return (
    <AuthScreen
      initialMode={initialMode}
      onAuthenticated={onAuthSuccess}
      onCancel={onCancel}
      currentLang={currentLang}
      setCurrentLang={setCurrentLang}
    />
  );
}
