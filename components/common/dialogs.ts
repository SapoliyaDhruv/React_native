import { Alert, Platform } from 'react-native';

/**
 * Cross-platform dialogs. React Native Web's `Alert.alert` is a no-op, so on
 * web we fall back to the browser's confirm/alert; on Android/iOS we use the
 * native Alert. Keeps buttons like "Submit test" working everywhere.
 */

export function notify(title: string, message?: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function confirmAction({ title, message, confirmText, cancelText, destructive, onConfirm, onCancel }: ConfirmOptions) {
  if (Platform.OS === 'web') {
    const ok = typeof window !== 'undefined' && window.confirm(message ? `${title}\n\n${message}` : title);
    if (ok) onConfirm();
    else onCancel?.();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel', onPress: onCancel },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
