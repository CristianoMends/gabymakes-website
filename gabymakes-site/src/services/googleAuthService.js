// src/services/googleAuthService.js
import { useGoogleLogin } from '@react-oauth/google';

export const useGoogleAuthService = (onSuccessCallback, onErrorCallback) => {
    const signInWithGoogle = useGoogleLogin({
        onSuccess: (credentialResponse) => {
            console.log("Google Login Successful (credentialResponse):", credentialResponse);
            // credentialResponse agora terá 'code' e não 'credential'
            if (credentialResponse && typeof credentialResponse.code === 'string') {
                if (onSuccessCallback) {
                    onSuccessCallback(credentialResponse); // Passa o objeto completo com 'code'
                }
            } else {
                console.error("Google Login Success: No 'code' found in response.", credentialResponse);
                onErrorCallback({ error: "missing_auth_code", details: "Auth code not found in Google response." });
            }
        },
        onError: (errorResponse) => {
            console.error('Google Login Failed:', errorResponse);
            if (onErrorCallback) {
                onErrorCallback(errorResponse);
            }
        },
        // Mude para 'auth-code'
        flow: 'auth-code', // <--- MUDANÇA AQUI
    });

    return signInWithGoogle;
};