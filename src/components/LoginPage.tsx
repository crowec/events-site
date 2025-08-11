import React, { useState } from 'react';
import styles from './LoginPage.module.css';

interface LoginPageProps {
    onLogin: (password: string) => Promise<boolean>;
    error?: string | null;
}

const LoginPage = ({ onLogin, error: globalError }: LoginPageProps) => {
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const displayError = globalError || localError;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim()) {
            setLocalError('Password is required');
            return;
        }

        setIsLoading(true);
        setLocalError('');

        try {
            const success = await onLogin(password);
            if (!success) {
                setLocalError('Invalid password');
                setPassword('');
            }
        } catch (err) {
            setLocalError('Connection error. Please try again.');
            setPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.matrix}>
                {Array.from({ length: 100 }).map((_, i) => {
                    // Only show ~75% of columns to create gaps
                    if (i % 7 === 0) return null;

                    return (
                        <div
                            key={i}
                            className={styles.matrixColumn}
                            style={{
                                animationDelay: `${(i * 0.3) % 6}s`,
                                animationDuration: `${6 + (i % 4)}s`,
                            }}
                        >
                            {Array.from({ length: 15 }).map((_, j) => (
                                <span
                                    key={j}
                                    className={styles.matrixChar}
                                    style={{
                                        opacity: Math.random() > 0.2 ? 0.6 : 0,
                                    }}
                                >
                                    {(i + j) % 10}
                                </span>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className={styles.content}>
                <div className={styles.terminal}>
                    <div className={styles.welcomeText}>
                        <h1 className={styles.title}>EVENT ACCESS</h1>
                        <p className={styles.subtitle}>
                            Enter password to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.passwordInput}
                            placeholder="Enter password..."
                            disabled={isLoading}
                        />

                        {displayError && (
                            <div className={styles.error}>
                                ERROR: {displayError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'VERIFYING...' : 'ACCESS'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    // return (
    //   <div className="login-container">
    //     <div className="login-form">
    //       <h1>Welcome</h1>
    //       <form onSubmit={handleSubmit}>
    //         <input
    //           type="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           placeholder="Password"
    //           required
    //           disabled={isLoading}
    //           className={displayError ? 'error' : ''}
    //         />
    //         <button type="submit" disabled={isLoading}>
    //           {isLoading ? 'Verifying...' : 'Access'}
    //         </button>
    //       </form>
    //       {displayError && <div className="error-message">{displayError}</div>}
    //     </div>
    //   </div>
    // )
};

export default LoginPage;
